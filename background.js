chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.contextMenus.create({
    id: "lookupWord",
    title: "Look up word",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "lookupWord" && tab.id >= 0) {
    try {
      // 首先打开popup
      await chrome.action.openPopup();
      
      // 等待一小段时间确保popup已经加载
      await new Promise(resolve => setTimeout(resolve, 500));

      // 然后发送消息
      chrome.runtime.sendMessage({
        type: "WORD_LOOKUP",
        text: info.selectionText
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message to popup:", chrome.runtime.lastError);
        } else {
          console.log("Response from popup:", response);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
});