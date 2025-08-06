// Crypto Page Management System
// Handles cryptocurrency data fetching, display, and watchlist functionality

let cryptoData = [];
let currentPage = 1;
let itemsPerPage = 20;
let currentView = 'grid';
let sortBy = 'market_cap_desc';
let searchTerm = '';

// Initialize crypto page
function initializeCrypto() {
    console.log('Initializing crypto page...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial crypto data
    loadCryptoData();
    
    // Load market stats
    loadMarketStats();
    
    console.log('Crypto page initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('crypto-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // View toggles
    const gridViewBtn = document.getElementById('view-grid');
    const listViewBtn = document.getElementById('view-list');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => switchView('grid'));
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => switchView('list'));
    }
    
    // Retry button
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', retryLoadData);
    }
}

// Load cryptocurrency data
async function loadCryptoData() {
    showLoading();
    hideError();
    
    try {
        // Using CoinGecko API (free tier)
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${itemsPerPage}&page=${currentPage}&sparkline=false&price_change_percentage=24h`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        cryptoData = data;
        
        console.log('Crypto data loaded:', data.length, 'coins');
        
        // Filter data if search term exists
        let filteredData = searchTerm ? filterCryptoData(cryptoData, searchTerm) : cryptoData;
        
        // Display data
        displayCryptoData(filteredData);
        setupPagination();
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading crypto data:', error);
        showError('Failed to load cryptocurrency data. Please check your internet connection and try again.');
        hideLoading();
    }
}

// Load market statistics
async function loadMarketStats() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        
        if (data && data.data) {
            updateMarketStats(data.data);
        }
    } catch (error) {
        console.error('Error loading market stats:', error);
    }
}

// Update market statistics display
function updateMarketStats(data) {
    console.log('Market stats data received:', data);
    
    if (!data) {
        console.warn('No market stats data available');
        return;
    }
    
    const totalMarketCap = document.getElementById('total-market-cap');
    const totalVolume = document.getElementById('total-volume');
    const btcDominance = document.getElementById('btc-dominance');
    const activeCryptos = document.getElementById('active-cryptos');
    
    if (totalMarketCap && data.total_market_cap && data.total_market_cap.usd) {
        totalMarketCap.textContent = formatCurrency(data.total_market_cap.usd, true);
    }
    
    if (totalVolume && data.total_volume && data.total_volume.usd) {
        totalVolume.textContent = formatCurrency(data.total_volume.usd, true);
    }
    
    if (btcDominance && data.market_cap_percentage && data.market_cap_percentage.btc) {
        btcDominance.textContent = data.market_cap_percentage.btc.toFixed(1) + '%';
    }
    
    if (activeCryptos && data.active_cryptocurrencies) {
        activeCryptos.textContent = data.active_cryptocurrencies.toLocaleString();
    }
}

// Display cryptocurrency data
function displayCryptoData(data) {
    if (currentView === 'grid') {
        displayGridView(data);
    } else {
        displayTableView(data);
    }
}

// Display grid view
function displayGridView(data) {
    const gridContainer = document.getElementById('crypto-grid');
    const tableContainer = document.getElementById('crypto-table');
    
    if (!gridContainer || !tableContainer) return;
    
    // Show grid, hide table
    gridContainer.classList.remove('d-none');
    tableContainer.classList.add('d-none');
    
    gridContainer.innerHTML = '';
    
    data.forEach(crypto => {
        const card = createCryptoCard(crypto);
        gridContainer.appendChild(card);
    });
    
    // Initialize charts after grid is created
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

// Display table view
function displayTableView(data) {
    const gridContainer = document.getElementById('crypto-grid');
    const tableContainer = document.getElementById('crypto-table');
    const tableBody = document.getElementById('crypto-table-body');
    
    if (!gridContainer || !tableContainer || !tableBody) return;
    
    // Show table, hide grid
    gridContainer.classList.add('d-none');
    tableContainer.classList.remove('d-none');
    
    tableBody.innerHTML = '';
    
    data.forEach((crypto, index) => {
        const row = createCryptoTableRow(crypto, index + 1);
        tableBody.appendChild(row);
    });
}

// Create crypto card for grid view
function createCryptoCard(crypto) {
    const card = document.createElement('div');
    card.className = 'crypto-card';
    
    const changeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
    const changeIcon = crypto.price_change_percentage_24h >= 0 ? '▲' : '▼';
    
    const isWatched = isInWatchlist(crypto.id);
    const watchlistText = isWatched ? 'In Watchlist' : 'Add to Watchlist';
    const watchlistClass = isWatched ? 'btn-watchlist added' : 'btn-watchlist';
    const watchlistIcon = isWatched ? 'bi-heart-fill' : 'bi-heart';
    
    card.innerHTML = `
        <div class="crypto-header">
            <img src="${crypto.image}" alt="${crypto.name}" class="crypto-logo" loading="lazy">
            <div class="crypto-info">
                <h4>${crypto.name}</h4>
                <p class="crypto-symbol">${crypto.symbol}</p>
            </div>
        </div>
        
        <div class="crypto-price">$${formatNumber(crypto.current_price)}</div>
        
        <div class="crypto-change ${changeClass}">
            ${changeIcon} ${crypto.price_change_percentage_24h.toFixed(2)}%
        </div>
        
        <div class="mini-chart-container">
            <div id="mini-chart-${crypto.id}" class="mini-chart">
                <div class="chart-placeholder">
                    <i class="bi bi-graph-up-arrow text-muted"></i>
                    <small class="text-muted">Chart loading...</small>
                </div>
            </div>
        </div>
        
        <div class="crypto-stats">
            <div class="crypto-stat">
                <span class="label">Market Cap</span>
                <span class="value">$${formatCurrency(crypto.market_cap, true)}</span>
            </div>
            <div class="crypto-stat">
                <span class="label">Volume (24h)</span>
                <span class="value">$${formatCurrency(crypto.total_volume, true)}</span>
            </div>
            <div class="crypto-stat">
                <span class="label">Rank</span>
                <span class="value">#${crypto.market_cap_rank}</span>
            </div>
            <div class="crypto-stat">
                <span class="label">Supply</span>
                <span class="value">${formatCurrency(crypto.circulating_supply, true)}</span>
            </div>
        </div>
        
        <div class="crypto-actions">
            <button class="${watchlistClass}" onclick="toggleWatchlist('${crypto.id}', '${crypto.name}', '${crypto.symbol}', '${crypto.image}', ${crypto.current_price})">
                <i class="bi ${watchlistIcon} me-2"></i>${watchlistText}
            </button>
            <button class="btn btn-outline-primary btn-sm ms-2" onclick="showChartModal('${crypto.id}', '${crypto.name}', '${crypto.symbol}')">
                <i class="bi bi-graph-up me-1"></i>Chart
            </button>
        </div>
    `;
    
    return card;
}

// Create crypto table row
function createCryptoTableRow(crypto, rank) {
    const row = document.createElement('tr');
    
    const changeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
    const changeIcon = crypto.price_change_percentage_24h >= 0 ? '▲' : '▼';
    
    const isWatched = isInWatchlist(crypto.id);
    const watchlistText = isWatched ? 'Remove' : 'Add';
    const watchlistClass = isWatched ? 'btn btn-success btn-sm' : 'btn btn-primary btn-sm';
    
    row.innerHTML = `
        <td>${rank}</td>
        <td>
            <div class="table-crypto-info">
                <img src="${crypto.image}" alt="${crypto.name}" loading="lazy">
                <div class="table-crypto-details">
                    <h6>${crypto.name}</h6>
                    <small>${crypto.symbol.toUpperCase()}</small>
                </div>
            </div>
        </td>
        <td>$${formatNumber(crypto.current_price)}</td>
        <td>
            <span class="crypto-change ${changeClass}">
                ${changeIcon} ${crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
        </td>
        <td>$${formatCurrency(crypto.market_cap, true)}</td>
        <td>$${formatCurrency(crypto.total_volume, true)}</td>
        <td>
            <button class="${watchlistClass}" onclick="toggleWatchlist('${crypto.id}', '${crypto.name}', '${crypto.symbol}', '${crypto.image}', ${crypto.current_price})">
                ${watchlistText}
            </button>
            <button class="btn btn-outline-primary btn-sm ms-1" onclick="showChartModal('${crypto.id}', '${crypto.name}', '${crypto.symbol}')">
                <i class="bi bi-graph-up"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Toggle watchlist
function toggleWatchlist(cryptoId, name, symbol, image, price) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showErrorToast('Please log in to add cryptocurrencies to your watchlist');
        return;
    }
    
    if (isInWatchlist(cryptoId)) {
        removeFromWatchlist(cryptoId);
        showSuccessToast(`${name} removed from watchlist`);
    } else {
        showAddToWatchlistModal(cryptoId, name, symbol, image, price);
    }
    
    // Refresh the display to update buttons
    setTimeout(() => {
        let filteredData = searchTerm ? filterCryptoData(cryptoData, searchTerm) : cryptoData;
        displayCryptoData(filteredData);
    }, 100);
}

// Show add to watchlist modal
function showAddToWatchlistModal(cryptoId, name, symbol, image, price) {
    const modal = document.querySelector('.add-watchlist-container');
    if (!modal) return;
    
    // Update modal content
    const logo = document.getElementById('modal-crypto-logo');
    const nameEl = document.getElementById('modal-crypto-name');
    const symbolEl = document.getElementById('modal-crypto-symbol');
    const priceEl = document.getElementById('modal-crypto-price');
    
    if (logo) logo.src = image;
    if (nameEl) nameEl.textContent = name;
    if (symbolEl) symbolEl.textContent = symbol.toUpperCase();
    if (priceEl) priceEl.textContent = formatNumber(price);
    
    // Show modal
    modal.classList.remove('hide');
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Setup modal event listeners
    setupAddToWatchlistModal(cryptoId, name, symbol, image, price);
}

// Setup add to watchlist modal event listeners
function setupAddToWatchlistModal(cryptoId, name, symbol, image, price) {
    const modal = document.querySelector('.add-watchlist-container');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const form = modal.querySelector('.watchlist-form');
    
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clear form
        const priceAlert = document.getElementById('price-alert');
        if (priceAlert) priceAlert.value = '';
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.onclick = closeModal;
    }
    
    // Click outside to close
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    // Form submission
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const priceAlert = document.getElementById('price-alert').value;
            const alertType = document.getElementById('alert-type').value;
            
            addToWatchlist(cryptoId, name, symbol, image, price, priceAlert, alertType);
            closeModal();
            
            showSuccessToast(`${name} added to watchlist`);
            
            // Refresh the display to update buttons
            setTimeout(() => {
                let filteredData = searchTerm ? filterCryptoData(cryptoData, searchTerm) : cryptoData;
                displayCryptoData(filteredData);
            }, 100);
        };
    }
}

