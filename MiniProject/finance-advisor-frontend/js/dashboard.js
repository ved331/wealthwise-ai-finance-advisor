// dashboard.js - Logic for dashboard page

document.addEventListener('DOMContentLoaded', () => {
    // Check if on dashboard page
    if (document.querySelector('.dashboard-layout')) {
        renderMockChart();
        populateTransactions();
        loadLiveAISuggestions();
    }
});

async function loadLiveAISuggestions() {
    const container = document.getElementById('ai-insights-container');
    if (!container) return;

    try {
        let suggestionsData;
        if (window.ApiService && typeof window.ApiService.getLiveSuggestions === 'function') {
            suggestionsData = await window.ApiService.getLiveSuggestions({
                monthlyIncome: 65000,
                monthlyExpenses: 22000,
                goal: 'house',
                riskAppetite: 'med'
            });
        }

        const suggestions = suggestionsData?.suggestions || [
            {
                type: 'optimization',
                title: 'High Savings Rate Detected',
                text: 'You are saving 66% of your monthly income. Consider automating an equity SIP strategy.',
                action: 'Setup SIP'
            },
            {
                type: 'market',
                title: 'Live Market Insight',
                text: 'Nifty 50 Index Fund shows strong momentum. Maintaining disciplined monthly allocation is advised.',
                action: 'View Trends'
            }
        ];

        let html = '';
        suggestions.slice(0, 2).forEach(item => {
            const isWarning = item.type === 'warning';
            const bgColor = isWarning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)';
            const borderColor = isWarning ? 'var(--warning)' : 'var(--success)';
            const icon = isWarning ? '⚠️' : '💡';

            html += `
                <div style="background: ${bgColor}; border-left: 3px solid ${borderColor}; padding: 12px 15px; border-radius: 0 8px 8px 0; margin-bottom: 12px; font-size: 0.9rem;">
                    <strong>${icon} ${item.title}:</strong> ${item.text}
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (err) {
        console.warn('Failed to load live AI suggestions:', err);
        container.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--success); padding: 12px 15px; border-radius: 0 8px 8px 0; margin-bottom: 12px; font-size: 0.9rem;">
                <strong>💡 Optimization Tip:</strong> Consider moving excess cash to high-yield savings or Liquid Mutual Funds.
            </div>
            <div style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--primary-color); padding: 12px 15px; border-radius: 0 8px 8px 0; font-size: 0.9rem;">
                <strong>📈 Market Strategy:</strong> Maintain disciplined monthly index fund SIPs for long-term compounding.
            </div>
        `;
    }
}

function renderMockChart() {
    const chartContainer = document.getElementById('portfolio-chart');
    if (!chartContainer) return;
    
    let html = '<div style="display: flex; align-items: flex-end; height: 200px; gap: 10px; margin-top: 20px;">';
    const data = [40, 60, 45, 80, 65, 90, 85];
    
    data.forEach(val => {
        html += `<div style="flex: 1; background: linear-gradient(to top, var(--primary-color), var(--accent-color)); height: ${val}%; border-radius: 4px 4px 0 0; transition: height 0.3s; cursor: pointer;" title="₹${val}k"></div>`;
    });
    
    html += '</div>';
    html += '<div style="display: flex; justify-content: space-between; margin-top: 10px; color: var(--text-muted); font-size: 0.8rem;"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>';
    
    chartContainer.innerHTML += html;
}

function populateTransactions() {
    const transactionList = document.getElementById('transaction-list');
    if (!transactionList) return;

    const mockTransactions = [
        { id: 1, title: 'Grocery Store', date: 'Today, 10:24 AM', amount: -124.50, type: 'expense', icon: '🛒' },
        { id: 2, title: 'Salary Deposit', date: 'Yesterday, 09:00 AM', amount: 4250.00, type: 'income', icon: '💰' },
        { id: 3, title: 'Netflix Subscription', date: 'Mar 15, 08:30 PM', amount: -15.99, type: 'expense', icon: '🎬' },
        { id: 4, title: 'Coffee Shop', date: 'Mar 14, 08:15 AM', amount: -4.50, type: 'expense', icon: '☕' }
    ];

    let html = '';
    mockTransactions.forEach(t => {
        const amountClass = t.type === 'income' ? 'positive' : 'negative';
        const sign = t.type === 'income' ? '+' : '';
        
        html += `
            <div class="transaction-item animate-fade-in">
                <div class="transaction-info">
                    <div class="transaction-icon">${t.icon}</div>
                    <div class="transaction-details">
                        <h4>${t.title}</h4>
                        <p>${t.date}</p>
                    </div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${sign}₹${Math.abs(t.amount).toFixed(2)}
                </div>
            </div>
        `;
    });

    transactionList.innerHTML = html;
}

