// Add status indicator
console.log("[Content] Script loaded");
window.dictionaryContentScriptLoaded = true;


// Create floating UI
function createFloatingUI() {
  const container = document.createElement('div');
  container.id = 'dictionary-container';
  container.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    max-width: 400px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  document.body.appendChild(container);
  return container;
}

// Show results in floating UI
function showResults(word, data) {
  let container = document.getElementById('dictionary-container');
  if (!container) {
    container = createFloatingUI();
  }
  
  const meanings = data[0].meanings.map(meaning => `
    <div class="meaning">
      <h4>${meaning.partOfSpeech}</h4>
      <ul>
        ${meaning.definitions.map(def => `
          <li>${def.definition}</li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center">
      <h3 style="margin: 0">${word}</h3>
      <button onclick="this.parentElement.parentElement.remove()" style="border: none; background: none; cursor: pointer">×</button>
    </div>
    <p style="color: #666">${data[0].phonetic || ''}</p>
    ${meanings}
  `;
}

// Listen for lookup requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Content] Message received:", message);
  
  if (message.type === "LOOKUP_WORD") {
    const word = message.text;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        console.log("[Content] Word data:", data);
        showResults(word, data);
        sendResponse({ status: "success" });
      })
      .catch(error => {
        console.error("[Content] Error:", error);
        sendResponse({ status: "error", message: error.message });
      });
    return true;
  }
});