// Add to watchlist
function addToWatchlist(cryptoId, name, symbol, image, price, priceAlert, alertType) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const watchlist = getWatchlist();
    
    const watchlistItem = {
        id: cryptoId,
        name: name,
        symbol: symbol,
        image: image,
        addedPrice: price,
        addedDate: new Date().toISOString(),
        priceAlert: priceAlert ? parseFloat(priceAlert) : null,
        alertType: alertType || 'above'
    };
    
    watchlist.push(watchlistItem);
    saveWatchlist(watchlist);
    
    // Start price monitoring if not already active (without notification)
    if (window.priceMonitor && !window.priceMonitor.isActive) {
        window.priceMonitor.startMonitoring(false);
    }
    
    // Add notification about successful watchlist addition
    if (window.priceMonitor) {
        window.priceMonitor.addNotification({
            type: 'success',
            title: 'Added to Watchlist',
            message: `${name} (${symbol.toUpperCase()}) has been added to your watchlist${priceAlert ? ` with price alert at $${priceAlert}` : ''}.`,
            cryptoId: cryptoId,
            cryptoName: name,
            timestamp: Date.now(),
            read: false
        });
    }
}

// Remove from watchlist
function removeFromWatchlist(cryptoId) {
    const watchlist = getWatchlist();
    const filteredWatchlist = watchlist.filter(item => item.id !== cryptoId);
    saveWatchlist(filteredWatchlist);
}

