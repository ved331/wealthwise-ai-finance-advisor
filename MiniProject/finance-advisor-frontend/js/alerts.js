// alerts.js - Logic for the Alerts page

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('alerts-container')) {
        renderAlerts();
    }
});

function renderAlerts() {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    const mockAlerts = [
        {
            id: 1,
            type: 'warning',
            title: 'Unusual Spending Detected',
            message: 'Your spending on "Entertainment" is 40% higher than your usual average for this time of month.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'success',
            title: 'Savings Goal Milestone',
            message: 'Congratulations! You just crossed the 50% mark for your "Emergency Fund" goal.',
            time: '1 day ago',
            read: true
        },
        {
            id: 3,
            type: 'info',
            title: 'Market Update',
            message: 'Your index fund portfolio is up 1.2% today following positive tech earnings reports.',
            time: '2 days ago',
            read: true
        }
    ];

    let html = '';
    
    mockAlerts.forEach((alert, index) => {
        let borderClass = '';
        let icon = '';
        
        if (alert.type === 'warning') {
            borderClass = 'border-left: 4px solid var(--warning);';
            icon = '⚠️';
        } else if (alert.type === 'success') {
            borderClass = 'border-left: 4px solid var(--success);';
            icon = '🎉';
        } else {
            borderClass = 'border-left: 4px solid var(--primary-color);';
            icon = 'ℹ️';
        }
        
        const readClass = alert.read ? 'opacity: 0.7;' : 'background: rgba(255,255,255,0.05);';

        html += `
            <div class="glass-panel animate-fade-in delay-${(index + 1) * 100}" style="margin-bottom: 20px; padding: 20px; display: flex; gap: 20px; align-items: flex-start; ${borderClass} ${readClass}">
                <div style="font-size: 1.5rem;">${icon}</div>
                <div style="flex-grow: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <h3 style="margin: 0; font-size: 1.1rem; ${!alert.read ? 'color: var(--text-main);' : ''}">${alert.title}</h3>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${alert.time}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.95rem;">${alert.message}</p>
                </div>
                ${!alert.read ? '<div style="width: 10px; height: 10px; background: var(--primary-color); border-radius: 50%; margin-top: 5px;"></div>' : ''}
            </div>
        `;
    });

    container.innerHTML = html;
}
