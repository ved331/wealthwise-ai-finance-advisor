let DI, LI;

/* Colour palette for chart slices */
const P = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

/* Rupee formatter */
function fmt(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr';
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(1)   + 'L';
  if (n >= 1000)     return '₹' + (n / 1000).toFixed(0)     + 'k';
  return '₹' + Math.round(n);
}

/* ── Goal-specific insight strings ── */
const G = {
  low: {
    car:        'A 3–5 yr PPF + debt SIP mix safely builds your car corpus with zero market risk.',
    house:      'Target the 20% down payment via PPF and FDs over 7–10 years — fully capital protected.',
    education:  'Post Office TD + HDFC Debt Fund will beat education inflation without any equity exposure.',
    retirement: '₹5,000/month in PPF over 20 years compounds to ₹30L+ completely tax-free.',
    emergency:  'Park everything in Parag Parikh Liquid Fund first — build 6 months of expenses before anything else.',
  },
  med: {
    car:        'A 3-yr SIP in Mirae + UTI Nifty 50 at 12–13% CAGR will comfortably fund a mid-range car.',
    house:      'Consistent SIP in Flexi Cap + Hybrid for 7–10 years. Always target the 20% down payment first.',
    education:  'ELSS funds (80C + ~14% returns) started today will comfortably beat education inflation.',
    retirement: '₹5,000/month in Parag Parikh Flexi Cap for 25 years at 14% CAGR = ₹1.8 Crore corpus.',
    emergency:  '3-month liquid fund first, always. Never start equity SIPs before this is fully built.',
  },
  high: {
    car:        'With aggressive allocation a 2-yr SIP could fund a premium car — but hold a debt buffer alongside.',
    house:      'Equities over 10+ years can build a large down payment. Never sell during market corrections.',
    education:  'Small Cap + Nasdaq FOF over 7+ years can 4x your investment with the power of compounding.',
    retirement: '₹5,000/month in small cap + Nasdaq 100 at 16% CAGR over 25 years = ₹3.7 Crore corpus.',
    emergency:  'Build 3-month liquid buffer first. Investing in equities without this safety net is reckless.',
  },
};

