// chat.js - AI Chatbot logic with live API integration

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }

    // Load live suggestions as chat chips on startup
    loadLiveChatSuggestions();
});

// Send a quick prompt from a chip button
window.sendQuickPrompt = function(promptText) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = promptText;
        const event = new Event('submit', { cancelable: true, bubbles: true });
        const form = document.getElementById('chat-form');
        if (form) form.dispatchEvent(event);
    }
};

// Load personalised quick suggestion chips from live API
async function loadLiveChatSuggestions() {
    const container = document.getElementById('chat-suggestions');
    if (!container) return;

    try {
        // Default prompts while loading
        container.innerHTML = `
            <button class="chip-btn" onclick="sendQuickPrompt('Show me live market NAV and trends')">📊 Live Market Data</button>
            <button class="chip-btn" onclick="sendQuickPrompt('Give me live investment suggestions for my profile')">🤖 Live AI Suggestions</button>
            <button class="chip-btn" onclick="sendQuickPrompt('How much should I invest in SIPs this month?')">💼 SIP Advice</button>
            <button class="chip-btn" onclick="sendQuickPrompt('How can I save tax with ELSS and NPS?')">💰 Tax Saving</button>
        `;

        // Try to fetch live suggestions to personalise chips
        if (window.ApiService && typeof window.ApiService.getLiveSuggestions === 'function') {
            const profile = getUserProfile();
            const data = await window.ApiService.getLiveSuggestions(profile);
            if (data && data.suggestions && data.suggestions.length > 0) {
                const chips = data.suggestions.slice(0, 3).map(s =>
                    `<button class="chip-btn" onclick="sendQuickPrompt('${s.title.replace(/'/g, "\\'")} - tell me more')">${s.icon || '💡'} ${s.title}</button>`
                ).join('');
                container.innerHTML = chips +
                    `<button class="chip-btn" onclick="sendQuickPrompt('Show me live market NAV and trends')">📊 Live NAV</button>`;
            }
        }
    } catch (err) {
        console.warn('Could not load personalised chips:', err.message);
    }
}

// Get user profile from localStorage or use defaults
function getUserProfile() {
    try {
        const stored = localStorage.getItem('finai_profile');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Defaults matching wealth-plan page typical values
    return {
        monthlyIncome: 50000,
        monthlyExpenses: 25000,
        goal: 'retirement',
        riskAppetite: 'med'
    };
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input?.value?.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    showTypingIndicator();

    try {
        const profile = getUserProfile();

        if (window.ApiService && typeof window.ApiService.sendMessageToAI === 'function') {
            const data = await window.ApiService.sendMessageToAI(message, profile);
            removeTypingIndicator();
            addMessage(data.reply || data.message || 'Sorry, I could not generate a response. Please try again.', 'ai');
        } else {
            // Fallback if backend is unreachable
            setTimeout(() => {
                removeTypingIndicator();
                addMessage(getOfflineResponse(message), 'ai');
            }, 800);
        }
    } catch (err) {
        console.warn('Backend API error, using offline response:', err.message);
        removeTypingIndicator();
        addMessage(getOfflineResponse(message), 'ai');
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    // Support markdown-style bold (**text**) and newlines
    const formatted = text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    msgDiv.innerHTML = formatted;

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator message ai';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Offline / fallback responses (when backend is down)
function getOfflineResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    const profile = getUserProfile();
    const savings = Math.max(0, (profile.monthlyIncome || 50000) - (profile.monthlyExpenses || 25000));

    if (lowerMsg.includes('market') || lowerMsg.includes('nifty') || lowerMsg.includes('nav')) {
        return '📊 Live market data unavailable (backend offline). Indian equities have historically returned 12–14% CAGR over 10+ years. Continue systematic SIPs regardless of daily movements.';
    }
    if (lowerMsg.includes('suggest') || lowerMsg.includes('recommend') || lowerMsg.includes('live')) {
        return `💡 Offline Suggestion: With ₹${savings.toLocaleString('en-IN')}/month savings, consider splitting into 60% equity SIPs + 30% debt fund + 10% liquid fund buffer. Connect backend for live personalised recommendations.`;
    }
    if (lowerMsg.includes('invest') || lowerMsg.includes('sip') || lowerMsg.includes('fund')) {
        return `💼 For ${profile.riskAppetite === 'high' ? 'aggressive' : profile.riskAppetite === 'low' ? 'conservative' : 'moderate'} risk profile: Start with ₹${Math.round(savings * 0.5 / 500) * 500}/month SIP. Recommended: Mirae Large Cap + Parag Parikh Flexi Cap on Groww or Zerodha Coin.`;
    }
    if (lowerMsg.includes('balance') || lowerMsg.includes('savings') || lowerMsg.includes('how much')) {
        return `💰 Estimated monthly savings: ₹${savings.toLocaleString('en-IN')}. Aim for 20%+ savings rate. Emergency buffer target: ₹${((profile.monthlyExpenses || 25000) * 6).toLocaleString('en-IN')} in a liquid fund.`;
    }
    if (lowerMsg.includes('tax') || lowerMsg.includes('80c') || lowerMsg.includes('elss')) {
        return '🏦 Tax Tip: Invest ₹1.5L/year in ELSS mutual funds (Section 80C) — save up to ₹46,800 in taxes while earning 13–15% CAGR. Add NPS Tier-I for extra ₹50K deduction under 80CCD(1B).';
    }
    return `🤖 FinAI offline mode. I can still help with general queries! Ask about: SIP investments, tax saving (80C/ELSS), budget planning, or market basics.`;
}
