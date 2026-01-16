import Logo from '@/assets/crx.svg'
import { useEffect, useRef, useState } from 'react'
import SelectionTable from './SelectionTable'
import TabNav from './TabNav'
import RootElementCard from './RootElementCard'
import SelectedElementInfo from './SelectedElementInfo'
import SelectionForm from './SelectionForm'
import PreviewExecute from './PreviewExecute'
import FetchingStatus from './FetchingStatus'
import { useElementPicker } from './useElementPicker'
import { resolveIdentifier, getIdentifierType, toJsonKey } from './utils'
import type { PickedElement, SelectionItem } from './types'
import './App.css'
import { FetchPatternDetection } from './FetchPatternDetection'
import { fetchElements } from '@/utils/fetch-elements'
import { downloadJSON, generateFilename } from '@/utils/download-json'

function App() {
  const [show, setShow] = useState(false)
  const [activeTab, setActiveTab] = useState<'pick' | 'table' | 'preview' | 'pagination'>('pick')
  const [isPickingElement, setIsPickingElement] = useState(false)
  const [selectedElement, setSelectedElement] = useState<PickedElement | null>(null)
  const [customName, setCustomName] = useState('')
  const [markAsRoot, setMarkAsRoot] = useState(false)
  const [isArray, setIsArray] = useState(false)
  const [rootElement, setRootElement] = useState<SelectionItem | null>(null)
  const [savedSelections, setSavedSelections] = useState<SelectionItem[]>([])
  const [_baseUrl, _setBaseUrl] = useState('');
  const [_pageParam, _setPageParam] = useState('');
  const [_otherParams, _setOtherParams] = useState<string[] | null>(null);
  const maxNumberRef = useRef<number>(0);
  // Reserved for future background script execution
  void useRef<chrome.runtime.Port | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const elements = useRef<any[]>([]);
  const [countCurrentPage, setCountCurrentPage] = useState<{
    page: number;
    elementNumber: number;
    totalElementsOnPage?: number;
  } | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [totalElementsFetched, setTotalElementsFetched] = useState(0);

  const toggle = () => setShow(!show)

  const LOG = (...data: any[]) => {
    console.log('Content Script:', ...data)
  }

  const localExecute = async () => {
    LOG('Starting local extraction...')
    
    // Reset state
    setFetching(true)
    setFetchError(null)
    setTotalElementsFetched(0)
    elements.current = []
    setCountCurrentPage(null)

    // Validate configuration
    if (!rootElement) {
      setFetchError('Root element not selected')
      setFetching(false)
      return
    }

    if (!savedSelections || savedSelections.length === 0) {
      setFetchError('No child selections found')
      setFetching(false)
      return
    }

    if (!_baseUrl) {
      setFetchError('Base URL not configured')
      setFetching(false)
      return
    }

    if (!_pageParam) {
      setFetchError('Page parameter not configured')
      setFetching(false)
      return
    }

    const data = {
      rootElement,
      savedSelections,
      baseUrl: _baseUrl,
      pageParam: _pageParam,
      otherParams: _otherParams,
      maxNumberOfPages: Math.max(1, maxNumberRef.current || 1),
    }

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      for await (const result of fetchElements(data)) {
        // Check for abort signal
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Fetch operation was cancelled')
        }

        // Handle errors from generator
        if ('type' in result && result.type === 'error') {
          console.error(`Error on page ${result.page}:`, result.message)
          // Continue fetching even if one page fails
          continue
        }

        // Type guard: ensure it's a FetchResult, not a FetchErrorEvent
        if (!('data' in result)) {
          continue
        }

        // Update state with fetched element
        setCountCurrentPage(result.p)
        setTotalElementsFetched(prev => prev + 1)
        elements.current.push(result.data)
        LOG('Fetched element:', result.data)
      }

      LOG('Extraction complete. Total elements:', elements.current.length)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      LOG('Extraction error:', errorMsg)
      setFetchError(errorMsg)
    } finally {
      setFetching(false)
      abortControllerRef.current = null
    }
  }

  const cancelFetch = () => {
    LOG('Cancelling fetch operation...')
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleElementPicked = (element: PickedElement) => {
    const identifier = resolveIdentifier(element)
    setSelectedElement(element)
    setCustomName(toJsonKey(identifier || element.tagName || ''))
    setMarkAsRoot(!rootElement)
  }

  const { startPicker } = useElementPicker(handleElementPicked, setIsPickingElement)

  const handleAddSelection = () => {
    if (!selectedElement) return

    const identifier = resolveIdentifier(selectedElement)
    const name = toJsonKey(customName || identifier || selectedElement.tagName || 'Unnamed')
    const href = selectedElement.href || null
    const identifierType = getIdentifierType(selectedElement)
    const tagName = selectedElement.tagName?.toLowerCase() || 'div'

    // Check for duplicate names
    const allNames = [...(rootElement ? [rootElement.name] : []), ...savedSelections.map(s => s.name)]
    if (allNames.includes(name)) {
      alert(`Name "${name}" already exists. Please choose a different name.`)
      return
    }

    const role: 'root' | 'child' = markAsRoot || !rootElement ? 'root' : 'child'
    const parentId = role === 'child' ? rootElement?.className || null : null

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const item: SelectionItem = {
      id,
      name,
      className: identifier,
      tagName,
      href,
      role,
      parentId,
      identifierType,
      isItArrya: isArray,
    }

    if (role === 'root') {
      if (rootElement) {
        alert('Only one root element is allowed. Remove the existing root first.')
        return
      }
      setRootElement(item)
    } else {
      setSavedSelections(prev => [...prev, item])
    }

    setIsArray(false)
    setCustomName('')
    setSelectedElement(null)
  }

  const handleRemoveSelection = (id: string) => {
    if (rootElement?.id === id) {
      setRootElement(null)
    } else {
      setSavedSelections(prev => prev.filter(item => item.id !== id))
    }
  }

  useEffect(() => {
    const handleMessage = (message: any, _: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      LOG('Message received in content script:', message)
      if (message.action === 'BACKGROUND_RESPONSE') {
        LOG(message.action, message.data)
      }
      if (message.action === 'DEVTOOLS_SELECTION') {
        LOG('Selected element from DevTools:', message.payload)
        const payload = message.payload as PickedElement
        const identifier = resolveIdentifier(payload)
        setSelectedElement(payload)
        setCustomName(toJsonKey(identifier || payload.tagName || ''))
        setMarkAsRoot(!rootElement)
        sendResponse({ status: 'selection-received' })
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [rootElement])

  return (
    <div className="popup-container">
      {show && (
        <div className={`popup-content ${show ? 'opacity-100' : 'opacity-0'} cont`} style={{width: 768}}>
          <h1 className='header'>Extractor</h1>
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'pick' && (
            <>
              {selectedElement && (
                <SelectedElementInfo element={selectedElement} />
              )}

              <SelectionForm
                customName={customName}
                onNameChange={name => setCustomName(toJsonKey(name))}
                isArray={isArray}
                onArrayChange={setIsArray}
                onAddSelection={handleAddSelection}
                hasRootElement={!!rootElement}
                canAddSelection={!!selectedElement && (markAsRoot || !!rootElement)}
              />

              {rootElement && (
                <RootElementCard rootElement={rootElement} onRemove={handleRemoveSelection} />
              )}
              <div className="f jc-end">
              <button
                onClick={startPicker}
                className='s'
                style={{
                  padding: '10px 20px',
                  backgroundColor: isPickingElement ? '#ff6b6b' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {isPickingElement ? 'Picking... (ESC to cancel)' : 'Pick Element'}
              </button>
              </div>

            </>
          )}

          {activeTab === 'table' && (
            <div className='bs'>
              <p className='header s'>Saved selections</p>
              <SelectionTable items={savedSelections} onRemove={handleRemoveSelection} />
            </div>
          )}

          {activeTab === 'pagination' && (
              <div
              >
                <FetchPatternDetection onPatternDetected={(baseUrl_, pageParam_, otherParams_) => {
                  _setBaseUrl(baseUrl_)
                  _setPageParam(pageParam_)
                  _setOtherParams(otherParams_)
                }}
                defaultPageParam={_pageParam} 
                defaultBaseUrl={_baseUrl}
                defaultOtherParams={_otherParams}
                />
              </div>
            )  
          }
          {activeTab === 'preview' && (
            <>
              <FetchingStatus
                onDownload={() => {
                  downloadJSON(elements.current, generateFilename('extracted-data'));
                }}
                fetching={fetching}
                currentPage={countCurrentPage?.page ?? null}
                elementCount={totalElementsFetched}
                error={fetchError}
                onCancel={cancelFetch}
              />
              <PreviewExecute
                fetching={fetching}
                rootElement={rootElement}
                children={savedSelections}
                baseUrl={_baseUrl}
                pageParam={_pageParam}
                executeCallback={localExecute}
                maxNumberOfPages={maxNumberRef.current}
                onMaxNumberOfPagesChange={(newValue) => {
                  maxNumberRef.current = newValue ?? 0;
                  console.log('Max number of pages updated to:', maxNumberRef.current);
                }}
              />
            </>
          )}
        </div>
      )}
      <button className="toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="button-icon" />
      </button>
    </div>
  )
}

export default App
