// Cryptocurrency Charts System
// Handles interactive price charts and technical analysis

class CryptoCharts {
    constructor() {
        this.charts = new Map();
        this.defaultTimeframe = '7d';
        this.failedFetches = new Set(); // Track failed API calls
        this.rateLimitDelay = 500; // 500ms between API calls
        this.lastFetchTime = 0;
        this.init();
    }

    init() {
        console.log('Crypto Charts system initialized');
        this.loadChartJS();
    }

    // Load Chart.js library dynamically
    async loadChartJS() {
        if (typeof Chart !== 'undefined') return;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
            script.onload = () => {
                console.log('Chart.js loaded successfully');
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Create price chart for a cryptocurrency
    async createPriceChart(containerId, cryptoId, timeframe = '7d') {
        console.log('Creating price chart for:', { containerId, cryptoId, timeframe });
        try {
            await this.loadChartJS();
            
            const container = document.getElementById(containerId);
            console.log('Container found:', !!container, container);
            if (!container) {
                console.error(`Container ${containerId} not found`);
                return null;
            }

            // Show loading state
            container.innerHTML = `
                <div class="chart-loading d-flex justify-content-center align-items-center" style="height: 400px;">
                    <div class="text-center">
                        <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                        <p class="text-muted">Loading chart data...</p>
                    </div>
                </div>
            `;

            // Fetch historical data
            const historyData = await this.fetchHistoricalData(cryptoId, timeframe);
            console.log('Historical data fetched:', historyData ? historyData.length : 0, 'points');
            if (!historyData || historyData.length === 0) {
                console.warn('No historical data available');
                this.showChartError(container, 'No chart data available');
                return null;
            }

            // Create canvas
            container.innerHTML = `
                <div class="chart-container">
                    <div class="chart-header d-flex justify-content-between align-items-center mb-3">
                        <div class="chart-info">
                            <h5 class="mb-1" id="chart-title-${cryptoId}">Price Chart</h5>
                            <small class="text-muted" id="chart-subtitle-${cryptoId}">Loading...</small>
                        </div>
                        <div class="chart-controls">
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-outline-primary ${timeframe === '24h' ? 'active' : ''}" 
                                        onclick="cryptoCharts.updateChart('${containerId}', '${cryptoId}', '24h')">24H</button>
                                <button type="button" class="btn btn-outline-primary ${timeframe === '7d' ? 'active' : ''}" 
                                        onclick="cryptoCharts.updateChart('${containerId}', '${cryptoId}', '7d')">7D</button>
                                <button type="button" class="btn btn-outline-primary ${timeframe === '30d' ? 'active' : ''}" 
                                        onclick="cryptoCharts.updateChart('${containerId}', '${cryptoId}', '30d')">30D</button>
                                <button type="button" class="btn btn-outline-primary ${timeframe === '90d' ? 'active' : ''}" 
                                        onclick="cryptoCharts.updateChart('${containerId}', '${cryptoId}', '90d')">90D</button>
                                <button type="button" class="btn btn-outline-primary ${timeframe === '1y' ? 'active' : ''}" 
                                        onclick="cryptoCharts.updateChart('${containerId}', '${cryptoId}', '1y')">1Y</button>
                            </div>
                        </div>
                    </div>
                    <div class="chart-wrapper" style="position: relative; height: 400px;">
                        <canvas id="chart-${cryptoId}-${Date.now()}" style="background: rgba(15, 15, 35, 0.8); border-radius: 12px;"></canvas>
                    </div>
                </div>
            `;

            const canvas = container.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            console.log('Canvas and context ready:', !!canvas, !!ctx);

            // Check if Chart.js is available
            if (typeof Chart === 'undefined') {
                console.error('Chart.js is not available');
                this.showChartError(container, 'Chart library not loaded');
                return null;
            }

            // Destroy existing chart if it exists
            const existingChart = this.charts.get(containerId);
            if (existingChart) {
                console.log('Destroying existing chart');
                existingChart.destroy();
            }

            // Prepare chart data
            const chartData = this.prepareChartData(historyData, cryptoId);
            console.log('Chart data prepared:', chartData);
            
            // Create new chart
            console.log('Creating Chart.js instance...');
            const chart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: this.getChartOptions(timeframe)
            });
            console.log('Chart created successfully:', chart);

            // Store chart reference
            this.charts.set(containerId, chart);
            console.log('Chart stored in map for container:', containerId);

            // Update chart title with current info
            await this.updateChartTitle(cryptoId, timeframe);

            return chart;

        } catch (error) {
            console.error('Error creating chart:', error);
            const container = document.getElementById(containerId);
            if (container) {
                this.showChartError(container, 'Failed to load chart');
            }
            return null;
        }
    }