// Check if crypto is in watchlist
function isInWatchlist(cryptoId) {
    const watchlist = getWatchlist();
    return watchlist.some(item => item.id === cryptoId);
}

// Get user's watchlist
function getWatchlist() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return [];
    
    const watchlist = localStorage.getItem(`watchlist_${currentUser}`);
    return watchlist ? JSON.parse(watchlist) : [];
}

// Save user's watchlist
function saveWatchlist(watchlist) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    localStorage.setItem(`watchlist_${currentUser}`, JSON.stringify(watchlist));
}

// Handle search
function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase().trim();
    console.log('Search term:', searchTerm);
    
    const filteredData = searchTerm ? filterCryptoData(cryptoData, searchTerm) : cryptoData;
    displayCryptoData(filteredData);
}

// Filter crypto data
function filterCryptoData(data, term) {
    return data.filter(crypto => 
        crypto.name.toLowerCase().includes(term) ||
        crypto.symbol.toLowerCase().includes(term)
    );
}

// Handle sort
function handleSort(event) {
    sortBy = event.target.value;
    console.log('Sort by:', sortBy);
    
    // Reload data with new sort order
    currentPage = 1;
    loadCryptoData();
}

// Switch view
function switchView(view) {
    currentView = view;
    
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    
    if (view === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }
    
    const filteredData = searchTerm ? filterCryptoData(cryptoData, searchTerm) : cryptoData;
    displayCryptoData(filteredData);
}

