chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.contextMenus.create({
    id: "lookupWord",
    title: "Look up word",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu item clicked:", info.selectionText);
  console.log("Tab info:", tab);
  if (info.menuItemId === "lookupWord" && tab.id >= 0) {
    console.log("Sending message to content script for tab:", tab.id);
    chrome.tabs.sendMessage(tab.id, { type: "LOOKUP_WORD", text: info.selectionText }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else if (response) {
        console.log("Message sent successfully, response:", response);
      } else {
        console.log("Message sent successfully, but no response received");
      }
    });
  } else {
    console.error("Invalid tab ID or menu item not clicked:", tab);
  }
});