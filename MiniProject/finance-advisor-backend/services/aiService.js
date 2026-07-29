const apiKeys = require('../config/apiKeys');

// ─── Live MF NAV fetcher (mfapi.in) ─────────────────────────────────────────
const fetchMFData = async (code) => {
    try {
        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || !data.data || data.data.length < 2) return null;
        const curNAV = parseFloat(data.data[0].nav);
        const prevNAV = parseFloat(data.data[1].nav);
        const dayChg = (((curNAV - prevNAV) / prevNAV) * 100).toFixed(2);
        // Try to get 1-year return
        let yearNAV = curNAV;
        const today = new Date(data.data[0].date.split('-').reverse().join('-'));
        for (const d of data.data) {
            const dDate = new Date(d.date.split('-').reverse().join('-'));
            if (Math.ceil(Math.abs(today - dDate) / (1000 * 60 * 60 * 24)) >= 360) {
                yearNAV = parseFloat(d.nav);
                break;
            }
        }
        const yearRet = (((curNAV - yearNAV) / yearNAV) * 100).toFixed(1);
        return {
            name: data.meta?.scheme_name || `Scheme ${code}`,
            nav: curNAV,
            date: data.data[0].date,
            dayChange: parseFloat(dayChg),
            yearReturn: parseFloat(yearRet),
            trend: parseFloat(dayChg) >= 0 ? 'up' : 'down'
        };
    } catch (err) {
        console.warn(`MF fetch error for code ${code}:`, err.message);
        return null;
    }
};

// ─── Asset-specific live data lookup ────────────────────────────────────────
// Maps asset type → scheme code for known fund types
const ASSET_CODE_MAP = {
    nifty50:    '122639',  // Parag Parikh Flexi Cap (multi-cap proxy)
    largecap:   '118834',  // Mirae Large Cap
    midcap:     '120503',  // Axis Midcap
    smallcap:   '125497',  // Nippon India Small Cap
    debt:       '119060',  // HDFC Short Term Debt
    liquid:     '119775',  // Parag Parikh Liquid
    hybrid:     '119800',  // HDFC Balanced Advantage
    elss:       '119598',  // SBI ELSS
    index:      '120716',  // UTI Nifty 50 Index
    nasdaq:     '124851',  // Motilal Oswal Nasdaq 100
};

// Resolve what MF code to use for a given asset profile
const resolveAssetCode = (userProfile) => {
    const { customAsset, riskAppetite } = userProfile;
    if (customAsset && customAsset.code && ['mf', 'debt', 'liquid'].includes(customAsset.assetType)) {
        return customAsset.code;
    }
    if (riskAppetite === 'high') return ASSET_CODE_MAP.largecap;
    if (riskAppetite === 'low') return ASSET_CODE_MAP.debt;
    return ASSET_CODE_MAP.nifty50; // moderate default
};