/* ── Full data: allocations + actions per risk profile ── */
const D = {

  /* ── CONSERVATIVE ── */
  low: {
    label: 'Conservative', rate: 0.075,
    allocs: [
      { cat: 'Fixed Deposits', pct: 35, items: [
        { n: 'SBI Fixed Deposit',          p: 15, r: '7.1% p.a.',    w: 'Government-backed, fully guaranteed returns — safest instrument available in India' },
        { n: 'HDFC Bank FD',               p: 10, r: '7.25% p.a.',   w: 'Most reliable private bank, flexible 1–3 yr tenures with competitive rates' },
        { n: 'Post Office Time Deposit',   p: 10, r: '7.5% p.a.',    w: 'Sovereign guarantee, 5-year lock-in for maximum long-term safety' },
      ]},
      { cat: 'Debt Mutual Funds', pct: 30, items: [
        { n: 'HDFC Short Term Debt Fund',       p: 12, r: '~7.5% p.a.', code: '119060', w: 'Low risk, high daily liquidity — significantly better than savings account' },
        { n: 'ICICI Pru Corporate Bond Fund',   p: 10, r: '7–8% p.a.',  code: '120594', w: 'Only AAA-rated corporate bonds, stable and predictable income stream' },
        { n: 'SBI Magnum Gilt Fund',            p:  8, r: '7.2% p.a.',  code: '119799', w: '100% government securities — near-zero default risk, pure safety' },
      ]},
      { cat: 'PPF / NPS', pct: 20, items: [
        { n: 'Public Provident Fund (PPF)',    p: 12, r: '8.1% tax-free', w: 'Section 80C deduction up to ₹1.5L/year, 15-yr compounding advantage' },
        { n: 'NPS Tier-I (Conservative)',      p:  8, r: '8–9% p.a.',    w: 'Pension + 80CCD(1B) extra ₹50k deduction — unbeatable dual tax benefit' },
      ]},
      { cat: 'Liquid Fund (Emergency)', pct: 15, items: [
        { n: 'Parag Parikh Liquid Fund',  p: 8, r: '6.5% p.a.', code: '119775', w: 'Withdraw within 1 working day — ultra-safe, instant liquidity when needed' },
        { n: 'Nippon India Liquid Fund',  p: 7, r: '6.4% p.a.', code: '119792', w: 'Consistent returns far above savings account rate, highly reliable' },
      ]},
    ],
    actions: [
      'Open PPF at SBI / Post Office today — start ₹500/month minimum, build to ₹12,500/month max',
      'Set up FD auto-renewal at SBI for exactly 15% of your monthly savings — never touch the principal',
      'Activate SIP in HDFC Short Term Debt Fund on Groww or Zerodha Coin on the 1st of each month',
      'Build your 3-month emergency corpus in Parag Parikh Liquid Fund before making any other investment',
      'Register on eNPS.nsdl.com and activate NPS Tier-I under the Conservative lifecycle fund option',
    ],
  },

  /* ── MODERATE ── */
  med: {
    label: 'Moderate', rate: 0.12,
    allocs: [
      { cat: 'Equity Mutual Funds', pct: 40, items: [
        { n: 'Mirae Asset Large Cap Fund',     p: 15, r: '~13% CAGR', code: '118834', w: 'Top 100 NSE companies, consistent 5-yr CAGR, lower volatility than mid-cap' },
        { n: 'Parag Parikh Flexi Cap Fund',    p: 15, r: '~15% CAGR', code: '122639', w: 'Multi-cap with 20% international — built-in USD hedge against INR depreciation' },
        { n: 'Axis Midcap Fund',               p: 10, r: '~16% CAGR', code: '120503', w: 'Mid-size high-growth companies, more upside than large cap over 5+ years' },
      ]},
      { cat: 'Index Funds / ETF', pct: 20, items: [
        { n: 'Nifty 50 Index Fund (UTI)',    p: 12, r: '~12% avg', code: '120716', w: 'Passive, ultra-low 0.1% expense ratio — tracks India\'s largest 50 companies' },
        { n: 'Nifty Next 50 ETF (ICICI)',    p:  8, r: '~13% avg', code: '120684', w: 'Tomorrow\'s Nifty 50 at lower entry valuations — smart diversification play' },
      ]},
      { cat: 'Debt / Hybrid', pct: 25, items: [
        { n: 'HDFC Balanced Advantage Fund', p: 12, r: '~11% p.a.', code: '119800', w: 'Auto-shifts between equity and debt based on market valuations — smart rebalancing' },
        { n: 'SBI Corporate Bond Fund',      p:  8, r: '7.5% p.a.',  code: '125354', w: 'Stable income layer, AAA-rated bonds, reduces overall portfolio volatility' },
        { n: 'PPF',                          p:  5, r: '8.1% tax-free', w: 'Baseline safe allocation + annual Section 80C tax benefit — never skip' },
      ]},
      { cat: 'Direct Stocks (optional)', pct: 15, items: [
        { n: 'Reliance Industries (RELIANCE)', p: 5, r: 'variable', stock: 'RELIANCE.NS', w: 'Energy + Jio + Retail — India\'s most diversified ₹19L Cr mega-cap conglomerate' },
        { n: 'HDFC Bank (HDFCBANK)',           p: 5, r: 'variable', stock: 'HDFCBANK.NS', w: 'Consistent 15% EPS growth every year, India\'s most reliable banking franchise' },
        { n: 'Infosys (INFY)',                 p: 5, r: 'variable', stock: 'INFY.NS', w: 'IT blue-chip, reliable quarterly dividends + global USD revenue stream' },
      ]},
    ],
    actions: [
      'Start SIP on the 1st of every month via Groww or Zerodha Coin — automate it, never miss',
      'Core holding: Mirae Asset Large Cap + Parag Parikh Flexi Cap — these two are your wealth engine',
      'Open Zerodha Kite demat and buy Nifty 50 ETF in small fixed quantities every month',
      'Add HDFC Balanced Advantage Fund during market corrections — it auto-rebalances to protect you',
      'Review portfolio every quarter; rebalance if equity portion exceeds 55% of total value',
    ],
  },

  /* ── AGGRESSIVE ── */
  high: {
    label: 'Aggressive', rate: 0.16,
    allocs: [
      { cat: 'Direct Equities', pct: 40, items: [
        { n: 'Reliance Industries (RELIANCE)',  p: 10, r: 'variable', stock: 'RELIANCE.NS', w: '₹19L Cr market cap — energy + Jio + Retail, India\'s most diversified conglomerate' },
        { n: 'HDFC Bank (HDFCBANK)',            p:  8, r: 'variable', stock: 'HDFCBANK.NS', w: '15% consistent EPS growth every year — India\'s most dependable banking franchise' },
        { n: 'Tata Motors (TATAMOTORS)',        p:  7, r: 'variable', stock: 'TATAMOTORS.NS', w: 'EV pivot + JLR global recovery — massive re-rating potential in 3–5 years' },
        { n: 'Zomato (ZOMATO)',                 p:  8, r: 'variable', stock: 'ZOMATO.NS', w: 'Profitable since FY2023, hyper-growth in food delivery + Blinkit quick commerce' },
        { n: 'Adani Ports (ADANIPORTS)',        p:  7, r: 'variable', stock: 'ADANIPORTS.NS', w: 'Handles 30% of India\'s cargo — dominant infrastructure moat position' },
      ]},
      { cat: 'Small & Mid Cap MF', pct: 25, items: [
        { n: 'Nippon India Small Cap Fund', p: 12, r: '~20% CAGR', code: '125497', w: 'Consistent 20%+ 5-year CAGR, diversified across 100+ quality small cap stocks' },
        { n: 'Quant Mid Cap Fund',          p:  8, r: '~22% CAGR', code: '145552', w: 'Best-in-category quant model-driven selection — 22% CAGR, momentum-based' },
        { n: 'SBI Small Cap Fund',          p:  5, r: '~18% CAGR', code: '119598', w: 'Quality-screened, low churn, proven long-term compounder over 10+ years' },
      ]},
      { cat: 'US / International', pct: 15, items: [
        { n: 'Motilal Oswal Nasdaq 100 FOF',            p: 8, r: '~18% CAGR', code: '124851', w: 'Apple, Microsoft, Nvidia, Google exposure via simple Indian mutual fund wrapper' },
        { n: 'Parag Parikh Flexi Cap (intl slice)',      p: 7, r: '~15% CAGR', code: '122639', w: '20% of fund in US stocks — natural USD hedge against long-term INR weakness' },
      ]},
      { cat: 'REIT / Crypto (speculative)', pct: 10, items: [
        { n: 'Embassy Office Parks REIT (BSE)',        p: 6, r: '7–8% dividend', w: 'India\'s largest office REIT, listed on BSE — quarterly rental distributions' },
        { n: 'Bitcoin via CoinDCX (strict 4% cap)',    p: 4, r: 'highly variable', w: 'Pure speculation — allocate ONLY what you can completely afford to lose entirely' },
      ]},
      { cat: 'Liquid Buffer', pct: 10, items: [
        { n: 'Parag Parikh Liquid Fund', p: 10, r: '6.5% p.a.', code: '119775', w: 'Non-negotiable 3-month expense buffer before touching any equity position' },
      ]},
    ],
    actions: [
      'Open Zerodha Kite demat — ₹20 flat brokerage, best platform for direct equity buying in India',
      'Anchor with Reliance + HDFC Bank first — most stable stocks in this entire aggressive list',
      'Launch Nippon India Small Cap SIP at ₹500/month minimum — hold without panic for 5+ years',
      'Buy Motilal Oswal Nasdaq 100 FOF monthly — protects against long-term INR depreciation vs USD',
      'Purchase Embassy REIT units on BSE for consistent passive monthly rental income stream',
      'Hard cap Bitcoin at 4% of portfolio — pure speculation, never your core wealth-building engine',
    ],
  },
};


