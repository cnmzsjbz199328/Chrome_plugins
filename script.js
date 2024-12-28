import { loadWords, saveWords, checkAndAddWord, displayWordList, exportWords, importWords, clearWords } from './history.js';
import { fetchWord } from './dictionary.js';
import { fetchNews } from './news.js';

// 添加消息监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in popup script:", message);
  if (message.type === "WORD_LOOKUP") {
    console.log("Word lookup request received in popup:", message.text);
    document.getElementById('wordInput').value = message.text;
    fetchData();
    sendResponse({ status: "Word received and processed in popup" });
  }
  return true; // 保持消息通道开放以进行异步响应
});

// 其余代码保持不变
document.getElementById('searchButton').addEventListener('click', fetchData);
document.getElementById('wordList').addEventListener('click', async (event) => {
  if (event.target.classList.contains('word-item')) {
    const word = event.target.dataset.word;
    await fetchWord(word);
    await fetchNews(word);
  }
});

document.getElementById('exportButton').addEventListener('click', () => {
  const format = document.getElementById('exportFormat').value;
  exportWords(format);
});
document.getElementById('importButton').addEventListener('click', () => {
  document.getElementById('importInput').click();
});
document.getElementById('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    await importWords(file);
  }
});

document.getElementById('clearButton').addEventListener('click', async () => {
  if (confirm('Are you sure you want to delete all word records?')) {
    await clearWords();
  }
});

async function fetchData() {
  const query = document.getElementById('wordInput').value;
  document.getElementById('result').innerHTML = ''; // 清除之前的结果

  try {
    await fetchWord(query);
    await fetchNews(query);
    console.log("Data fetched successfully for query:", query);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// 导出fetchData函数使其可被扩展的其他部分访问
window.fetchData = fetchData;