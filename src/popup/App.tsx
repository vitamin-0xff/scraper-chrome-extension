import './App.css'

const LOG = (...data: any[]) => {
  console.log("Popup Script:", ...data);
}

export default function App() {
  const sendMessageToBackground = async () => {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      const currentTabId = await chrome.tabs?.getCurrent() || 'unknown';
      LOG('Current Tab ID:', currentTabId);
      chrome.runtime.sendMessage({ greeting: 'hello from popup' }, (response) => {
        LOG('Response from background:', response)
      })
    } else {
      LOG('chrome.runtime.sendMessage is not available')
    }   
  }

  return (
    <>
      <div className="flex gap-2 my-2 justify-center">
        <button onClick={sendMessageToBackground} className="button button-send-message">
          Send Message to Background
        </button>
      </div>
    </>
  )
}
