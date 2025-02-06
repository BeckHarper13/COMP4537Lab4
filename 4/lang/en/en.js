module.exports = {
    search: {
        success: (requestCount, word, definition, totalEntries) =>
            `Request #${requestCount}: Definition found for '${word}'.`,
        notFound: (requestCount, word) =>
            `Request #${requestCount}: Word '${word}' not found in the dictionary.`,
        invalidInput: 'Invalid input. Word must be a non-empty string.'
    },
    store: {
        success: (requestCount, word, definition, totalEntries) =>
            `Request #${requestCount}: New entry recorded successfully!`,
        duplicate: (requestCount, word, totalEntries) =>
            `Request #${requestCount}: Warning! '${word}' already exists in the dictionary.`,
        invalidInput: 'Invalid input. Word and definition must be non-empty strings.',
        invalidJSON: 'Invalid JSON body.'
    },
    general: {
        routeNotFound: 'Route not found.'
    }
};