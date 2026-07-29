// Centralized location to retrieve API keys securely from environment variables
module.exports = {
    openAiKey: process.env.OPENAI_API_KEY || null,
    alphaVantageKey: process.env.ALPHAVANTAGE_API_KEY || null,
    jwtSecret: process.env.JWT_SECRET || 'secret'
};
