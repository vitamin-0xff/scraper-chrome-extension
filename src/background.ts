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

// Example: Send message to active tab
async function sendMessageToActiveTab(message: any) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, message);
        LOG('[Background] Response from content script:', response);
        return response;
    }
}

// Example: Send message to specific tab by ID
async function sendMessageToTab(tabId: number, message: any) {
    try {
        const response = await chrome.tabs.sendMessage(tabId, message);
        LOG('[Background] Response from content script:', response);
        return response;
    } catch (error) {
        console.error('[Background] Error sending message to tab:', error);
    }
}

// Example: Send message to all tabs
async function sendMessageToAllTabs(message: any) {
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
        if (tab.id) {
            chrome.tabs.sendMessage(tab.id, message).catch(err => {
                // Ignore errors for tabs without content scripts
                LOG(`Tab ${tab.id} doesn't have content script`);
            });
        }
    });
}

LOG('Background service worker is running');