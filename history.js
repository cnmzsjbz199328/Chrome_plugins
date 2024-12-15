let words = [];
let currentIndex = 0;
const pageSize = 30;

export async function loadWords() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['words'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.words || []);
            }
        });
    });
}

export async function saveWords(newWords) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ words: newWords }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

export async function checkAndAddWord(word, phonetic) {
    words = await loadWords();
    const existingWord = words.find(w => w.word === word);
    if (!existingWord) {
        words.push({ word, phonetic });
        words.sort((a, b) => a.word.localeCompare(b.word));
        await saveWords(words);
    }
    displayWordList(words.slice(0, pageSize));
}

export function displayWordList(wordSubset) {
    const wordListDiv = document.getElementById('wordList');
    wordSubset.forEach(entry => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = entry.word;
        wordItem.dataset.word = entry.word; // Store the word in a data attribute
        wordListDiv.appendChild(wordItem);
    });
}

export async function exportWords(format) {
    const words = await loadWords();
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(words, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'words.json';
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'html') {
        let htmlContent = '<html><head><title>Words</title></head><body><table border="1"><tr><th>Word</th><th>Phonetic</th></tr>';
        words.forEach(word => {
            htmlContent += `<tr><td>${word.word}</td><td>${word.phonetic}</td></tr>`;
        });
        htmlContent += '</table></body></html>';
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'words.html';
        a.click();
        URL.revokeObjectURL(url);
    }
}

export async function importWords(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const newWords = JSON.parse(event.target.result);
            await saveWords(newWords);
            words = newWords;
            currentIndex = 0;
            displayWordList(words.slice(0, pageSize));
        } catch (error) {
            console.error('Error importing words:', error);
        }
    };
    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', async () => {
    words = await loadWords();
    displayWordList(words.slice(0, pageSize));
    currentIndex = pageSize;

    const observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
            const nextWords = words.slice(currentIndex, currentIndex + pageSize);
            displayWordList(nextWords);
            currentIndex += pageSize;
        }
    }, {
        root: document.querySelector('.word-list'),
        rootMargin: '0px',
        threshold: 1.0
    });

    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    document.querySelector('.word-list').appendChild(sentinel);
    observer.observe(sentinel);
});