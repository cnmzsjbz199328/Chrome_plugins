import { checkAndAddWord } from './history.js';

export async function fetchWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Dictionary API request failed');
        }
        const data = await response.json();
        displayDictionaryResult(data);
        const phonetic = data[0].phonetic || '';
        await checkAndAddWord(word, phonetic);
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML += `<p>Error: ${error.message}</p>`;
    }
}

export function displayDictionaryResult(data) {
    const resultDiv = document.getElementById('result');

    data.forEach(entry => {
        const word = document.createElement('h2');
        word.textContent = entry.word;
        resultDiv.appendChild(word);

        const phonetic = document.createElement('div');
        phonetic.className = 'phonetic';
        phonetic.textContent = entry.phonetic;
        resultDiv.appendChild(phonetic);

        entry.phonetics.forEach(p => {
            if (p.audio) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = p.audio;
                phonetic.appendChild(audio);
            }
        });

        entry.meanings.forEach(meaning => {
            const partOfSpeech = document.createElement('h3');
            partOfSpeech.textContent = meaning.partOfSpeech;
            resultDiv.appendChild(partOfSpeech);

            meaning.definitions.forEach(def => {
                const definition = document.createElement('p');
                definition.textContent = def.definition;
                resultDiv.appendChild(definition);

                if (def.example) {
                    const example = document.createElement('p');
                    example.className = 'example';
                    example.textContent = `Example: ${def.example}`;
                    resultDiv.appendChild(example);
                }
            });
        });
    });
}
