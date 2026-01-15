const LOG = (...data: any[]) => {
  console.log('DevTools:', ...data);
};

const inspectedTabId = chrome.devtools.inspectedWindow.tabId;

function sendSelectedElement() {
  LOG('Fetching selected element...');
  chrome.devtools.inspectedWindow.eval(
    '($0)',
    { useContentScriptContext: true },
    (result, exceptionInfo) => {
      if (exceptionInfo) {
        LOG('Eval error:', exceptionInfo);
        return;
      }
      if (!result) {
        LOG('No element selected ($0 is null)');
        return;
      }
      
      // Get the serializable data from the element
      chrome.devtools.inspectedWindow.eval(
        `(() => {
          const node = $0;
          if (!node) return null;
          return {
            tagName: node.tagName,
            id: node.id || null,
            className: node.className || null,
            outerHTML: node.outerHTML.substring(0, 500),
          };
        })();`,
        { useContentScriptContext: true },
        (elementData, err) => {
          if (err) {
            LOG('Error getting element data:', err);
            return;
          }
          LOG('Selected element:', elementData);
          chrome.runtime.sendMessage({
            action: 'DEVTOOLS_SELECTION',
            tabId: inspectedTabId,
            payload: elementData,
          });
        }
      );
    }
  );
}

// Listen for selection changes in the Elements panel
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  LOG('Element selection changed');
  setTimeout(() => sendSelectedElement(), 100);
});

LOG('DevTools page loaded');
