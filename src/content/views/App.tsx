import Logo from '@/assets/crx.svg'
import { useEffect, useState } from 'react'
import SelectionTable from './SelectionTable'
import TabNav from './TabNav'
import RootElementCard from './RootElementCard'
import SelectedElementInfo from './SelectedElementInfo'
import SelectionForm from './SelectionForm'
import { useElementPicker } from './useElementPicker'
import { resolveIdentifier, getIdentifierType, toJsonKey } from './utils'
import type { PickedElement, SelectionItem } from './types'
import './App.css'

function App() {
  const [show, setShow] = useState(false)
  const [activeTab, setActiveTab] = useState<'pick' | 'table'>('pick')
  const [isPickingElement, setIsPickingElement] = useState(false)
  const [selectedElement, setSelectedElement] = useState<PickedElement | null>(null)
  const [customName, setCustomName] = useState('')
  const [markAsRoot, setMarkAsRoot] = useState(false)
  const [isArray, setIsArray] = useState(false)
  const [rootElement, setRootElement] = useState<SelectionItem | null>(null)
  const [savedSelections, setSavedSelections] = useState<SelectionItem[]>([])

  const toggle = () => setShow(!show)

  const LOG = (...data: any[]) => {
    console.log('Content Script:', ...data)
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
        <div className={`popup-content ${show ? 'opacity-100' : 'opacity-0'}`}>
          <h1>EXTRACTOR</h1>

          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'pick' && (
            <>
              <button
                onClick={startPicker}
                style={{
                  padding: '10px 20px',
                  margin: '10px',
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
            </>
          )}

          {activeTab === 'table' && (
            <div
              style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <h3 style={{ marginTop: 0 }}>Saved selections</h3>
              <SelectionTable items={savedSelections} onRemove={handleRemoveSelection} />
            </div>
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
