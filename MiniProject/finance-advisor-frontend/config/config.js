// config.js - Global configuration settings

const CONFIG = {
    // API Endpoints
    API_BASE_URL: 'http://localhost:5000/api', // Example backend URL
    
    // Application Settings
    APP_NAME: 'FinAI',
    VERSION: '1.0.0',
    
    // Feature Flags
    ENABLE_NOTIFICATIONS: true,
    ENABLE_AI_CHAT: true,
    
    // Theme Constants
    THEME: {
        darkMode: true,
        primaryColor: '#3b82f6',
        accentColor: '#8b5cf6'
    }
};

// Make config globally available
window.CONFIG = CONFIG;
