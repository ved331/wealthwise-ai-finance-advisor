// api.js - Centralized API calls logic

/**
 * Helper function to handle API requests
 * @param {string} endpoint - The API endpoint relative to base URL
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} data - The payload for POST/PUT requests
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const baseUrl = window.CONFIG ? window.CONFIG.API_BASE_URL : 'http://localhost:5000/api';
    const url = `${baseUrl}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API Request failed for ${endpoint}:`, error);
        throw error;
    }
}

// Export API service functions
window.ApiService = {
    // Auth
    login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
    register: (userData) => apiRequest('/auth/register', 'POST', userData),
    
    // User / Dashboard
    getDashboardData: () => apiRequest('/dashboard'),
    getTransactions: () => apiRequest('/transactions'),
    
    // AI Chat & Live Suggestions
    sendMessageToAI: (message, profile = {}) => apiRequest('/ai/chat', 'POST', { message, profile }),
    getLiveSuggestions: (profile = {}) => apiRequest('/ai/suggestions', 'POST', { profile }),
    
    // Market & Alerts
    getStockQuote: (ticker) => apiRequest(`/market/quote/${ticker}`),
    getAlerts: () => apiRequest('/alerts')
};

