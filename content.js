console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.type === "LOOKUP_WORD") {
    console.log("Received LOOKUP_WORD message:", message);
    try {
      // 执行查找单词的逻辑
      sendResponse({ status: "Message received in content script" });
    } catch (error) {
      console.error("Error in content script:", error);
      sendResponse({ status: "Error", message: error.message });
    }
    return true; // 必须返回true以发送响应
  }
});