// ─── LIVE SUGGESTIONS ENGINE ─────────────────────────────────────────────────
const getLiveSuggestions = async (userProfile = {}) => {
    const income = Number(userProfile.monthlyIncome) || 50000;
    const expenses = Number(userProfile.monthlyExpenses) || 25000;
    const savings = Math.max(0, income - expenses);
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
    const goal = userProfile.goal || 'emergency';
    const risk = userProfile.riskAppetite || 'med';
    const customAsset = userProfile.customAsset || null;

    // Fetch the relevant live asset data
    const assetCode = resolveAssetCode(userProfile);
    const liveAsset = await fetchMFData(assetCode);

    // Also fetch a contrasting asset for comparison
    const contrastCode = risk === 'high' ? ASSET_CODE_MAP.smallcap :
                         risk === 'low'  ? ASSET_CODE_MAP.liquid :
                                           ASSET_CODE_MAP.hybrid;
    const contrastAsset = await fetchMFData(contrastCode);

    const suggestions = [];

    // ── 0. Custom Asset Analysis ────────────────────────────────────────────
    if (customAsset && customAsset.code && customAsset.allocation > 0) {
        let liveCustomData = null;
        if (['mf', 'debt', 'liquid'].includes(customAsset.assetType)) {
            liveCustomData = await fetchMFData(customAsset.code);
        }

        let analysisText;
        if (liveCustomData) {
            const trendWord = liveCustomData.dayChange >= 0 ? 'gaining' : 'declining';
            const signal = liveCustomData.dayChange >= 0 ? 'continue SIP' : 'excellent SIP buy on dip';
            analysisText = `Live data: ${liveCustomData.name} NAV is ₹${liveCustomData.nav.toFixed(2)} (${liveCustomData.dayChange >= 0 ? '+' : ''}${liveCustomData.dayChange}% today, ${liveCustomData.yearReturn >= 0 ? '+' : ''}${liveCustomData.yearReturn}% 1-year). Currently ${trendWord} — ${signal} signal. Your ${customAsset.allocation}% allocation looks ${customAsset.allocation >= 20 ? 'well-positioned' : 'conservative — consider increasing'} for your '${goal}' goal.`;
        } else if (customAsset.assetType === 'stock') {
            analysisText = `Ticker ${customAsset.code.toUpperCase()} allocated at ${customAsset.allocation}%. Monitor quarterly earnings & use a trailing 10% stop-loss for disciplined risk management aligned with your '${goal}' goal.`;
        } else {
            analysisText = `Fixed income instrument at ${customAsset.code}% p.a. with ${customAsset.allocation}% allocation — stable component for your '${goal}' strategy.`;
        }

        suggestions.push({
            type: 'custom',
            icon: '🎯',
            title: `Live Analysis: ${customAsset.code.toUpperCase()}`,
            text: analysisText,
            action: 'Track Custom Asset'
        });
    }

    // ── 1. Savings Optimization ─────────────────────────────────────────────
    const savingsAmt = savings.toLocaleString('en-IN');
    const emergencyTarget = (expenses * 6).toLocaleString('en-IN');
    if (savingsRate >= 35) {
        suggestions.push({
            type: 'optimization',
            icon: '⚡',
            title: `Excellent Savings Rate: ${savingsRate}%`,
            text: `You save ₹${savingsAmt}/month (${savingsRate}% of income). Split: 50% into equity SIPs, 30% into index funds, 20% into liquid fund. This 3-bucket approach maximizes compounding while keeping liquidity.`,
            action: 'Setup Auto-SIP'
        });
    } else if (savingsRate >= 20) {
        suggestions.push({
            type: 'optimization',
            icon: '💡',
            title: `Savings Rate On Track: ${savingsRate}%`,
            text: `Monthly savings of ₹${savingsAmt} is healthy. Build an emergency fund of ₹${emergencyTarget} (6-month expenses) first. Once done, direct remaining surplus to ${risk === 'high' ? 'equity SIPs' : risk === 'low' ? 'debt funds' : 'balanced hybrid funds'}.`,
            action: 'Plan Emergency Fund'
        });
    } else {
        suggestions.push({
            type: 'warning',
            icon: '⚠️',
            title: `Low Savings Rate: ${savingsRate}%`,
            text: `Saving only ${savingsRate}% puts your '${goal}' goal at risk. Experts recommend 20%+. Identify your top 3 discretionary expenses — cutting just ₹${Math.round((income * 0.20 - savings) / 3).toLocaleString('en-IN')}/month from each would hit the 20% target.`,
            action: 'Analyse Budget'
        });
    }

    // ── 2. Live Market Insight for Selected Asset ───────────────────────────
    if (liveAsset) {
        const trendSymbol = liveAsset.trend === 'up' ? '▲' : '▼';
        const actionMsg = liveAsset.dayChange < -0.5
            ? `Today's ${Math.abs(liveAsset.dayChange)}% dip is a SIP buying opportunity — don't pause your SIP.`
            : liveAsset.dayChange > 1.5
            ? `Strong ${liveAsset.dayChange}% rally today — consider booking profits on positions over 10% gains.`
            : `Market steady at ${liveAsset.dayChange >= 0 ? '+' : ''}${liveAsset.dayChange}% — ideal for consistent monthly SIP continuation.`;

        suggestions.push({
            type: 'market',
            icon: '📊',
            title: `Live NAV: ${liveAsset.name.split('(')[0].trim()}`,
            text: `NAV: ₹${liveAsset.nav.toFixed(2)} ${trendSymbol} ${liveAsset.dayChange >= 0 ? '+' : ''}${liveAsset.dayChange}% today | ${liveAsset.yearReturn >= 0 ? '+' : ''}${liveAsset.yearReturn}% 1-year return as of ${liveAsset.date}. ${actionMsg}`,
            action: 'View Fund Details'
        });
    } else {
        suggestions.push({
            type: 'market',
            icon: '📊',
            title: 'Market Data Tip',
            text: `Indian equity markets have delivered 12–15% CAGR over 10+ year periods. Staying invested through volatility is key. Your ${risk === 'high' ? 'aggressive' : risk === 'low' ? 'conservative' : 'balanced'} profile aligns with long-term ${risk === 'low' ? 'debt-heavy' : 'equity-dominant'} compounding.`,
            action: 'Explore Markets'
        });
    }

    // ── 3. Goal + Risk-Tailored Allocation Recommendation ──────────────────
    const goalNames = { car: 'Car Purchase', house: 'Home Down-Payment', education: 'Education Fund', retirement: 'Retirement', emergency: 'Emergency Buffer' };
    const goalName = goalNames[goal] || goal;

    if (risk === 'high') {
        const sipAmt = Math.round(savings * 0.6 / 1000) * 1000;
        suggestions.push({
            type: 'growth',
            icon: '🚀',
            title: `Aggressive Plan: ${goalName}`,
            text: `SIP ₹${sipAmt.toLocaleString('en-IN')}/month: 40% Small/Mid-Cap MF, 30% Nifty 50 Index, 20% US Tech (Nasdaq FOF), 10% Liquid buffer. At 16% CAGR, this targets your ${goalName} in ${Math.max(3, Math.ceil(income / (savings * 0.6 || 1)))} years.`,
            action: 'Build This Portfolio'
        });
    } else if (risk === 'low') {
        const safeAmt = Math.round(savings * 0.5 / 1000) * 1000;
        suggestions.push({
            type: 'safety',
            icon: '🛡️',
            title: `Safe Plan: ${goalName}`,
            text: `Allocate ₹${safeAmt.toLocaleString('en-IN')}/month: 35% FD (7.1%+), 30% Debt MF, 20% PPF (8.1% tax-free), 15% Liquid Fund. No equity risk. At 7.5% avg return, capital stays fully protected.`,
            action: 'Open Safe Accounts'
        });
    } else {
        const balAmt = Math.round(savings * 0.55 / 1000) * 1000;
        suggestions.push({
            type: 'balanced',
            icon: '⚖️',
            title: `Balanced Plan: ${goalName}`,
            text: `SIP ₹${balAmt.toLocaleString('en-IN')}/month: 40% Equity MF (Mirae Large Cap + Flexi Cap), 20% Nifty 50 Index, 25% Hybrid/Debt, 15% PPF. At 12% avg CAGR, this hits your ${goalName} goal sustainably.`,
            action: 'Activate SIPs'
        });
    }

    // ── 4. Tax Saving Tip (dynamic based on income) ──────────────────────────
    const taxBenefit = income >= 100000 ? '₹46,800' : income >= 65000 ? '₹31,200' : '₹15,600';
    const topTaxTip = income >= 100000
        ? 'Max out ELSS (₹1.5L/yr 80C) + NPS Tier-I (₹50K/yr 80CCD1B) = ₹46,800 annual tax saved.'
        : 'Invest ₹1.5L in ELSS mutual funds under Section 80C. Minimum 3-year lock-in but 13–15% returns beat FDs significantly.';

    suggestions.push({
        type: 'tax',
        icon: '💰',
        title: `Tax Savings: Up to ${taxBenefit}/year`,
        text: topTaxTip + (contrastAsset ? ` Consider ${contrastAsset.name.split('(')[0].trim()} currently at NAV ₹${contrastAsset.nav.toFixed(2)} (${contrastAsset.yearReturn >= 0 ? '+' : ''}${contrastAsset.yearReturn}% 1Y) as your ELSS/tax vehicle.` : ''),
        action: 'Calculate Tax Savings'
    });

    return {
        timestamp: new Date().toISOString(),
        userSavingsRate: savingsRate,
        monthlySavings: savings,
        liveAsset,
        contrastAsset,
        risk,
        goal,
        suggestions
    };
};