// Setup pagination
function setupPagination() {
    // For now, we'll implement basic pagination
    // In a real app, you'd get total count from API and implement full pagination
    const paginationContainer = document.getElementById('crypto-pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
        <li class="page-item active">
            <a class="page-link" href="#">${currentPage}</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
}

// Change page
function changePage(page) {
    if (page < 1) return;
    
    currentPage = page;
    loadCryptoData();
}

// Refresh data
function refreshData() {
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Refreshing...';
        refreshBtn.disabled = true;
        
        Promise.all([loadCryptoData(), loadMarketStats()])
            .finally(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
                showSuccessToast('Data refreshed successfully');
            });
    }
}

// Retry loading data
function retryLoadData() {
    loadCryptoData();
}

// Show loading spinner
function showLoading() {
    const loading = document.getElementById('loading-spinner');
    const error = document.getElementById('error-message');
    const grid = document.getElementById('crypto-grid');
    const table = document.getElementById('crypto-table');
    
    if (loading) loading.classList.remove('d-none');
    if (error) error.classList.add('d-none');
    if (grid) grid.classList.add('d-none');
    if (table) table.classList.add('d-none');
}

// Hide loading spinner
function hideLoading() {
    const loading = document.getElementById('loading-spinner');
    if (loading) loading.classList.add('d-none');
}

// Show error message
function showError(message) {
    const error = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    if (error) error.classList.remove('d-none');
    if (errorText) errorText.textContent = message;
}

// Hide error message
function hideError() {
    const error = document.getElementById('error-message');
    if (error) error.classList.add('d-none');
}

// Utility function: Format number
function formatNumber(num) {
    if (num >= 1) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(num);
    } else {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 6,
            maximumFractionDigits: 8
        }).format(num);
    }
}

// Utility function: Format currency
function formatCurrency(amount, abbreviated = false) {
    if (!amount) return '0';
    
    if (abbreviated) {
        if (amount >= 1e12) {
            return (amount / 1e12).toFixed(2) + 'T';
        } else if (amount >= 1e9) {
            return (amount / 1e9).toFixed(2) + 'B';
        } else if (amount >= 1e6) {
            return (amount / 1e6).toFixed(2) + 'M';
        } else if (amount >= 1e3) {
            return (amount / 1e3).toFixed(2) + 'K';
        }
    }
    
    return new Intl.NumberFormat('en-US').format(amount);
}

// Utility function: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions globally available
window.initializeCrypto = initializeCrypto;
window.toggleWatchlist = toggleWatchlist;
window.changePage = changePage;
window.showChartModal = showChartModal;

// Chart functionality
let cryptoCharts = null;