window.updateCustomLabels = function() {
  const t = document.getElementById('customType').value;
  const lbl = document.getElementById('customCodeLabel');
  const inp = document.getElementById('customCode');
  if (t === 'mf' || t === 'debt' || t === 'liquid') {
    lbl.textContent = 'Scheme Code';
    inp.placeholder = 'e.g. 122639';
  } else if (t === 'stock') {
    lbl.textContent = 'Yahoo Ticker';
    inp.placeholder = 'e.g. RELIANCE.NS';
  } else if (t === 'fd' || t === 'ppf') {
    lbl.textContent = 'Interest Rate (%)';
    inp.placeholder = 'e.g. 7.1';
  } else {
    lbl.textContent = 'Code / Ticker';
    inp.placeholder = '';
  }
};

async function enrichAllItemsWithLiveData(d) {
  const promises = [];
  d.allocs.forEach(alloc => {
    alloc.items.forEach(item => {
      if (item.code) {
        promises.push(
          fetch('https://api.mfapi.in/mf/' + item.code)
            .then(r => r.json())
            .then(data => {
              if (data && data.data && data.data.length > 0) {
                const latestNAV = parseFloat(data.data[0].nav);
                const today = new Date(data.data[0].date.split('-').reverse().join('-'));
                let oldNAV = latestNAV;
                for (let i = 0; i < data.data.length; i++) {
                  const dDate = new Date(data.data[i].date.split('-').reverse().join('-'));
                  const diffDays = Math.ceil(Math.abs(today - dDate) / (1000 * 60 * 60 * 24));
                  if (diffDays >= 365) {
                    oldNAV = parseFloat(data.data[i].nav);
                    break;
                  }
                }
                const retPct = (((latestNAV - oldNAV) / oldNAV) * 100).toFixed(1);
                item.r = `NAV: ₹${latestNAV.toFixed(2)} (${retPct >= 0 ? '+' : ''}${retPct}% 1Y Live)`;
                item.live = true;
                item.w = item.w + ` • Live NAV updated ${data.data[0].date}`;
              }
            })
            .catch(err => console.warn('Live MF error for code ' + item.code, err))
        );
      } else if (item.stock) {
        const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + item.stock + '?range=1y&interval=1d';
        promises.push(
          fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(url))
            .then(r => r.json())
            .then(pdata => {
              const data = JSON.parse(pdata.contents);
              if (data.chart && data.chart.result && data.chart.result.length > 0) {
                const result = data.chart.result[0];
                const quotes = result.indicators.quote[0];
                let startPrice = 0;
                for (let i = 0; i < quotes.close.length; i++) {
                  if (quotes.close[i]) { startPrice = quotes.close[i]; break; }
                }
                let endPrice = quotes.close[quotes.close.length - 1];
                if (startPrice && endPrice) {
                  const retPct = (((endPrice - startPrice) / startPrice) * 100).toFixed(1);
                  item.r = `CMP: ₹${endPrice.toFixed(2)} (${retPct >= 0 ? '+' : ''}${retPct}% 1Y Live)`;
                  item.live = true;
                }
              }
            })
            .catch(err => console.warn('Live Stock error for ' + item.stock, err))
        );
      }
    });
  });
  await Promise.allSettled(promises);
}