// ─── CHAT ADVISOR with Live Market Context ───────────────────────────────────
const getFinanceAdvice = async (message, userProfile = {}) => {
    const lowerMsg = message.toLowerCase();
    const risk = userProfile.riskAppetite || 'med';
    const income = Number(userProfile.monthlyIncome) || 50000;
    const expenses = Number(userProfile.monthlyExpenses) || 25000;
    const savings = Math.max(0, income - expenses);
    const goal = userProfile.goal || 'financial freedom';

    // Always fetch fresh live data for each chat response
    const assetCode = resolveAssetCode(userProfile);
    const liveData = await fetchMFData(assetCode);

    // ── Keyword routing ────────────────────────────────────────────────────
    if (lowerMsg.includes('market') || lowerMsg.includes('nifty') || lowerMsg.includes('nav') || lowerMsg.includes('trend') || lowerMsg.includes('today')) {
        if (liveData) {
            const dirWord = liveData.dayChange >= 0 ? 'up' : 'down';
            const sentiment = liveData.dayChange < -1 ? 'Dip alert! Good accumulation zone for long-term SIP investors.' :
                              liveData.dayChange > 2  ? 'Strong rally! Book partial profits if your holding is up 15%+.' :
                              'Stable session. Disciplined SIPs continue to outperform market timing strategies.';
            return `📊 Live Market Update (${liveData.date})\n${liveData.name.split('(')[0].trim()}: NAV ₹${liveData.nav.toFixed(2)} — ${dirWord} ${Math.abs(liveData.dayChange)}% today | ${liveData.yearReturn >= 0 ? '+' : ''}${liveData.yearReturn}% over 1 year.\n\n${sentiment}\n\nYour ${risk === 'high' ? 'aggressive' : risk === 'low' ? 'conservative' : 'balanced'} profile: ${risk === 'low' ? 'Stay in debt funds during high volatility.' : 'Continue monthly SIPs — time in market beats timing the market.'}`;
        }
        return '📊 Live market data is temporarily unavailable. However, Indian equity indices (Nifty 50, Sensex) have compounded at 12–14% CAGR over 20 years. Stick to monthly SIPs regardless of short-term movements.';
    }

    if (lowerMsg.includes('suggest') || lowerMsg.includes('recommend') || lowerMsg.includes('advice') || lowerMsg.includes('tip') || lowerMsg.includes('live')) {
        const liveSugg = await getLiveSuggestions(userProfile);
        const top2 = liveSugg.suggestions.slice(0, 2);
        let resp = `🤖 Live AI Suggestions for your profile (${risk} risk, goal: ${goal}):\n\n`;
        top2.forEach((s, i) => {
            resp += `${i + 1}. ${s.icon || '•'} **${s.title}**\n   ${s.text}\n\n`;
        });
        resp += 'Want deeper analysis on any specific area — tax, SIPs, or allocation?';
        return resp;
    }

    if (lowerMsg.includes('sip') || lowerMsg.includes('invest') || lowerMsg.includes('fund') || lowerMsg.includes('stock') || lowerMsg.includes('mutual')) {
        const sipAmt = Math.round(savings * (risk === 'high' ? 0.65 : risk === 'low' ? 0.4 : 0.55) / 500) * 500;
        const fundRec = risk === 'high'
            ? 'Nippon India Small Cap Fund (code: 125497) + Motilal Oswal Nasdaq 100 FOF (code: 124851)'
            : risk === 'low'
            ? 'HDFC Short Term Debt Fund (code: 119060) + Parag Parikh Liquid Fund (code: 119775)'
            : 'Mirae Asset Large Cap (code: 118834) + Parag Parikh Flexi Cap (code: 122639)';
        const liveNote = liveData ? ` Current live NAV check: ${liveData.name.split('(')[0].trim()} at ₹${liveData.nav.toFixed(2)} (${liveData.yearReturn >= 0 ? '+' : ''}${liveData.yearReturn}% 1Y).` : '';
        return `💼 Investment Plan for ${risk === 'high' ? 'Aggressive' : risk === 'low' ? 'Conservative' : 'Moderate'} Profile\n\nRecommended SIP: ₹${sipAmt.toLocaleString('en-IN')}/month into:\n• ${fundRec}\n${liveNote}\n\nStart on Groww or Zerodha Coin — both are SEBI-regulated. Automate the SIP date to 5th of each month so you never miss.`;
    }

    if (lowerMsg.includes('balance') || lowerMsg.includes('savings') || lowerMsg.includes('how much') || lowerMsg.includes('save')) {
        const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
        const healthLabel = savingsRate >= 30 ? 'Excellent' : savingsRate >= 20 ? 'Good' : 'Needs Improvement';
        return `💰 Your Financial Snapshot\n\nMonthly Income: ₹${income.toLocaleString('en-IN')}\nMonthly Expenses: ₹${expenses.toLocaleString('en-IN')}\nNet Savings: ₹${savings.toLocaleString('en-IN')} (${savingsRate}% rate — ${healthLabel})\n\nTarget: Redirect at least ₹${Math.round(savings * 0.6 / 1000) * 1000} into SIPs. Emergency buffer target: ₹${(expenses * 6).toLocaleString('en-IN')} (6-month expenses in liquid fund).`;
    }

    if (lowerMsg.includes('spend') || lowerMsg.includes('expense') || lowerMsg.includes('budget') || lowerMsg.includes('cut')) {
        return `📉 Budget Optimisation Tips\n\nYour recorded monthly expenses: ₹${expenses.toLocaleString('en-IN')}.\n\n50/30/20 Rule:\n• 50% Needs (₹${Math.round(income * 0.5).toLocaleString('en-IN')}): Rent, groceries, utilities\n• 30% Wants (₹${Math.round(income * 0.3).toLocaleString('en-IN')}): Dining, entertainment, subscriptions\n• 20% Savings (₹${Math.round(income * 0.2).toLocaleString('en-IN')}): SIPs, emergency fund\n\nQuick wins: Cancel unused subscriptions, meal prep 3x/week, use UPI cashback apps.`;
    }

    if (lowerMsg.includes('tax') || lowerMsg.includes('80c') || lowerMsg.includes('elss') || lowerMsg.includes('nps')) {
        return `🏦 Tax Saving Strategy\n\nBest tax deductions for your income (₹${income.toLocaleString('en-IN')}/month):\n\n1. Section 80C (up to ₹1.5L/yr): ELSS Mutual Funds — best returns + tax benefit\n2. Section 80CCD(1B) (up to ₹50K/yr): NPS Tier-I — additional ₹15,600 tax saving\n3. Section 80D: Health insurance premium (₹25K deductible)\n\nTotal potential savings: ₹${income >= 100000 ? '₹46,800' : '₹31,200'}/year. ELSS funds like Mirae Tax Saver have delivered 15%+ CAGR while saving taxes.`;
    }

    if (lowerMsg.includes('goal') || lowerMsg.includes('house') || lowerMsg.includes('car') || lowerMsg.includes('retire') || lowerMsg.includes('education')) {
        const liveNote = liveData ? ` Live market: Your target fund (${liveData.name.split('(')[0].trim()}) is at NAV ₹${liveData.nav.toFixed(2)}, ${liveData.yearReturn >= 0 ? 'up' : 'down'} ${Math.abs(liveData.yearReturn)}% this year.` : '';
        return `🎯 Goal-Based Planning\n\nYour goal: ${goal}. With monthly savings of ₹${savings.toLocaleString('en-IN')} and ${risk} risk profile:\n\n${risk === 'high' ? '• Aggressive equity SIPs (16% CAGR target) — 5–7 year horizon\n• Use Nippon Small Cap + Nasdaq FOF for maximum growth' : risk === 'low' ? '• FD + PPF + Debt MF ladder — 7.5% avg, fully safe\n• Increase income or tenure if corpus shortfall exists' : '• Balanced SIPs (12% CAGR target) — 7–10 year horizon\n• Mirae Large Cap + Parag Parikh Flexi Cap as core holdings'}${liveNote}`;
    }

    // Default catch-all with live data context
    if (liveData) {
        return `🤖 FinAI Advisor here! I can see ${liveData.name.split('(')[0].trim()} is at NAV ₹${liveData.nav.toFixed(2)} today (${liveData.dayChange >= 0 ? '+' : ''}${liveData.dayChange}%). How can I help? Ask me about:\n• Live market insights\n• Investment recommendations\n• Tax saving strategies\n• Budget optimisation\n• Goal-based planning`;
    }
    return `🤖 FinAI Advisor at your service! Ask me about:\n• Your investments & SIPs\n• Live market data & NAVs\n• Tax savings (80C, ELSS, NPS)\n• Budget & expense optimisation\n• Goal-based wealth planning`;
};

module.exports = {
    getFinanceAdvice,
    getLiveSuggestions
};
