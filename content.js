console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.type === "LOOKUP_WORD") {
    console.log("Received LOOKUP_WORD message:", message);
    try {
      // Instead of dispatching a custom event, send a message to the extension
      chrome.runtime.sendMessage({
        type: "WORD_LOOKUP",
        text: message.text
      }, response => {
        console.log("Response from extension:", response);
      });
      sendResponse({ status: "Message forwarded to extension" });
    } catch (error) {
      console.error("Error in content script:", error);
      sendResponse({ status: "Error", message: error.message });
    }
    return true; // Keep the message channel open for asynchronous response
  }
});