// Application State
let appState = {
    activeSection: "savdo",
    cash: 0,
    totalDebt: 0,
    totalEggs: 0,
    soldEggs: 0,
    todayIncome: 0,
    todayOutcome: 0,
    debts: [],
    salesHistory: [],
    showResetMessage: false
};

// DOM Elements
const elements = {
    // Sections
    resetMessage: document.getElementById('reset-message'),
    cashStatus: document.getElementById('cash-status'),
    results: document.getElementById('results'),
    
    // Calculation Form
    soldEggs: document.getElementById('soldEggs'),
    eggPrice: document.getElementById('eggPrice'),
    givenAmount: document.getElementById('givenAmount'),
    stockWarning: document.getElementById('stock-warning'),
    remainingCount: document.getElementById('remaining-count'),
    
    // Buttons
    calculateBtn: document.getElementById('calculate-btn'),
    resetBtn: document.getElementById('reset-btn'),
    addInventoryBtn: document.getElementById('add-inventory-btn'),
    confirmAddInventory: document.getElementById('confirm-add-inventory'),
    cancelAddInventory: document.getElementById('cancel-add-inventory'),
    
    // Inventory Form
    addInventoryForm: document.getElementById('add-inventory-form'),
    newInventory: document.getElementById('newInventory'),
    
    // Display Elements
    totalEggs: document.getElementById('total-eggs'),
    soldEggsDisplay: document.getElementById('sold-eggs'),
    remainingEggs: document.getElementById('remaining-eggs'),
    todayIncome: document.getElementById('today-income'),
    todayOutcome: document.getElementById('today-outcome'),
    cashAmount: document.getElementById('cash-amount'),
    totalDebtDisplay: document.getElementById('total-debt'),
    debtTotal: document.getElementById('debt-total'),
    stockProgress: document.getElementById('stock-progress'),
    
    // Results
    totalAmount: document.getElementById('total-amount'),
    cashAdded: document.getElementById('cash-added'),
    debtResult: document.getElementById('debt-result'),
    debtAmount: document.getElementById('debt-amount'),
    paidDebtResult: document.getElementById('paid-debt-result'),
    paidDebtAmount: document.getElementById('paid-debt-amount'),
    
    // Debts
    noDebts: document.getElementById('no-debts'),
    debtsList: document.getElementById('debts-list'),
    debtsCount: document.getElementById('debts-count'),
    debtsContainer: document.getElementById('debts-container'),
    
    // Warnings
    lowStockWarning: document.getElementById('low-stock-warning'),
    outOfStockWarning: document.getElementById('out-of-stock-warning'),
    
    // Chart
    salesChart: document.getElementById('sales-chart')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadData();
    
    // Render initial state
    render();
    
    // Setup event listeners
    setupEventListeners();
});

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('eggSalesData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appState = { ...appState, ...parsedData };
        } catch (error) {
            console.error('Failed to parse saved data:', error);
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('eggSalesData', JSON.stringify(appState));
}

// Setup event listeners
function setupEventListeners() {
    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            setActiveSection(section);
        });
    });
    
    // Calculation form
    elements.calculateBtn.addEventListener('click', handleSale);
    elements.resetBtn.addEventListener('click', resetForm);
    
    // Inventory form
    elements.addInventoryBtn.addEventListener('click', toggleAddInventoryForm);
    elements.confirmAddInventory.addEventListener('click', handleAddInventory);
    elements.cancelAddInventory.addEventListener('click', hideAddInventoryForm);
    
    // Input validation
    elements.soldEggs.addEventListener('input', validateStock);
}

// Set active section
function setActiveSection(section) {
    appState.activeSection = section;
    
    // Update UI
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });
}

// Validate stock when entering sold eggs
function validateStock() {
    const eggsToSell = parseFloat(elements.soldEggs.value) || 0;
    const remainingEggs = appState.totalEggs - appState.soldEggs;
    
    if (eggsToSell > remainingEggs) {
        elements.stockWarning.classList.remove('hidden');
        elements.remainingCount.textContent = remainingEggs;
    } else {
        elements.stockWarning.classList.add('hidden');
    }
}

