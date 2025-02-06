const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

// Import user messages from en.js
const messages = require('./4/lang/en/en.js');

class DictionaryAPI {
    constructor() {
        this.dictionary = []; // in memory storage for dictionary entries
        this.requestCount = 0; // counter for total requests saved
    }

    // method to handle incoming requests
    handleRequest(req, res) {
        this.requestCount++;

        // parse URL and query parameters
        const parsedURL = url.parse(req.url, true);
        const pathName = parsedURL.pathname;
        const query = parsedURL.query;

        // Serve HTML files
        if (pathName === '/search' || pathName === '/store') {
            this.serveHTML(pathName, res);
            return;
        }

        // parse the request body for POST requests
        const decoder = new StringDecoder('utf-8');
        let buffer = '';

        req.on('data', (data) => {
            buffer += decoder.write(data);
        });

        req.on('end', () => {
            buffer += decoder.end();

            let response;

            // Handle POST requests to add a new word and definition
            if (pathName === '/api/definitions' && req.method === 'POST') {
                response = this.handlePostRequest(buffer);
            }

            // Handle GET requests to retrieve a definition by word
            else if (pathName === '/api/definitions' && req.method === 'GET') {
                response = this.handleGetRequest(query);
            }

            // Handle invalid routes
            else {
                response = {
                    statusCode: 404,
                    message: messages.general.routeNotFound
                };
            }

            // Send the response
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response, null, 2)); // Pretty-print JSON
        });
    }

    // Serve HTML files
    serveHTML(pathName, res) {
        let filePath;

        if (pathName === '/search') {
            filePath = path.join(__dirname, '/4/public/search.html');
        } else if (pathName === '/store') {
            filePath = path.join(__dirname, '/4/public/store.html');
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    // method to handle POST request
    handlePostRequest(buffer) {
        let body;
        try {
            body = JSON.parse(buffer);
        } catch (e) {
            return {
                statusCode: 400,
                message: messages.store.invalidJSON
            };
        }

        const { word, definition } = body;

        // Input validation
        if (!word || !definition || typeof word !== 'string' || typeof definition !== 'string') {
            return {
                statusCode: 400,
                message: messages.store.invalidInput
            };
        }

        // Check if the word already exists
        const existingEntry = this.dictionary.find(entry => entry.word === word);
        if (existingEntry) {
            return {
                statusCode: 409,
                message: messages.store.duplicate(this.requestCount, word, this.dictionary.length),
                word,
                definition: existingEntry.definition,
                totalEntries: this.dictionary.length
            };
        }

        // Add the new word and definition to the dictionary
        this.dictionary.push({ word, definition });

        return {
            statusCode: 201,
            message: messages.store.success(this.requestCount, word, definition, this.dictionary.length),
            word,
            definition,
            totalEntries: this.dictionary.length
        };
    }

    // method to handle GET requests
    handleGetRequest(query) {
        const { word } = query;

        // Input validation
        if (!word || typeof word !== 'string') {
            return {
                statusCode: 400,
                message: messages.search.invalidInput
            };
        }

        // Find the word in the dictionary
        const entry = this.dictionary.find(entry => entry.word === word);
        if (entry) {
            return {
                statusCode: 200,
                message: messages.search.success(this.requestCount, word, entry.definition, this.dictionary.length),
                word: entry.word,
                definition: entry.definition,
                totalEntries: this.dictionary.length
            };
        } else {
            return {
                statusCode: 404,
                message: messages.search.notFound(this.requestCount, word)
            };
        }
    }
}

// Create an instance of the DictionaryAPI class
const dictionaryAPI = new DictionaryAPI();

// Create the HTTP server
const server = http.createServer((req, res) => {
    dictionaryAPI.handleRequest(req, res);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);


});