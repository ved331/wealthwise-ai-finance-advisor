const apiKeys = require('../config/apiKeys');

const fetchStockQuote = async (ticker) => {
    if (!apiKeys.alphaVantageKey) {
        return {
            ticker: ticker.toUpperCase(),
            price: null,
            change: null,
            timestamp: new Date().toISOString(),
            note: 'Alpha Vantage API key not configured.'
        };
    }

    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${apiKeys.alphaVantageKey}`);
        if (!response.ok) {
            throw new Error(`Alpha Vantage API error: ${response.status}`);
        }

        const data = await response.json();
        const quote = data['Global Quote'] || {};

        return {
            ticker: ticker.toUpperCase(),
            price: quote['05. price'] || null,
            change: quote['09. change'] || null,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Stock quote fetch failed', error.message);
        return {
            ticker: ticker.toUpperCase(),
            price: null,
            change: null,
            timestamp: new Date().toISOString(),
            note: 'Unable to fetch live quote right now.'
        };
    }
};

module.exports = { fetchStockQuote };
