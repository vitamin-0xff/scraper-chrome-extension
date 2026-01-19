import { useState } from 'react'
import './App.css'
import TabNav from './TabNav';
import { SelectRootElement } from './steps/SelectRootElement';
import { SelectChildren } from './steps/SelectChildren';
import { SelectPagination } from './steps/SelectPagination';
import { PreviewExecution } from './steps/PreviewExecution';
import Logo from '../../assets/crx.svg';
import { useUIStore } from './store';

function App() {
  const [show, setShow] = useState(false)
  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  
  const toggle = () => setShow(!show)

  return (
    <div className="crx-ext-popup-container crx-ext-root-ext">
      {show && (
        <div className="crx-ext-popup-card crx-ext-popup-content" style={{
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="crx-ext-tab-content">
            {activeTab === 'root' && (
              <div className="crx-ext-tab-pane crx-ext-fade-in">
                <SelectRootElement />
              </div>
            )}
            {activeTab === 'children' && (
              <div className="crx-ext-tab-pane crx-ext-fade-in">
                <SelectChildren />
              </div>
            )}
            {activeTab === 'pagination' && (
              <div className="crx-ext-tab-pane crx-ext-fade-in">
                <SelectPagination />
              </div>
            )}
            {activeTab === 'preview' && (
              <div className="crx-ext-tab-pane crx-ext-fade-in">
                <PreviewExecution />
              </div>
            )}
          </div>
    </div>
  )}
      <button className="crx-ext-toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="crx-ext-button-icon" />
      </button>
  </div>
  )
}

export default App
