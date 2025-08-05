// Real-time Price Monitoring and Notifications System
// Monitors cryptocurrency prices and triggers alerts based on user-defined conditions

class PriceMonitor {
    constructor() {
        this.isActive = false;
        this.checkInterval = 30000; // Check every 30 seconds
        this.intervalId = null;
        this.lastPrices = new Map();
        this.notifications = [];
        this.maxNotifications = 50;
        
        this.init();
    }

    init() {
        console.log('Price Monitor initialized');
        this.loadStoredNotifications();
        
        // Start monitoring if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            this.startMonitoring();
        }
    }

    // Start price monitoring
    startMonitoring(showNotification = false) {
        if (this.isActive) return;
        
        console.log('Starting price monitoring...');
        this.isActive = true;
        
        // Initial check
        this.checkPriceAlerts();
        
        // Set up interval for regular checks
        this.intervalId = setInterval(() => {
            this.checkPriceAlerts();
        }, this.checkInterval);
        
        // Only show notification if explicitly requested
        if (showNotification) {
            this.addNotification({
                type: 'info',
                title: 'Price Monitoring Started',
                message: 'Real-time price monitoring is now active for your watchlist.',
                timestamp: Date.now(),
                read: false
            });
        }
    }

    // Stop price monitoring
    stopMonitoring() {
        if (!this.isActive) return;
        
        console.log('Stopping price monitoring...');
        this.isActive = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Check price alerts for all watchlist items
    async checkPriceAlerts() {
        try {
            const watchlist = this.getWatchlist();
            if (watchlist.length === 0) return;

            // Get items with price alerts
            const itemsWithAlerts = watchlist.filter(item => item.priceAlert);
            if (itemsWithAlerts.length === 0) return;

            // Fetch current prices
            const cryptoIds = itemsWithAlerts.map(item => item.id).join(',');
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`);
            
            if (!response.ok) {
                console.error('Failed to fetch prices for monitoring');
                return;
            }

            const priceData = await response.json();

            // Check each item for alert triggers
            itemsWithAlerts.forEach(item => {
                const currentPrice = priceData[item.id]?.usd;
                if (!currentPrice) return;

                const priceChange24h = priceData[item.id]?.usd_24h_change || 0;
                this.checkIndividualAlert(item, currentPrice, priceChange24h);
            });

        } catch (error) {
            console.error('Error checking price alerts:', error);
        }
    }

    // Check individual price alert
    checkIndividualAlert(item, currentPrice, priceChange24h) {
        const { id, name, symbol, priceAlert, alertType } = item;
        const lastPrice = this.lastPrices.get(id);
        
        // Update last known price
        this.lastPrices.set(id, currentPrice);
        
        // Skip if we don't have a previous price (first check)
        if (lastPrice === undefined) return;

        let alertTriggered = false;
        let alertMessage = '';

        // Check price alert conditions
        if (alertType === 'above' && currentPrice >= priceAlert && lastPrice < priceAlert) {
            alertTriggered = true;
            alertMessage = `${name} (${symbol.toUpperCase()}) reached your target price of $${this.formatNumber(priceAlert)}! Current price: $${this.formatNumber(currentPrice)}`;
        } else if (alertType === 'below' && currentPrice <= priceAlert && lastPrice > priceAlert) {
            alertTriggered = true;
            alertMessage = `${name} (${symbol.toUpperCase()}) dropped below your alert price of $${this.formatNumber(priceAlert)}! Current price: $${this.formatNumber(currentPrice)}`;
        }

        // Check for significant price movements (>10% change)
        if (Math.abs(priceChange24h) >= 10) {
            const movementType = priceChange24h > 0 ? 'surged' : 'dropped';
            const movementMessage = `${name} (${symbol.toUpperCase()}) has ${movementType} ${Math.abs(priceChange24h).toFixed(2)}% in the last 24 hours! Current price: $${this.formatNumber(currentPrice)}`;
            
            this.addNotification({
                type: priceChange24h > 0 ? 'success' : 'warning',
                title: 'Significant Price Movement',
                message: movementMessage,
                cryptoId: id,
                cryptoName: name,
                timestamp: Date.now(),
                read: false
            });
            
            // Show toast for significant movements
            if (priceChange24h > 0) {
                showSuccessToast(`🚀 ${name} is up ${priceChange24h.toFixed(2)}%!`);
            } else {
                showWarningToast(`📉 ${name} is down ${Math.abs(priceChange24h).toFixed(2)}%!`);
            }
        }

        // Trigger price alert if conditions are met
        if (alertTriggered) {
            this.addNotification({
                type: 'success',
                title: 'Price Alert Triggered',
                message: alertMessage,
                cryptoId: id,
                cryptoName: name,
                timestamp: Date.now(),
                read: false
            });

            // Show toast notification
            showSuccessToast(`🎯 Price Alert: ${alertMessage}`);

            // Show browser notification if available
            this.showBrowserNotification('Price Alert!', alertMessage);

            // Update notification count in UI
            if (typeof updateNotificationCount === 'function') {
                updateNotificationCount(1);
            }
        }
    }

    // Add notification to the system
    addNotification(notification) {
        // Add unique ID
        notification.id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Add to beginning of array (newest first)
        this.notifications.unshift(notification);
        
        // Limit number of stored notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }
        
        // Save to localStorage
        this.saveNotifications();
        
        // Update UI if notifications dropdown exists
        this.updateNotificationsUI();
        
        console.log('Notification added:', notification);
    }

    // Get all notifications
    getNotifications() {
        return this.notifications;
    }

    // Get unread notifications count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationsUI();
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationsUI();
    }

    // Remove notification
    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationsUI();
    }

    // Clear all notifications
    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.updateNotificationsUI();
    }

    // Update notifications UI
    updateNotificationsUI() {
        // Update notification count badge
        const notificationCount = document.getElementById('notification-count');
        const totalNotifications = document.getElementById('total-notifications');
        const unreadCount = this.getUnreadCount();
        
        if (notificationCount && totalNotifications) {
            totalNotifications.textContent = unreadCount;
            
            if (unreadCount === 0) {
                notificationCount.style.display = 'none';
            } else {
                notificationCount.style.display = 'inline';
                notificationCount.textContent = unreadCount;
            }
        }

        // Update dropdown content if it exists
        this.updateDropdownContent();
    }

    // Update dropdown content with real notifications
    updateDropdownContent() {
        const notificationsList = document.querySelector('.notification-list');
        if (!notificationsList) return;

        // Clear existing content
        notificationsList.innerHTML = '';

        // Show recent notifications (max 5 in dropdown)
        const recentNotifications = this.notifications.slice(0, 5);
        
        if (recentNotifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="dropdown-item text-center" style="color: #cbd5e1; padding: 2rem;">
                    <i class="bi bi-bell-slash me-2"></i>
                    No notifications yet
                </div>
            `;
            return;
        }

        recentNotifications.forEach(notification => {
            const notificationItem = this.createNotificationItem(notification);
            notificationsList.appendChild(notificationItem);
        });
    }

    // Create notification item for dropdown
    createNotificationItem(notification) {
        const item = document.createElement('div');
        item.className = 'dropdown-item notification-item';
        item.style.cssText = `
            background: ${notification.read ? 'rgba(124, 58, 237, 0.1)' : 'rgba(45, 27, 105, 0.2)'};
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            color: white;
            padding: 0.8rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            word-wrap: break-word;
            opacity: ${notification.read ? '0.6' : '1'};
            cursor: pointer;
        `;

        const icons = {
            success: 'bi-check-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            error: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };

        const iconColors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };

        const timeAgo = this.getTimeAgo(notification.timestamp);

        item.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="bi ${icons[notification.type]} me-2 mt-1" style="color: ${iconColors[notification.type]}; flex-shrink: 0;"></i>
                <div class="flex-grow-1" style="min-width: 0;">
                    <div class="fw-bold" style="color: #f8fafc; margin-bottom: 0.3rem;">${notification.title}</div>
                    <small style="color: #cbd5e1; display: block; line-height: 1.4;">${notification.message}</small>
                    <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.3rem;">${timeAgo}</div>
                </div>
            </div>
        `;

        // Add click handler
        item.addEventListener('click', () => {
            if (!notification.read) {
                this.markAsRead(notification.id);
            }
        });

        // Add hover effects
        item.addEventListener('mouseenter', function() {
            if (!notification.read) {
                this.style.background = 'rgba(124, 58, 237, 0.3)';
                this.style.transform = 'translateX(5px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!notification.read) {
                this.style.background = 'rgba(45, 27, 105, 0.2)';
                this.style.transform = '';
            }
        });

        return item;
    }

    // Show browser notification
    showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                showSuccessToast('Browser notifications enabled!');
            }
        }
    }

    // Utility functions
    getWatchlist() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return [];
        
        const watchlist = localStorage.getItem(`watchlist_${currentUser}`);
        return watchlist ? JSON.parse(watchlist) : [];
    }

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

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diffMs = now - timestamp;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    // Storage functions
    saveNotifications() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return;
        
        localStorage.setItem(`notifications_${currentUser}`, JSON.stringify(this.notifications));
    }

    loadStoredNotifications() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return;
        
        const stored = localStorage.getItem(`notifications_${currentUser}`);
        if (stored) {
            this.notifications = JSON.parse(stored);
            this.updateNotificationsUI();
        }
    }

    // Clean up old notifications (older than 7 days)
    cleanupOldNotifications() {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        this.notifications = this.notifications.filter(n => n.timestamp > sevenDaysAgo);
        this.saveNotifications();
    }
}

// Create global instance
window.priceMonitor = new PriceMonitor();

// Make functions globally available
window.startPriceMonitoring = (showNotification = false) => window.priceMonitor.startMonitoring(showNotification);
window.stopPriceMonitoring = () => window.priceMonitor.stopMonitoring();
window.getPriceNotifications = () => window.priceMonitor.getNotifications();
window.markNotificationRead = (id) => window.priceMonitor.markAsRead(id);
window.markAllNotificationsRead = () => window.priceMonitor.markAllAsRead();
window.clearAllNotifications = () => window.priceMonitor.clearAllNotifications();

console.log('Price Monitor System loaded!');
