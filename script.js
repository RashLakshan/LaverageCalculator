document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('calc-form');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('results');

    // Input Fields
    const walletBalanceInput = document.getElementById('walletBalance');
    const riskAmountInput = document.getElementById('riskAmount');
    const entryPriceInput = document.getElementById('entryPrice');
    const slPriceInput = document.getElementById('slPrice');
    const fundingRateInput = document.getElementById('fundingRate');

    // Output Fields
    const tradeDirectionSpan = document.querySelector('#tradeDirection span');
    const resRiskAmount = document.getElementById('resRiskAmount');
    const resLeverage = document.getElementById('resLeverage');
    const resPositionUsd = document.getElementById('resPositionUsd');
    const resPositionCoins = document.getElementById('resPositionCoins');

    calculateBtn.addEventListener('click', () => {
        // Validation
        if (!calcForm.checkValidity()) {
            calcForm.reportValidity();
            return;
        }

        const walletBalance = parseFloat(walletBalanceInput.value);
        const riskAmount = parseFloat(riskAmountInput.value);
        const entryPrice = parseFloat(entryPriceInput.value);
        const slPrice = parseFloat(slPriceInput.value);
        const fundingRate = parseFloat(fundingRateInput.value);

        if (walletBalance <= 0 || riskAmount <= 0 || entryPrice <= 0 || slPrice <= 0 || fundingRate < 0) {
            alert('Please enter valid positive numbers.');
            return;
        }

        if (entryPrice === slPrice) {
            alert('Entry Price and Stop Loss Price cannot be the same.');
            return;
        }

        // Determine Trade Direction
        const isLong = entryPrice > slPrice;
        
        if (isLong) {
            tradeDirectionSpan.textContent = 'Long';
            tradeDirectionSpan.className = 'badge';
        } else {
            tradeDirectionSpan.textContent = 'Short';
            tradeDirectionSpan.className = 'badge short';
        }

        // --- Core Calculations ---
        // 1. Calculate risk in USD
        const riskUsd = walletBalance * (riskAmount / 100);

        // 2. Calculate Stop Loss percentage
        const priceDiff = Math.abs(entryPrice - slPrice);
        const slPercentage = priceDiff / entryPrice; // Decimal format (e.g., 0.05 for 5%)

        // 3. Convert fee percentage to decimal
        const feePercentage = fundingRate / 100;

        // 4. Total expected loss percentage (SL move + Fees)
        const totalLossPercentage = slPercentage + feePercentage;

        // 5. Calculate Required Position Size
        const positionSizeUsd = riskUsd / totalLossPercentage;

        // 6. Calculate Position in Coins
        const positionSizeCoins = positionSizeUsd / entryPrice;

        // 7. Calculate Recommended Leverage
        // Leverage = Position Size / Margin Used 
        // We assume Margin Used = Risk Amount
        const leverage = positionSizeUsd / riskUsd;

        // Update DOM Elements
        resRiskAmount.textContent = `$${riskUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resLeverage.textContent = `${leverage.toFixed(2)}x`;
        resPositionUsd.textContent = `$${positionSizeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Coins precision (can be small, so up to 4 decimals)
        resPositionCoins.textContent = positionSizeCoins.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });

        // Show results
        resultsContainer.style.display = 'block';

        // Add a small animation bump to results to show they updated
        resultsContainer.style.animation = 'none';
        setTimeout(() => {
            resultsContainer.style.animation = 'fadeIn 0.4s ease-out';
        }, 10);
    });
});