    // Fetch historical price data
    async fetchHistoricalData(cryptoId, timeframe) {
        try {
            // Check if this crypto failed before
            if (this.failedFetches.has(cryptoId)) {
                console.log(`Using mock data for ${cryptoId} (previous API failure)`);
                return this.generateMockData(timeframe);
            }

            // Rate limiting
            await this.waitForRateLimit();

            let days, interval;
            
            switch (timeframe) {
                case '24h':
                    days = 1;
                    interval = 'hourly';
                    break;
                case '7d':
                    days = 7;
                    interval = 'hourly';
                    break;
                case '30d':
                    days = 30;
                    interval = 'daily';
                    break;
                case '90d':
                    days = 90;
                    interval = 'daily';
                    break;
                case '1y':
                    days = 365;
                    interval = 'daily';
                    break;
                default:
                    days = 7;
                    interval = 'hourly';
            }

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch chart data: ${response.status}`);
            }

            const data = await response.json();
            return data.prices || [];

        } catch (error) {
            console.error('Error fetching historical data:', error);
            // Mark this crypto as failed and return mock data
            this.failedFetches.add(cryptoId);
            return this.generateMockData(timeframe);
        }
    }

    // Generate mock price data when API fails
    generateMockData(timeframe) {
        const now = Date.now();
        let dataPoints = 168; // Default for 7d hourly
        let interval = 60 * 60 * 1000; // 1 hour

        switch (timeframe) {
            case '24h':
                dataPoints = 24;
                interval = 60 * 60 * 1000; // 1 hour
                break;
            case '7d':
                dataPoints = 168;
                interval = 60 * 60 * 1000; // 1 hour
                break;
            case '30d':
                dataPoints = 30;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case '90d':
                dataPoints = 90;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case '1y':
                dataPoints = 365;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
        }

        const mockData = [];
        let basePrice = 50000; // Base price for simulation
        
        for (let i = dataPoints - 1; i >= 0; i--) {
            const timestamp = now - (i * interval);
            // Generate realistic price fluctuations
            const volatility = 0.02; // 2% volatility
            const change = (Math.random() - 0.5) * 2 * volatility;
            basePrice = basePrice * (1 + change);
            mockData.push([timestamp, basePrice]);
        }

        return mockData;
    }

    // Rate limiting for API calls
    async waitForRateLimit() {
        const now = Date.now();
        const timeSinceLastFetch = now - this.lastFetchTime;
        
        if (timeSinceLastFetch < this.rateLimitDelay) {
            const waitTime = this.rateLimitDelay - timeSinceLastFetch;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.lastFetchTime = Date.now();
    }

    // Prepare data for Chart.js
    prepareChartData(historyData, cryptoId) {
        const prices = historyData.map(point => ({
            x: point[0], // Use timestamp directly
            y: point[1]
        }));

        // Calculate if price trend is positive or negative
        const isPositive = prices.length >= 2 && 
            prices[prices.length - 1].y > prices[0].y;

        const gradient = this.createGradient(isPositive);

        return {
            labels: prices.map((_, index) => index), // Simple numeric labels
            datasets: [{
                label: 'Price (USD)',
                data: prices,
                borderColor: isPositive ? '#10b981' : '#ef4444',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: isPositive ? '#10b981' : '#ef4444',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        };
    }

    // Create gradient fill for chart
    createGradient(isPositive) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        
        if (isPositive) {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
        } else {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
        }
        
        return gradient;
    }

    // Get chart configuration options
    getChartOptions(timeframe) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 15, 35, 0.95)',
                    titleColor: '#f8fafc',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(124, 58, 237, 0.6)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: (context) => {
                            // For linear scale, we need to get the timestamp from the data point
                            const dataIndex = context[0].dataIndex;
                            const dataset = context[0].dataset.data;
                            if (dataset && dataset[dataIndex]) {
                                const timestamp = dataset[dataIndex].x;
                                const date = new Date(timestamp);
                                return this.formatTooltipDate(date, timeframe);
                            }
                            return '';
                        },
                        label: (context) => {
                            return `$${this.formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    grid: {
                        color: 'rgba(124, 58, 237, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        maxTicksLimit: timeframe === '24h' ? 6 : 8,
                        callback: function(value, index, values) {
                            // Show only some labels to avoid crowding
                            if (index % Math.ceil(values.length / 6) === 0) {
                                return index.toString(); // Simple index labels
                            }
                            return '';
                        }
                    }
                },
                y: {
                    display: true,
                    position: 'right',
                    grid: {
                        color: 'rgba(124, 58, 237, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        callback: (value) => '$' + this.formatNumber(value)
                    }
                }
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'easeInOutCubic',
                    from: 0.4,
                    to: 0.4
                }
            }
        };
    }

    // Update existing chart with new timeframe
    async updateChart(containerId, cryptoId, timeframe) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Update active button
        const buttons = container.querySelectorAll('.btn-group button');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === timeframe) {
                btn.classList.add('active');
            }
        });

        // Show loading state on existing chart
        const existingChart = this.charts.get(containerId);
        if (existingChart) {
            existingChart.data.datasets[0].data = [];
            existingChart.update('none');
        }

        // Fetch new data and update
        try {
            const historyData = await this.fetchHistoricalData(cryptoId, timeframe);
            if (!historyData || historyData.length === 0) return;

            const chartData = this.prepareChartData(historyData, cryptoId);
            
            if (existingChart) {
                existingChart.data = chartData;
                existingChart.options = this.getChartOptions(timeframe);
                existingChart.update();
            } else {
                // Create new chart if none exists
                await this.createPriceChart(containerId, cryptoId, timeframe);
            }

            await this.updateChartTitle(cryptoId, timeframe);

        } catch (error) {
            console.error('Error updating chart:', error);
            showErrorToast('Failed to update chart data');
        }
    }

    // Update chart title with crypto info
    async updateChartTitle(cryptoId, timeframe) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_24hr_change=true`);
            const data = await response.json();
            const cryptoData = data[cryptoId];

            if (cryptoData) {
                const titleElement = document.getElementById(`chart-title-${cryptoId}`);
                const subtitleElement = document.getElementById(`chart-subtitle-${cryptoId}`);

                if (titleElement && subtitleElement) {
                    const price = cryptoData.usd;
                    const change24h = cryptoData.usd_24h_change || 0;
                    const changeClass = change24h >= 0 ? 'text-success' : 'text-danger';
                    const changeIcon = change24h >= 0 ? '▲' : '▼';

                    titleElement.innerHTML = `$${this.formatNumber(price)}`;
                    subtitleElement.innerHTML = `
                        <span class="${changeClass}">
                            ${changeIcon} ${Math.abs(change24h).toFixed(2)}% (24h)
                        </span> • ${this.getTimeframeLabel(timeframe)}
                    `;
                }
            }
        } catch (error) {
            console.error('Error updating chart title:', error);
        }
    }

    // Show chart error message
    showChartError(container, message) {
        container.innerHTML = `
            <div class="chart-error d-flex justify-content-center align-items-center" style="height: 400px;">
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
                    <h5 class="text-muted">${message}</h5>
                    <p class="text-muted">Please try again later</p>
                </div>
            </div>
        `;
    }

    // Create mini chart for cards
    async createMiniChart(containerId, cryptoId, timeframe = '7d') {
        try {
            await this.loadChartJS();
            
            const container = document.getElementById(containerId);
            if (!container) return null;

            const historyData = await this.fetchHistoricalData(cryptoId, timeframe);
            if (!historyData || historyData.length === 0) {
                // Show error state
                container.innerHTML = `
                    <div class="chart-placeholder">
                        <i class="bi bi-exclamation-triangle text-warning"></i>
                        <small class="text-muted">Chart unavailable</small>
                    </div>
                `;
                return null;
            }

            // Clear placeholder and create canvas
            container.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'width: 100%; height: 60px;';
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            const prices = historyData.map(point => point[1]);
            const isPositive = prices[prices.length - 1] > prices[0];

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: historyData.map((_, index) => index),
                    datasets: [{
                        data: prices,
                        borderColor: isPositive ? '#10b981' : '#ef4444',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    animations: false
                }
            });

            this.charts.set(containerId, chart);
            return chart;

        } catch (error) {
            console.error('Error creating mini chart:', error);
            return null;
        }
    }

    // Utility functions
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        } else if (num >= 1) {
            return num.toFixed(2);
        } else {
            return num.toFixed(6);
        }
    }

    formatTooltipDate(date, timeframe) {
        const options = timeframe === '24h' || timeframe === '7d' 
            ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
            : { year: 'numeric', month: 'short', day: 'numeric' };
        
        return date.toLocaleDateString('en-US', options);
    }

    getTimeframeLabel(timeframe) {
        const labels = {
            '24h': 'Last 24 Hours',
            '7d': 'Last 7 Days',
            '30d': 'Last 30 Days',
            '90d': 'Last 90 Days',
            '1y': 'Last Year'
        };
        return labels[timeframe] || labels['7d'];
    }

    // Destroy all charts (cleanup)
    destroyAllCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }

    // Destroy specific chart
    destroyChart(containerId) {
        const chart = this.charts.get(containerId);
        if (chart) {
            chart.destroy();
            this.charts.delete(containerId);
        }
    }
}

// Create global instance
window.cryptoCharts = new CryptoCharts();

// Make functions globally available
window.createCryptoChart = (containerId, cryptoId, timeframe) => 
    window.cryptoCharts.createPriceChart(containerId, cryptoId, timeframe);
window.createMiniChart = (containerId, cryptoId, timeframe) => 
    window.cryptoCharts.createMiniChart(containerId, cryptoId, timeframe);
window.updateCryptoChart = (containerId, cryptoId, timeframe) => 
    window.cryptoCharts.updateChart(containerId, cryptoId, timeframe);

console.log('Crypto Charts system loaded!');
