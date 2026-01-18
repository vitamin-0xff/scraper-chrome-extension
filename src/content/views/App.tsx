import { useEffect, useState } from 'react'
import './App.css'
import TabNav, { StatusTab } from './TabNav';
import { SelectRootElement } from './steps/SelectRootElement';
import { SelectChildren } from './steps/SelectChildren';
import { SelectPagination } from './steps/SelectPagination';
import { PreviewExecution } from './steps/PreviewExecution';
import Logo from '../../assets/crx.svg';
import { ChildElement } from './types';
import { type PaginationConfig } from './algorithms/extractionEngine';

function App() {
  const [show, setShow] = useState(false)
  const [currentActiveTab, setCurrentActiveTab] = useState<StatusTab>('root');
  const [rootNativeElement, setRootNativeElement] = useState<HTMLElement | null>(null);
  const [rootSelector, setRootSelector] = useState<string>('');
  const [childElements, setChildElements] = useState<ChildElement[]>([]);
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig | null>(null);
  
  const toggle = () => setShow(!show)

  const handleAddChild = (child: ChildElement) => {
    setChildElements(prev => [...prev, child]);
  };

  const handleRemoveChild = (id: string) => {
    setChildElements(prev => prev.filter(child => child.id !== id));
  };

  const handleConfigChange = (config: PaginationConfig) => {
    setPaginationConfig(config);
  };

  const onRootElementSelected = (rootElement: HTMLElement | null, selector?: string) => {
    console.log("Root Element Changed");
    setRootNativeElement(rootElement);
    if (selector) {
      setRootSelector(selector);
    }
  }

  useEffect(() => {
    console.log("Root Element Updated:", rootNativeElement);
    console.log("Root Selector Updated:", rootSelector);
  }, [rootNativeElement, rootSelector]);

  return (
    <div className="crx-ext-popup-container crx-ext-root-ext">
      {show && (
        <div className="crx-ext-popup-card crx-ext-popup-content" style={{
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <TabNav activeTab={currentActiveTab} onTabChange={setCurrentActiveTab} />
          {currentActiveTab === 'root' && (
            <SelectRootElement 
              rootElement={rootNativeElement} 
              rootSelector={rootSelector}
              onRootElementSelected={onRootElementSelected}
            />
          )}
          {currentActiveTab === 'children' && (
            <SelectChildren 
              rootElement={rootNativeElement}
              childrenElements={childElements}
              onChildElementAdded={handleAddChild}
              onChildElementRemoved={handleRemoveChild}
            />
          )}
          {currentActiveTab === 'pagination' && (
            <SelectPagination 
              onConfigChange={handleConfigChange}
              initialConfig={paginationConfig || undefined}
            />
          )}
          {currentActiveTab === 'preview' && (
            <PreviewExecution 
              rootElement={rootNativeElement}
              rootSelector={rootSelector}
              childElements={childElements}
              paginationConfig={paginationConfig}
            />
          )}
    </div>
  )}
      <button className="crx-ext-toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="crx-ext-button-icon" />
      </button>
  </div>
  )
}

export default App
