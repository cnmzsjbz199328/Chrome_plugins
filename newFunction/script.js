import { loadWords, saveWords, checkAndAddWord, displayWordList, exportWords, importWords } from './history.js';
import { fetchWord } from './dictionary.js';
import { fetchNews } from './news.js';

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

document.addEventListener('lookupWordEvent', async (event) => {
  console.log("CustomEvent received in page script:", event.detail); // 添加日志
  const word = event.detail.text;
  console.log("LOOKUP_WORD event received with word:", word); // 添加日志
  document.getElementById('wordInput').value = word; // 将单词填入输入框
  await fetchData(); // 执行查询操作
});

export async function fetchData() {
  const query = document.getElementById('wordInput').value;
  console.log("Fetching data for query:", query); // 添加日志
  document.getElementById('result').innerHTML = ''; // Clear previous results

  try {
    const wordData = await fetchWord(query);
    const newsData = await fetchNews(query);
    console.log("Data fetched successfully for query:", query); // 添加日志
    displayResults(wordData, newsData); // 显示查询结果
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayResults(wordData, newsData) {
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    <h2>Word Data</h2>
    <pre>${JSON.stringify(wordData, null, 2)}</pre>
    <h2>News Data</h2>
    <pre>${JSON.stringify(newsData, null, 2)}</pre>
  `;
}