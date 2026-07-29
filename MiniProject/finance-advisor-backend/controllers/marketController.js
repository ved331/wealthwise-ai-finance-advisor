const { fetchStockQuote } = require('../services/stockService');

// @desc    Get stock quote
// @route   GET /api/market/quote/:ticker
// @access  Private
const getQuote = async (req, res) => {
    try {
        const { ticker } = req.params;
        
        if (!ticker) {
            return res.status(400).json({ message: 'Ticker symbol is required' });
        }

        const data = await fetchStockQuote(ticker);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getQuote
};
