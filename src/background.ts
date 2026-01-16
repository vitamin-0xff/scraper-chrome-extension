import { prepareCookieString } from "./utils/cookies";
import { isDataValid } from "./utils/validate";
import {parseHTML} from 'linkedom';


const LOG = (...data: any[]) => {
    console.log("Background Script:", ...data);
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    LOG('Message received in background script:', message, sender);
    if(message?.action === 'DEVTOOLS_SELECTION' && message.tabId) {
        // Forward DevTools selection to the inspected tab's content script
        chrome.tabs.sendMessage(message.tabId, {
            action: 'DEVTOOLS_SELECTION',
            payload: message.payload,
        }).then((resp) => {
            LOG('Forwarded selection response:', resp);
        }).catch((err) => {
            LOG('Failed to forward selection:', err);
        });
        sendResponse({ status: 'forwarded' });
        return true; // Keep channel open for async sendMessage
    }
});

chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name !== 'EXECUTE_OPERATION') return;
  port.onMessage.addListener(async (msg) => {
    if (msg.action === 'EXECUTE_EXTRACTION') {
        console.log('Background Script: EXECUTE_EXTRACTION received', msg.data);
      if(isDataValid(msg.data) === false) {
        port.postMessage({ status: 'error', message: 'Invalid extraction data.' });
        console.log('Background Script: Invalid extraction data received');
        return;
      }
      port.postMessage({ status: 'started' });
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
      
      console.log('Background Script: Active tab URL', tab);
      let pickedBase = tab.url || msg.data.baseUrl ;
      const urlParsed = new URL(pickedBase);
      const url =  `${urlParsed.protocol}//${urlParsed.hostname}`
      console.log('Background Script: Using base URL', url);
      const domain = "https://tanitjobs.com"
      console.log('Background Script: Preparing to fetch with cookies ' + domain);
      let cookies = await chrome.cookies.getAll({
        url: domain
      });


      console.log('Background Script: Retrieved cookies', cookies);
      const stringCookies = prepareCookieString(cookies);
      const response = await fetch(msg.data.baseUrl, {
        method: 'GET',
        headers: {
          'Cookie': stringCookies,
        },
      });
      if (!response.ok) {
        port.postMessage({ status: 'error', message: `Failed to fetch URL: ${response.statusText}` });
        console.log({ status: 'error', message: `Failed to fetch URL: ${response.statusText} ${response.status}` });
        return;
      }
      const listOfElements: any[] = [];
      for(let page = 1; page <= (msg.data.maxNumberOfPages || 1); page++) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
        const pageUrl = new URL(msg.data.baseUrl);
        pageUrl.searchParams.set(msg.data.pageParam, page.toString());
        console.log(`Background Script: Fetching page ${page}: ${pageUrl.toString()}`);
        const pageResponse = await fetch(pageUrl.toString(), {
          method: 'GET',
          headers: {
            'Cookie': stringCookies,
          },
        });
        if (!pageResponse.ok) {
          port.postMessage({ status: 'error', message: `Failed to fetch page ${page}: ${pageResponse.statusText} status code ${pageResponse.status}` });
          console.log(`Background Script: Failed to fetch page ${page}: ${pageResponse.statusText} status code ${pageResponse.status}`);
          return;
        }
        const pageData = await pageResponse.text();
        const dom = parseHTML(pageData);
        const doc = dom.document;
        const elements = doc.querySelectorAll(`${msg.data.rootElement.tagName}.${msg.data.rootElement.className.split(' ').join('.')}`);
        console.log(`Background Script: Page ${page} - Found ${elements.length} root elements`);

        elements.forEach(el => {
            const element: any = {}
            msg.data.savedSelections.forEach((selection: any) => {
                const child = el.querySelector(`${selection.tagName}.${selection.className.split(' ').join('.')}`);
                element[selection.name] = child ? child.textContent : null;
            });
            listOfElements.push(element);
            console.log('Background Script: Extracted element', element);
        });
    }
        
      port.postMessage({ status: 'done' });
    }
  });
});

// STUB FUNCTIONS FOR FUTURE USE
// Uncomment and use these when implementing background script message passing

// // Example: Send message to active tab
// async function sendMessageToActiveTab(message: any) {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     if (tab?.id) {
//         const response = await chrome.tabs.sendMessage(tab.id, message);
//         LOG('[Background] Response from content script:', response);
//         return response;
//     }
// }

// // Example: Send message to specific tab by ID
// async function sendMessageToTab(tabId: number, message: any) {
//     try {
//         const response = await chrome.tabs.sendMessage(tabId, message);
//         LOG('[Background] Response from content script:', response);
//         return response;
//     } catch (error) {
//         console.error('[Background] Error sending message to tab:', error);
//     }
// }

// // Example: Send message to all tabs
// async function sendMessageToAllTabs(message: any) {
//     const tabs = await chrome.tabs.query({});
//     tabs.forEach(tab => {
//         if (tab.id) {
//             chrome.tabs.sendMessage(tab.id, message).catch((err) => {
//                 console.error('[Background] Error sending message to tab:', err);
//             });
//         }
//     });
// }

LOG('Background service worker is running');