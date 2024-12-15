export async function fetchNews(query) {
    const url = `https://news-api14.p.rapidapi.com/v2/search/publishers?query=${query}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '4df6095d12msh6cd43ab48f6cab8p1694d8jsnc2a8cc7e98f4',
            'x-rapidapi-host': 'news-api14.p.rapidapi.com'
        }
    };

    try {
        console.log(`Fetching news with query: ${query}`); // Debugging line
        const response = await fetch(url, options);
        console.log(`Response status: ${response.status}`); // Debugging line
        if (!response.ok) {
            throw new Error(`News API request failed with status ${response.status}`);
        }
        const result = await response.json();
        console.log('API response data:', result); // Debugging line
        displayNewsResult(result);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML += `<p>Error: ${error.message}</p>`;
    }
}

export function displayNewsResult(data) {
    const resultDiv = document.getElementById('result');
    const newsSection = document.createElement('div');
    newsSection.className = 'news';
    const newsTitle = document.createElement('h3');
    newsTitle.textContent = 'Relevent News';
    newsSection.appendChild(newsTitle);

    if (data.data && data.data.length > 0) {
        data.data.forEach(publisher => {
            if (publisher.language === 'en') {
                const template = document.getElementById('news-template').content.cloneNode(true);
                const publisherDiv = template.querySelector('.publisher');
                const publisherLogo = publisherDiv.querySelector('.publisher-logo');
                const publisherName = publisherDiv.querySelector('.publisher-name');
                const publisherDescription = publisherDiv.querySelector('.publisher-description');

                publisherLogo.src = publisher.logo || publisher.favicon;
                publisherLogo.alt = `${publisher.name} logo`;
                publisherLogo.onerror = function() {
                    this.style.display = 'none';
                    const errorMessage = document.createElement('span');
                    errorMessage.textContent = "Oops, pic failed, not my bad.";
                    errorMessage.id = 'default-message'; // 设置 id 属性
                    this.parentNode.insertBefore(errorMessage, publisherName);
                };
                publisherName.href = publisher.url;
                publisherName.textContent = publisher.name;
                publisherDescription.textContent = publisher.description;

                newsSection.appendChild(publisherDiv);
            }
        });
    } else {
        const noResults = document.createElement('p');
        noResults.textContent = 'No news results found.';
        newsSection.appendChild(noResults);
    }

    resultDiv.appendChild(newsSection);
}