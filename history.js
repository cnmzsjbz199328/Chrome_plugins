// Remove the import statement for Supabase
// import { createClient } from './lib/supabase.js';

let words = [];
let currentIndex = 0;
const pageSize = 20;
const MAX_WORDS = 1000;

// Supabase setup
const supabaseUrl = 'https://jkzpczopfazbxrwesbop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprenBjem9wZmF6Ynhyd2VzYm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDgyMzcsImV4cCI6MjA1MDAyNDIzN30.BtyE2X00kt_bD2OKfgR9AeU3JxCP0U0cJk-hLZ54MEg';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

export async function loadWords() {
    try {
        const { data, error } = await supabaseClient
            .from('words')
            .select('word, phonetic')
            .order('word');

        if (error) throw error;
        words = data || [];
        return words;
    } catch (error) {
        console.error('Error loading words:', error);
        return [];
    }
}

export async function saveWords(newWords) {
    try {
        const { error: deleteError } = await supabaseClient
            .from('words')
            .delete()
            .neq('word', '');
        
        if (deleteError) throw deleteError;

        if (newWords.length > 0) {
            const { error: insertError } = await supabaseClient
                .from('words')
                .insert(newWords);

            if (insertError) throw insertError;
        }
        
        await loadWords();
        displayWordList(words.slice(0, pageSize));
    } catch (error) {
        console.error('Error saving words:', error);
        throw error;
    }
}

export async function checkAndAddWord(word, phonetic) {
    try {
        const { data: existingData } = await supabaseClient
            .from('words')
            .select('word')
            .eq('word', word)
            .single();

        if (!existingData) {
            const { count } = await supabaseClient
                .from('words')
                .select('*', { count: 'exact' });

            if (count >= MAX_WORDS) {
                const { data: firstWord } = await supabaseClient
                    .from('words')
                    .select('word')
                    .order('word')
                    .limit(1);

                if (firstWord?.[0]) {
                    await supabaseClient
                        .from('words')
                        .delete()
                        .eq('word', firstWord[0].word);
                }
            }

            const { error: insertError } = await supabaseClient
                .from('words')
                .insert([{ word, phonetic }]);

            if (insertError) throw insertError;
            
            await loadWords();
            displayWordList(words.slice(0, pageSize));
        }
    } catch (error) {
        console.error('Error in checkAndAddWord:', error);
    }
}        

export function displayWordList(wordSubset) {
    const wordListDiv = document.getElementById('wordList');
    if (!wordListDiv) return;
    
    wordListDiv.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    wordSubset.forEach(entry => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = entry.word;
        wordItem.dataset.word = entry.word;
        fragment.appendChild(wordItem);
    });
    
    wordListDiv.appendChild(fragment);
}

export async function clearWords() {
    try {
        const { error } = await supabaseClient
            .from('words')
            .delete()
            .neq('word', '');

        if (error) throw error;
        words = [];
        currentIndex = 0;
        displayWordList([]);
    } catch (error) {
        console.error('Error clearing words:', error);
    }
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

export { words, currentIndex, pageSize };

// Initialize word list on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadWords();
        displayWordList(words.slice(0, pageSize));
        
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && currentIndex < words.length) {
                currentIndex += pageSize;
                const nextWords = words.slice(0, currentIndex);
                displayWordList(nextWords);
            }
        }, {
            root: document.querySelector('.word-list'),
            rootMargin: '100px',
            threshold: 0.1
        });

        const sentinel = document.createElement('div');
        sentinel.className = 'sentinel';
        document.querySelector('.word-list')?.appendChild(sentinel);
        observer.observe(sentinel);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});