// Handle sale calculation
function handleSale() {
    const soldEggs = parseFloat(elements.soldEggs.value) || 0;
    const givenAmount = parseFloat(elements.givenAmount.value) || 0;
    const eggPrice = parseFloat(elements.eggPrice.value) || 0;
    
    // Check if we have enough eggs
    const remainingEggs = appState.totalEggs - appState.soldEggs;
    if (soldEggs > remainingEggs) {
        alert("Omborda yetarli tuxum yo'q!");
        return;
    }
    
    if (soldEggs <= 0 || eggPrice <= 0) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }
    
    const totalAmount = soldEggs * eggPrice;
    let result = {};
    
    if (totalAmount > givenAmount) {
        // Customer owes money
        result = {
            totalAmount: totalAmount,
            debt: totalAmount - givenAmount,
            paidFromDebt: 0,
            addedToCash: givenAmount,
            isDifferenceCash: false
        };
    } else {
        // Customer paid extra or exact
        result = {
            totalAmount: totalAmount,
            debt: 0,
            paidFromDebt: givenAmount - totalAmount,
            addedToCash: totalAmount,
            isDifferenceCash: true
        };
    }
    
    // Update state
    completeSale(soldEggs, totalAmount, givenAmount, 
                result.debt || result.paidFromDebt, result.isDifferenceCash);
    
    // Show results
    showResults(result);
}

// Complete the sale and update state
function completeSale(eggCount, totalAmount, givenAmount, difference, isDifferenceCash) {
    // Update inventory
    appState.soldEggs += eggCount;
    appState.todayOutcome += eggCount;
    
    // Update cash
    appState.cash += givenAmount;
    
    if (isDifferenceCash) {
        // Customer paid extra - reduced debt
        appState.totalDebt = Math.max(0, appState.totalDebt - difference);
    } else {
        // Customer has debt
        appState.totalDebt += difference;
        
        // Add to debts list
        const newDebt = {
            id: Date.now().toString(),
            customerName: `Mijoz ${appState.debts.length + 1}`,
            amount: difference,
            date: new Date().toLocaleDateString('uz-UZ')
        };
        appState.debts.push(newDebt);
    }
    
    // Add to sales history
    const newSale = {
        id: Date.now().toString(),
        eggs: eggCount,
        amount: totalAmount,
        date: new Date().toLocaleDateString('uz-UZ'),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };
    appState.salesHistory.unshift(newSale);
    appState.salesHistory = appState.salesHistory.slice(0, 10); // Keep only last 10
    
    // Auto-reset when inventory reaches zero
    const remainingEggs = appState.totalEggs - appState.soldEggs;
    if (appState.totalEggs > 0 && remainingEggs <= 0) {
        appState.showResetMessage = true;
        setTimeout(() => {
            appState.showResetMessage = false;
            render();
        }, 10000);
        
        // Reset all values except debts
        appState.totalEggs = 0;
        appState.soldEggs = 0;
        appState.todayIncome = 0;
        appState.todayOutcome = 0;
        appState.salesHistory = [];
    }
    
    // Save and render
    saveData();
    render();
}

// Show calculation results
function showResults(result) {
    elements.totalAmount.textContent = `${result.totalAmount.toLocaleString()} so'm`;
    elements.cashAdded.textContent = `${result.addedToCash.toLocaleString()} so'm`;
    
    if (result.debt > 0) {
        elements.debtResult.classList.remove('hidden');
        elements.debtAmount.textContent = `${result.debt.toLocaleString()} so'm`;
        elements.paidDebtResult.classList.add('hidden');
    } else if (result.paidFromDebt > 0) {
        elements.paidDebtResult.classList.remove('hidden');
        elements.paidDebtAmount.textContent = `${result.paidFromDebt.toLocaleString()} so'm`;
        elements.debtResult.classList.add('hidden');
    } else {
        elements.debtResult.classList.add('hidden');
        elements.paidDebtResult.classList.add('hidden');
    }
    
    elements.results.classList.remove('hidden');
}

// Reset calculation form
function resetForm() {
    elements.soldEggs.value = '';
    elements.eggPrice.value = '';
    elements.givenAmount.value = '';
    elements.results.classList.add('hidden');
    elements.stockWarning.classList.add('hidden');
}

// Toggle add inventory form
function toggleAddInventoryForm() {
    elements.addInventoryForm.classList.toggle('hidden');
}