/* ── MAIN ANALYZE FUNCTION ── */
window.analyze = async function() {
  const btn = document.getElementById('analyze-btn');
  const oldBtnText = btn.innerHTML;
  btn.innerHTML = 'Fetching Live Data...';
  btn.style.opacity = '0.7';

  const inc  = +document.getElementById('income').value;
  const exp  = +document.getElementById('expenses').value;
  const rk   = document.getElementById('risk').value;
  const goal = document.getElementById('goal').value;
  const yrs  = +document.getElementById('duration').value;

  let d = JSON.parse(JSON.stringify(D[rk]));

  // Fetch live API data for all portfolio holdings
  await enrichAllItemsWithLiveData(d);

  // ── Save profile to localStorage so AI chat uses live personalised data ──
  const cTypeForProfile = document.getElementById('customType')?.value;
  const cCodeForProfile = document.getElementById('customCode')?.value;
  const cAllocForProfile = +document.getElementById('customAlloc')?.value;
  const profileToSave = {
      monthlyIncome: inc,
      monthlyExpenses: exp,
      riskAppetite: rk,
      goal: goal,
      duration: yrs,
      customAsset: (cTypeForProfile && cTypeForProfile !== 'none' && cCodeForProfile && cAllocForProfile > 0)
          ? { assetType: cTypeForProfile, code: cCodeForProfile, allocation: cAllocForProfile }
          : null
  };
  try { localStorage.setItem('finai_profile', JSON.stringify(profileToSave)); } catch(e) {}

  // Also push live suggestions to backend for this profile
  if (window.ApiService && typeof window.ApiService.getLiveSuggestions === 'function') {
      window.ApiService.getLiveSuggestions(profileToSave).then(liveData => {
          renderLiveSuggestionsPanel(liveData, d);
      }).catch(() => {});
  }


  const cType = document.getElementById('customType').value;
  const cCode = document.getElementById('customCode').value;
  const cAlloc = +document.getElementById('customAlloc').value;

  if (cType !== 'none' && cCode && cAlloc > 0 && cAlloc <= 100) {
    let assetName = cCode;
    let assetReturn = 0;
    let returnStr = '0%';
    let assetDesc = 'Live custom asset';

    try {
      if (cType === 'mf' || cType === 'debt' || cType === 'liquid') {
        const res = await fetch('https://api.mfapi.in/mf/' + cCode);
        const data = await res.json();
        if (data.status === 'SUCCESS' && data.data && data.data.length > 0) {
          assetName = data.meta.scheme_name || cCode;
          const latestNAV = parseFloat(data.data[0].nav);
          const today = new Date(data.data[0].date.split('-').reverse().join('-'));
          let oldNAV = latestNAV;
          for (let i = 0; i < data.data.length; i++) {
            const dDate = new Date(data.data[i].date.split('-').reverse().join('-'));
            const diffDays = Math.ceil(Math.abs(today - dDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= 365) {
              oldNAV = parseFloat(data.data[i].nav);
              break;
            }
          }
          assetReturn = (latestNAV - oldNAV) / oldNAV;
          returnStr = (assetReturn * 100).toFixed(1) + '% (1Y Live)';
          assetDesc = 'Live Data from mfapi.in. Current NAV: ₹' + latestNAV.toFixed(2);
        } else {
          assetDesc = 'Failed to load live MF data.';
        }
      } else if (cType === 'stock') {
        const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + cCode + '?range=1y&interval=1d';
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(url));
        const pdata = await res.json();
        const data = JSON.parse(pdata.contents);
        if (data.chart && data.chart.result && data.chart.result.length > 0) {
          const result = data.chart.result[0];
          const quotes = result.indicators.quote[0];
          let startPrice = 0;
          for(let i=0; i<quotes.close.length; i++) {
            if (quotes.close[i]) { startPrice = quotes.close[i]; break; }
          }
          let endPrice = quotes.close[quotes.close.length - 1];
          assetName = cCode.toUpperCase();
          if (startPrice && endPrice) {
            assetReturn = (endPrice - startPrice) / startPrice;
            returnStr = (assetReturn * 100).toFixed(1) + '% (1Y Live)';
            assetDesc = 'Live Data from Yahoo Finance. CMP: ₹' + endPrice.toFixed(2);
          }
        } else {
          assetDesc = 'Failed to load live Stock data.';
        }
      } else if (cType === 'fd' || cType === 'ppf') {
        const rateVal = parseFloat(cCode);
        if (!isNaN(rateVal)) {
          assetName = cType === 'fd' ? 'Custom Fixed Deposit' : 'Custom PPF / NPS';
          assetReturn = rateVal / 100;
          returnStr = rateVal.toFixed(1) + '% p.a.';
          assetDesc = 'Fixed return rate provided by user.';
        } else {
          assetDesc = 'Invalid rate entered.';
        }
      }
    } catch (e) {
      console.error(e);
      assetDesc = 'Error fetching live data.';
    }

    const scale = (100 - cAlloc) / 100;
    d.allocs.forEach(a => {
      a.pct = Math.round(a.pct * scale);
      a.items.forEach(it => { it.p = Math.round(it.p * scale); });
    });

    d.allocs.unshift({
      cat: 'Custom (Live)',
      pct: cAlloc,
      items: [
        { n: assetName, p: cAlloc, r: returnStr, w: assetDesc }
      ]
    });

    const baseRate = D[rk].rate * scale;
    const newRate = Math.max(0, assetReturn) * (cAlloc / 100); 
    d.rate = baseRate + newRate;
  }

  const save  = Math.max(0, inc - exp);
  const sp    = Math.round(save / inc * 100);
  const mr    = d.rate / 12;
  const corpus = Math.round(save * ((Math.pow(1 + mr, yrs * 12) - 1) / mr));
  const health = Math.min(100, Math.round(sp * 2.5));

  btn.innerHTML = oldBtnText;
  btn.style.opacity = '1';

  /* Risk pill */
  const rp = document.getElementById('rp');
  rp.className = 'rpill rp-' + rk;
  rp.textContent = d.label + ' Risk Profile';

  /* Metric cards */
  document.getElementById('mS').textContent = fmt(save);
  document.getElementById('mR').textContent = sp + '%';
  document.getElementById('mC').textContent = fmt(corpus);
  document.getElementById('mH').textContent = health + '/100';

  /* Health message */
  document.getElementById('hm').innerHTML = sp < 20
    ? '<div class="msg-w">Savings rate below 20% — reduce expenses before investing heavily.</div>'
    : '<div class="msg-g">Strong savings rate. You are ready to invest systematically.</div>';

  /* Colours for this profile */
  const colors = P.slice(0, d.allocs.length);

  /* ── Donut chart ── */
  if (DI) DI.destroy();
  DI = new Chart(document.getElementById('donut'), {
    type: 'doughnut',
    data: {
      labels: d.allocs.map(a => a.cat),
      datasets: [{ data: d.allocs.map(a => a.pct), backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => ' ' + c.label + ': ' + c.parsed + '%' } },
      },
    },
  });

  /* ── Legend ── */
  document.getElementById('leg').innerHTML = d.allocs.map((a, i) => `
    <div class="leg">
      <div class="leg-l">
        <div class="leg-bar" style="background:${colors[i]}"></div>
        <span class="leg-name">${a.cat}</span>
      </div>
      <span class="leg-pct">${a.pct}%</span>
    </div>`).join('');

  /* ── Breakdown ── */
  document.getElementById('bd').innerHTML = d.allocs.map((a, i) => `
    <div class="cblock">
      <div class="ctitle">
        <span class="cname" style="color:${colors[i]}">${a.cat}</span>
        <span class="cpct" style="color:${colors[i]}">${a.pct}%</span>
      </div>
      ${a.items.map(it => {
        const amt = Math.round(save * it.p / 100);
        const liveStyle = it.live ? 'background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); font-weight:600; padding:3px 8px; border-radius:12px;' : '';
        return `
        <div class="inst">
          <div style="flex-grow: 1; padding-right: 15px;">
            <div class="in">${it.n}</div>
            <div class="iw">${it.w}</div>
            <span class="ir" style="${liveStyle}">${it.live ? '🟢 LIVE API: ' : ''}${it.r}</span>
            <div class="bw"><div class="bf" style="width:${it.p * 2.5}%;background:${colors[i]}"></div></div>
          </div>
          <div class="ir-right">
            <div class="ipct">${it.p}%</div>
            <div class="iamt">${fmt(amt)}/mo</div>
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');


  /* ── Growth line chart ── */
  const yl = [], cd = [];
  for (let y = 0; y <= yrs; y++) {
    yl.push('Yr ' + y);
    const m = y * 12;
    cd.push(m === 0 ? 0 : Math.round(save * ((Math.pow(1 + mr, m) - 1) / mr)));
  }
  if (LI) LI.destroy();
  LI = new Chart(document.getElementById('lc'), {
    type: 'line',
    data: {
      labels: yl,
      datasets: [{
        data: cd,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#3b82f6',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => '  ' + fmt(c.parsed.y) } },
      },
      scales: {
        y: {
          ticks: { callback: v => fmt(v), color: '#94a3b8' },
          grid:  { color: 'rgba(255,255,255,0.04)' },
          border:{ color: 'transparent' },
        },
        x: {
          ticks: { color: '#94a3b8', maxTicksLimit: 8 },
          grid:  { display: false },
          border:{ color: 'rgba(255,255,255,0.06)' },
        },
      },
    },
  });

  /* ── Goal insight & actions ── */
  document.getElementById('gi').textContent = G[rk][goal];

  document.getElementById('ap').innerHTML = d.actions.map((a, i) => `
    <div class="act">
      <div class="actn">0${i + 1}</div>
      <div class="actt">${a}</div>
    </div>`).join('');

  /* ── Fetch & render Live AI Suggestions ── */
  const suggContainer = document.getElementById('live-suggestions-content');
  if (suggContainer) {
    suggContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem;">Fetching live market AI recommendations...</div>';
    try {
      if (window.ApiService && typeof window.ApiService.getLiveSuggestions === 'function') {
        let customAssetData = null;
        if (cType !== 'none' && cCode && cAlloc > 0) {
          customAssetData = {
            assetType: cType,
            code: cCode,
            allocation: cAlloc
          };
        }

        const liveData = await window.ApiService.getLiveSuggestions({
          monthlyIncome: inc,
          monthlyExpenses: exp,
          goal: goal,
          riskAppetite: rk,
          investmentHorizon: yrs,
          customAsset: customAssetData
        });

        const suggestions = liveData?.suggestions || [];
        if (suggestions.length > 0) {
          suggContainer.innerHTML = suggestions.map(s => `
            <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid var(--primary-color); padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 0.9rem; line-height: 1.5;">
              <strong style="color: var(--primary-color); display: block; margin-bottom: 4px;">💡 ${s.title}</strong>
              ${s.text}
            </div>
          `).join('');
        }
      }
    } catch (e) {
      console.warn('Could not fetch live suggestions:', e);
      suggContainer.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid var(--primary-color); padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 0.9rem;">
          <strong style="color: var(--primary-color); display: block; margin-bottom: 4px;">💡 Live Market Recommendation</strong>
          Systematic index investing combined with short term debt yields consistent wealth compounding for your horizon.
        </div>
      `;
    }
  }


  /* Reveal results */
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('sc').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ── Render live AI suggestions panel (called async after analyze) ────────────
function renderLiveSuggestionsPanel(liveData, d) {
    const suggContainer = document.getElementById('live-suggestions-content');
    if (!suggContainer || !liveData) return;

    const suggestions = liveData.suggestions || [];
    if (suggestions.length === 0) return;

    const typeColors = {
        custom:       '#8b5cf6',
        optimization: '#10b981',
        warning:      '#f59e0b',
        market:       '#3b82f6',
        growth:       '#ec4899',
        safety:       '#14b8a6',
        balanced:     '#6366f1',
        tax:          '#f97316'
    };

    suggContainer.innerHTML = suggestions.map(s => {
        const borderColor = typeColors[s.type] || 'var(--primary-color)';
        const bg = `rgba(${borderColor === 'var(--primary-color)' ? '59,130,246' : '255,255,255'}, 0.05)`;
        return `
            <div style="background: rgba(255,255,255,0.04); border-left: 3px solid ${borderColor}; padding: 13px 16px; border-radius: 0 10px 10px 0; font-size: 0.88rem; line-height: 1.55; transition: transform 0.2s;" onmouseenter="this.style.transform='translateX(4px)'" onmouseleave="this.style.transform='translateX(0)'">
                <strong style="color: ${borderColor}; display: block; margin-bottom: 5px;">${s.icon || '💡'} ${s.title}</strong>
                <span style="color: var(--text-muted);">${s.text}</span>
                ${s.action ? `<div style="margin-top: 8px;"><span style="font-size:0.78rem; padding: 3px 10px; border-radius: 20px; background: ${borderColor}22; color: ${borderColor}; cursor: pointer;">${s.action} →</span></div>` : ''}
            </div>
        `;
    }).join('');

    // Add live market badge
    if (liveData.liveAsset) {
        const badge = `<div style="font-size:0.78rem; color:#10b981; margin-top:10px; padding:6px 12px; background:rgba(16,185,129,0.1); border-radius:20px; display:inline-block;">🟢 Live data: ${liveData.liveAsset.name.split('(')[0].trim()} NAV ₹${liveData.liveAsset.nav.toFixed(2)} as of ${liveData.liveAsset.date}</div>`;
        suggContainer.insertAdjacentHTML('afterend', badge);
    }
}
