const { getFinanceAdvice, getLiveSuggestions } = require('../services/aiService');

// @desc    Get AI financial advice based on user chat message
// @route   POST /api/ai/chat
// @access  Public / Private
const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const userProfile = req.user?.profile || req.body.profile || {};
        const response = await getFinanceAdvice(message, userProfile);
        
        res.json({ reply: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Live API AI Suggestions and Market Insights
// @route   GET or POST /api/ai/suggestions
// @access  Public / Private
const getSuggestions = async (req, res) => {
    try {
        const userProfile = req.user?.profile || req.body?.profile || req.query || {};
        const suggestionsData = await getLiveSuggestions(userProfile);
        
        res.json(suggestionsData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    chatWithAI,
    getSuggestions
};