// Hide add inventory form
function hideAddInventoryForm() {
    elements.addInventoryForm.classList.add('hidden');
    elements.newInventory.value = '';
}

// Handle adding inventory
function handleAddInventory() {
    const amount = parseFloat(elements.newInventory.value) || 0;
    if (amount > 0) {
        appState.totalEggs += amount;
        appState.todayIncome += amount;
        
        // Save and render
        saveData();
        render();
        
        // Hide form and reset
        hideAddInventoryForm();
    }
}

// Remove a debt
function removeDebt(id) {
    appState.debts = appState.debts.filter(debt => debt.id !== id);
    saveData();
    render();
}

// Render the application UI
function render() {
    // Update basic counts
    const remainingEggs = appState.totalEggs - appState.soldEggs;
    
    elements.totalEggs.textContent = `${appState.totalEggs.toLocaleString()} dona`;
    elements.soldEggsDisplay.textContent = appState.soldEggs.toLocaleString();
    elements.remainingEggs.textContent = remainingEggs.toLocaleString();
    elements.todayIncome.textContent = appState.todayIncome.toLocaleString();
    elements.todayOutcome.textContent = appState.todayOutcome.toLocaleString();
    elements.cashAmount.textContent = `${appState.cash.toLocaleString()} so'm`;
    elements.totalDebtDisplay.textContent = `${appState.totalDebt.toLocaleString()} so'm`;
    elements.debtTotal.textContent = `${appState.totalDebt.toLocaleString()} so'm`;
    
    // Update progress bar
    const stockPercentage = appState.totalEggs > 0 ? (remainingEggs / appState.totalEggs) * 100 : 0;
    elements.stockProgress.style.width = `${stockPercentage}%`;
    
    // Show/hide cash status
    if (appState.cash > 0 || appState.totalDebt > 0) {
        elements.cashStatus.classList.remove('hidden');
    } else {
        elements.cashStatus.classList.add('hidden');
    }
    
    // Show/hide warnings
    const isLowStock = stockPercentage < 20 && stockPercentage > 0;
    const isOutOfStock = remainingEggs === 0;
    
    if (isLowStock) {
        elements.lowStockWarning.classList.remove('hidden');
    } else {
        elements.lowStockWarning.classList.add('hidden');
    }
    
    if (isOutOfStock) {
        elements.outOfStockWarning.classList.remove('hidden');
    } else {
        elements.outOfStockWarning.classList.add('hidden');
    }
    
    // Show/hide reset message
    if (appState.showResetMessage) {
        elements.resetMessage.classList.remove('hidden');
    } else {
        elements.resetMessage.classList.add('hidden');
    }
    
    // Render debts
    renderDebts();
    
    // Render chart
    renderChart();
}

// Render debts list
function renderDebts() {
    elements.debtsCount.textContent = appState.debts.length;
    
    if (appState.debts.length === 0) {
        elements.noDebts.classList.remove('hidden');
        elements.debtsList.classList.add('hidden');
    } else {
        elements.noDebts.classList.add('hidden');
        elements.debtsList.classList.remove('hidden');
        
        // Clear container
        elements.debtsContainer.innerHTML = '';
        
        // Add debts
        appState.debts.forEach(debt => {
            const debtElement = document.createElement('div');
            debtElement.className = 'debt-item';
            debtElement.innerHTML = `
                <div class="debt-info">
                    <div class="debt-name">${debt.customerName}
                        <span class="debt-badge">Qarzdor</span>
                    </div>
                    <div class="debt-date">${debt.date}</div>
                </div>
                <div class="debt-amount">${debt.amount.toLocaleString()} so'm</div>
                <button class="remove-debt" data-id="${debt.id}">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            `;
            elements.debtsContainer.appendChild(debtElement);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-debt').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removeDebt(id);
            });
        });
    }
}

// Render sales chart
function renderChart() {
    // For simplicity, we'll just show/hide the chart container
    // In a real implementation, you would use a charting library like Chart.js
    if (appState.salesHistory.length > 0) {
        elements.salesChart.classList.remove('hidden');
        // Here you would initialize/update your chart
    } else {
        elements.salesChart.classList.add('hidden');
    }
}