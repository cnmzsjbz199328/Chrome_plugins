Modern Dictionary Chrome Extension
Introduction
Modern Dictionary is a Chrome extension that provides convenient ways to look up word definitions and related news. It offers both popup dictionary and right-click context menu lookup features, making it easy to find definitions without leaving your current page.

Features
Multiple Lookup Methods

Search words directly in the popup interface
Right-click on any word on a webpage to look it up instantly
Comprehensive Word Information

Detailed definitions from dictionary API
Related news articles for broader context
Phonetic pronunciations where available
Word History Management

Save lookup history for quick access later
Export history in JSON or HTML format
Import previously exported word lists
Clear all history with one click
Modern User Interface

Clean, responsive design
Custom styled scrollbars
Easy navigation between word history and search results
Installation
Download or clone this repository
Open Chrome and navigate to chrome://extensions/
Enable "Developer mode" by toggling the switch in the top right corner
Click "Load unpacked" and select the directory containing the extension files
The Modern Dictionary extension should now appear in your extensions list and toolbar
Usage
Popup Dictionary
Click the Modern Dictionary icon in the Chrome toolbar
Enter a word in the search box and click "Search" or press Enter
View the definition, pronunciation, and related news
Context Menu Lookup
Select a word on any webpage
Right-click and select "Look up word" from the context menu
The definition will appear in the extension popup
Word History
All looked up words are automatically saved to your history
Click on any word in the history list to view its definition again
Export your word history by selecting a format and clicking "Export"
Import previously exported word lists by clicking "Import"
Clear your entire word history by clicking "Clear All"
Technical Architecture
The extension is built using vanilla JavaScript with a modular architecture:

background.js: Handles context menu creation and background processes
content.js: Communicates between webpages and the extension
script.js: Main popup interface logic
dictionary.js: Handles dictionary API requests and response formatting
news.js: Fetches and displays related news articles
history.js: Manages word history storage and retrieval
API Integration
The extension integrates with:

Dictionary API for word definitions
News APIs for related articles
Data Privacy
The extension stores word history locally in your browser. No data is sent to external servers except for API requests to fetch definitions and news articles.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

License
This project is licensed under the MIT License - see the LICENSE file for details.