// Initialize charts after data is loaded
function initializeCharts() {
    if (typeof CryptoCharts !== 'undefined') {
        cryptoCharts = new CryptoCharts();
        
        // Create mini charts for only first 5 cryptos to avoid API rate limits
        const limitedCryptos = cryptoData.slice(0, 5);
        
        limitedCryptos.forEach((crypto, index) => {
            setTimeout(() => {
                cryptoCharts.createMiniChart(`mini-chart-${crypto.id}`, crypto.id);
            }, index * 600); // 600ms delay between each chart
        });
    }
}

// Show chart modal for detailed analysis
function showChartModal(cryptoId, cryptoName, cryptoSymbol) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('chart-modal');
    if (!modal) {
        modal = createChartModal();
        document.body.appendChild(modal);
    }
    
    // Update modal content
    const modalTitle = modal.querySelector('.modal-title');
    const chartContainer = modal.querySelector('#modal-chart-container');
    
    modalTitle.textContent = `${cryptoName} (${cryptoSymbol.toUpperCase()}) Price Chart`;
    chartContainer.innerHTML = '<div id="modal-chart"></div>';
    
    // Initialize chart
    if (cryptoCharts) {
        // Show modal first, then create chart after it's fully shown
        const bootstrapModal = new bootstrap.Modal(modal);
        
        // Listen for modal shown event
        modal.addEventListener('shown.bs.modal', function() {
            console.log('Modal shown, creating chart for:', cryptoId);
            
            // Double check that container exists and is visible
            const chartContainer = document.getElementById('modal-chart');
            console.log('Chart container in modal:', !!chartContainer);
            
            if (chartContainer) {
                // Add a small delay to ensure everything is rendered
                setTimeout(() => {
                    cryptoCharts.createPriceChart('modal-chart', cryptoId, '7d');
                }, 200);
            } else {
                console.error('Modal chart container not found!');
            }
        }, { once: true }); // Use once to avoid multiple listeners
        
        bootstrapModal.show();
    } else {
        // If cryptoCharts not available, still show modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Create chart modal HTML
function createChartModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'chart-modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'chart-modal-label');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="chart-modal-label">Cryptocurrency Chart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="chart-controls mb-3">
                        <div class="btn-group" role="group" aria-label="Timeframe">
                            <button type="button" class="btn btn-outline-primary active" onclick="updateModalChart('24h')">24H</button>
                            <button type="button" class="btn btn-outline-primary" onclick="updateModalChart('7d')">7D</button>
                            <button type="button" class="btn btn-outline-primary" onclick="updateModalChart('30d')">30D</button>
                            <button type="button" class="btn btn-outline-primary" onclick="updateModalChart('90d')">90D</button>
                            <button type="button" class="btn btn-outline-primary" onclick="updateModalChart('1y')">1Y</button>
                        </div>
                    </div>
                    <div id="modal-chart-container" class="chart-container">
                        <div id="modal-chart"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Update modal chart with different timeframe
function updateModalChart(timeframe) {
    console.log('Updating modal chart with timeframe:', timeframe);
    
    // Update active button
    const buttons = document.querySelectorAll('#chart-modal .chart-controls .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Get current crypto ID from modal
    const modalTitle = document.querySelector('#chart-modal .modal-title').textContent;
    console.log('Modal title:', modalTitle);
    const cryptoMatch = modalTitle.match(/\(([A-Z]+)\)/);
    if (cryptoMatch) {
        const symbol = cryptoMatch[1].toLowerCase();
        console.log('Found symbol:', symbol);
        // Find crypto ID by symbol
        const crypto = cryptoData.find(c => c.symbol.toLowerCase() === symbol);
        console.log('Found crypto:', crypto);
        if (crypto && cryptoCharts) {
            console.log('Updating chart for:', crypto.id, 'timeframe:', timeframe);
            cryptoCharts.updateChart('modal-chart', crypto.id, timeframe);
        } else {
            console.error('Crypto not found or cryptoCharts not available');
        }
    } else {
        console.error('Could not extract symbol from modal title');
    }
}

// Make chart functions globally available
window.updateModalChart = updateModalChart;
