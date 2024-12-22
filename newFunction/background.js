chrome.runtime.onInstalled.addListener(() => {
  console.log("[Background] Extension installed");
  chrome.contextMenus.create({
    id: "lookupWord",
    title: "Look up word",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("[Background] Context menu clicked:", info.selectionText);
  if (info.menuItemId === "lookupWord" && tab.id >= 0) {
    try {
      // First inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      
      // Then send the message
      chrome.tabs.sendMessage(tab.id, { 
        type: "LOOKUP_WORD", 
        text: info.selectionText 
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[Background] Error:', chrome.runtime.lastError);
          return;
        }
        console.log('[Background] Response received:', response);
      });
    } catch (error) {
      console.error('[Background] Script injection error:', error);
    }
  }
});