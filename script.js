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

export async function fetchData() {
    const query = document.getElementById('wordInput').value;
    document.getElementById('result').innerHTML = ''; // Clear previous results

    try {
        await fetchWord(query);
        await fetchNews(query);
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}