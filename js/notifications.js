// Notifications System
// Handles notifications dropdown, modal, and user interface management

// Create notifications dropdown for logged-in users
function createNotificationsDropdown() {
    // Główny kontener dropdown powiadomień
    const notificationsContainer = document.createElement('div');
    notificationsContainer.className = 'dropdown me-3';
    notificationsContainer.id = 'notifications-dropdown';
    
    // Przycisk dzwonka
    const notificationsButton = document.createElement('button');
    notificationsButton.className = 'btn btn-outline-light dropdown-toggle position-relative';
    notificationsButton.type = 'button';
    notificationsButton.setAttribute('data-bs-toggle', 'dropdown');
    notificationsButton.setAttribute('aria-expanded', 'false');
    notificationsButton.innerHTML = `
        <i class="bi bi-bell"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="notification-count">
            3
        </span>
    `;
    
    // Menu dropdown powiadomień
    const notificationsMenu = document.createElement('ul');
    notificationsMenu.className = 'dropdown-menu dropdown-menu-end';
    notificationsMenu.style.cssText = `
        width: 380px;
        max-width: 90vw;
        background: rgba(30, 30, 63, 0.95);
        border: 2px solid rgba(124, 58, 237, 0.6);
        backdrop-filter: blur(20px);
        color: white;
        box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
    `;
    
    // Header powiadomień
    const headerItem = document.createElement('li');
    headerItem.innerHTML = `
        <h6 class="dropdown-header d-flex justify-content-between align-items-center" style="
            color: #f8fafc;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
            margin: 0;
            padding: 1rem;
            border-radius: 8px 8px 0 0;
        ">
            <span><i class="bi bi-bell me-2" style="color: #8b5cf6;"></i>Notifications</span>
            <span class="badge" id="total-notifications" style="
                background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                color: white;
            ">3</span>
        </h6>
    `;
    
    // Separator
    const separator1 = document.createElement('li');
    separator1.innerHTML = '<hr class="dropdown-divider" style="border-color: rgba(124, 58, 237, 0.3); margin: 0.5rem 0;">';
    
    // Lista powiadomień
    const notificationsList = document.createElement('li');
    notificationsList.innerHTML = `
        <div class="notification-list" style="max-height: 300px; overflow-y: auto; padding: 0.5rem;">
            <div class="dropdown-item notification-item" style="
                background: rgba(45, 27, 105, 0.2);
                border-bottom: 1px solid rgba(124, 58, 237, 0.2);
                transition: all 0.3s ease;
                color: white;
                padding: 0.8rem;
                margin-bottom: 0.5rem;
                border-radius: 8px;
                word-wrap: break-word;
            ">
                <div class="d-flex align-items-start">
                    <i class="bi bi-graph-up me-2 mt-1" style="color: #10b981; flex-shrink: 0;"></i>
                    <div class="flex-grow-1" style="min-width: 0;">
                        <div class="fw-bold" style="color: #f8fafc; margin-bottom: 0.3rem;">Bitcoin Price Alert</div>
                        <small style="color: #cbd5e1; display: block; line-height: 1.4;">BTC reached your target price of $65,000</small>
                        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.3rem;">2 minutes ago</div>
                    </div>
                </div>
            </div>
            <div class="dropdown-item notification-item" style="
                background: rgba(45, 27, 105, 0.2);
                border-bottom: 1px solid rgba(124, 58, 237, 0.2);
                transition: all 0.3s ease;
                color: white;
                padding: 0.8rem;
                margin-bottom: 0.5rem;
                border-radius: 8px;
                word-wrap: break-word;
            ">
                <div class="d-flex align-items-start">
                    <i class="bi bi-exclamation-triangle me-2 mt-1" style="color: #f59e0b; flex-shrink: 0;"></i>
                    <div class="flex-grow-1" style="min-width: 0;">
                        <div class="fw-bold" style="color: #f8fafc; margin-bottom: 0.3rem;">Ethereum Price Drop</div>
                        <small style="color: #cbd5e1; display: block; line-height: 1.4;">ETH dropped below $2,500 - Consider reviewing your alerts</small>
                        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.3rem;">1 hour ago</div>
                    </div>
                </div>
            </div>
            <div class="dropdown-item notification-item" style="
                background: rgba(45, 27, 105, 0.2);
                border-bottom: 1px solid rgba(124, 58, 237, 0.2);
                transition: all 0.3s ease;
                color: white;
                padding: 0.8rem;
                border-radius: 8px;
                word-wrap: break-word;
            ">
                <div class="d-flex align-items-start">
                    <i class="bi bi-info-circle me-2 mt-1" style="color: #3b82f6; flex-shrink: 0;"></i>
                    <div class="flex-grow-1" style="min-width: 0;">
                        <div class="fw-bold" style="color: #f8fafc; margin-bottom: 0.3rem;">Market Update</div>
                        <small style="color: #cbd5e1; display: block; line-height: 1.4;">Weekly crypto market summary is now available</small>
                        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.3rem;">3 hours ago</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Separator
    const separator2 = document.createElement('li');
    separator2.innerHTML = '<hr class="dropdown-divider" style="border-color: rgba(124, 58, 237, 0.3); margin: 0.5rem 0;">';
    
    // Opcje zarządzania powiadomieniami
    const actionsItem = document.createElement('li');
    actionsItem.innerHTML = `
        <div class="dropdown-item-text d-flex justify-content-between" style="
            background: rgba(15, 15, 35, 0.8);
            padding: 1rem;
            margin: 0;
            border-radius: 0 0 8px 8px;
            gap: 0.8rem;
        ">
            <button class="btn btn-sm flex-fill" id="view-all-notifications" style="
                background: rgba(124, 58, 237, 0.2);
                border: 2px solid rgba(124, 58, 237, 0.6);
                color: #c4b5fd;
                transition: all 0.3s ease;
                font-size: 0.85rem;
                white-space: nowrap;
            ">
                <i class="bi bi-list me-1"></i>View All
            </button>
            <button class="btn btn-sm flex-fill" id="mark-all-read" style="
                background: rgba(59, 130, 246, 0.2);
                border: 2px solid rgba(59, 130, 246, 0.6);
                color: #93c5fd;
                transition: all 0.3s ease;
                font-size: 0.85rem;
                white-space: nowrap;
            ">
                <i class="bi bi-check2-all me-1"></i>Mark All Read
            </button>
        </div>
    `;
    
    // Dodaj wszystkie elementy do menu
    notificationsMenu.appendChild(headerItem);
    notificationsMenu.appendChild(separator1);
    notificationsMenu.appendChild(notificationsList);
    notificationsMenu.appendChild(separator2);
    notificationsMenu.appendChild(actionsItem);
    
    // Dodaj przycisk i menu do kontenera
    notificationsContainer.appendChild(notificationsButton);
    notificationsContainer.appendChild(notificationsMenu);
    
    // Dodaj event listenery dla powiadomień
    addNotificationsEventListeners();
    
    return notificationsContainer;
}

// Add event listeners for notifications dropdown
function addNotificationsEventListeners() {
    // Dodaj event listenery po krótkim opóźnieniu, żeby elementy były już w DOM
    setTimeout(() => {
        const viewAllBtn = document.getElementById('view-all-notifications');
        const markAllReadBtn = document.getElementById('mark-all-read');
        const notificationItems = document.querySelectorAll('.notification-item');
        
        if (viewAllBtn) {
            // Dodaj hover effect do przycisku View All
            viewAllBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(124, 58, 237, 0.4)';
                this.style.borderColor = '#8b5cf6';
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 5px 15px rgba(124, 58, 237, 0.3)';
            });
            
            viewAllBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(124, 58, 237, 0.2)';
                this.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            viewAllBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('View all notifications clicked');
                showAllNotificationsModal();
            });
        }
        
        if (markAllReadBtn) {
            // Dodaj hover effect do przycisku Mark All Read  
            markAllReadBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(59, 130, 246, 0.4)';
                this.style.borderColor = '#3b82f6';
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 5px 15px rgba(59, 130, 246, 0.3)';
            });
            
            markAllReadBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(59, 130, 246, 0.2)';
                this.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            markAllReadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Mark all read clicked');
                
                // Ukryj badge z liczbą powiadomień
                const notificationCount = document.getElementById('notification-count');
                const totalNotifications = document.getElementById('total-notifications');
                
                if (notificationCount) notificationCount.style.display = 'none';
                if (totalNotifications) totalNotifications.textContent = '0';
                
                // Dodaj efekt "przeczytane" do wszystkich powiadomień
                notificationItems.forEach(item => {
                    item.style.opacity = '0.6';
                    item.style.background = 'rgba(124, 58, 237, 0.1)';
                });
                
                showSuccessToast('All notifications marked as read!');
            });
        }
        
        // Dodaj klik listener do każdego powiadomienia
        notificationItems.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`Notification ${index + 1} clicked`);
                
                // Oznacz jako przeczytane
                this.style.opacity = '0.6';
                this.style.background = 'rgba(124, 58, 237, 0.1)';
                
                // Zmniejsz licznik
                updateNotificationCount(-1);
                
                showInfoToast('Notification opened');
            });
            
            // Dodaj hover effect
            item.addEventListener('mouseenter', function() {
                if (this.style.opacity !== '0.6') {
                    this.style.background = 'rgba(124, 58, 237, 0.3)';
                    this.style.transform = 'translateX(5px)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (this.style.opacity !== '0.6') {
                    this.style.background = 'rgba(45, 27, 105, 0.2)';
                    this.style.transform = '';
                }
            });
        });
    }, 100);
}

// Update notification count
function updateNotificationCount(change) {
    const notificationCount = document.getElementById('notification-count');
    const totalNotifications = document.getElementById('total-notifications');
    
    if (notificationCount && totalNotifications) {
        let currentCount = parseInt(totalNotifications.textContent) || 0;
        currentCount = Math.max(0, currentCount + change);
        
        totalNotifications.textContent = currentCount;
        
        if (currentCount === 0) {
            notificationCount.style.display = 'none';
        } else {
            notificationCount.style.display = 'inline';
            notificationCount.textContent = currentCount;
        }
    }
}

// Show all notifications modal
function showAllNotificationsModal() {
    // Sprawdź czy modal już istnieje i go usuń
    const existingModal = document.getElementById('notifications-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Utwórz modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'notifications-modal-container';
    modalContainer.id = 'notifications-modal';
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 15, 35, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Utwórz modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'notifications-modal-content';
    modalContent.style.cssText = `
        background: rgba(30, 30, 63, 0.95);
        border: 2px solid rgba(124, 58, 237, 0.6);
        backdrop-filter: blur(20px);
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        position: relative;
        box-shadow: 0 20px 40px rgba(124, 58, 237, 0.3), 0 0 30px rgba(139, 92, 246, 0.2);
        transform: translateY(30px);
        transition: transform 0.3s ease;
        color: white;
    `;
    
    // Header modala
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        padding: 1.5rem;
        border-bottom: 1px solid rgba(124, 58, 237, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9));
        color: white;
        border-radius: 15px 15px 0 0;
        backdrop-filter: blur(10px);
    `;
    modalHeader.innerHTML = `
        <h4 class="mb-0"><i class="bi bi-bell me-2"></i>All Notifications</h4>
        <button type="button" class="btn-close btn-close-white ms-auto" id="close-notifications-modal" aria-label="Close"></button>
    `;
    
    // Body modala z przewijalnymi powiadomieniami
    const modalBody = document.createElement('div');
    modalBody.style.cssText = `
        padding: 0;
        max-height: 60vh;
        overflow-y: auto;
    `;
    
    // Lista wszystkich powiadomień
    modalBody.innerHTML = `
        <div class="notification-item-modal" style="
            padding: 1.2rem; 
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-graph-up me-3 mt-1" style="font-size: 1.2rem; color: #10b981;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">Bitcoin Price Alert</div>
                    <p class="mb-1" style="color: #cbd5e1;">BTC reached your target price of $65,000. This is a great opportunity to review your trading strategy.</p>
                    <small style="color: #94a3b8;">2 minutes ago</small>
                </div>
            </div>
        </div>
        <div class="notification-item-modal" style="
            padding: 1.2rem; 
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-exclamation-triangle me-3 mt-1" style="font-size: 1.2rem; color: #f59e0b;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">Ethereum Price Drop</div>
                    <p class="mb-1" style="color: #cbd5e1;">ETH dropped below $2,500. Consider reviewing your alerts and possibly adjusting your price targets.</p>
                    <small style="color: #94a3b8;">1 hour ago</small>
                </div>
            </div>
        </div>
        <div class="notification-item-modal" style="
            padding: 1.2rem; 
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-info-circle me-3 mt-1" style="font-size: 1.2rem; color: #3b82f6;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">Market Update</div>
                    <p class="mb-1" style="color: #cbd5e1;">Weekly crypto market summary is now available. Check out the latest trends and analysis.</p>
                    <small style="color: #94a3b8;">3 hours ago</small>
                </div>
            </div>
        </div>
        <div class="notification-item-modal" style="
            padding: 1.2rem; 
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-bell me-3 mt-1" style="font-size: 1.2rem; color: #8b5cf6;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">New Alert Created</div>
                    <p class="mb-1" style="color: #cbd5e1;">Successfully created price alert for Solana (SOL) at $150.</p>
                    <small style="color: #94a3b8;">5 hours ago</small>
                </div>
            </div>
        </div>
        <div class="notification-item-modal" style="
            padding: 1.2rem; 
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-graph-down me-3 mt-1" style="font-size: 1.2rem; color: #ef4444;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">Cardano Price Alert</div>
                    <p class="mb-1" style="color: #cbd5e1;">ADA has dropped 15% in the last 24 hours. Current price: $0.45</p>
                    <small style="color: #94a3b8;">8 hours ago</small>
                </div>
            </div>
        </div>
        <div class="notification-item-modal" style="
            padding: 1.2rem; 
            border-bottom: 1px solid rgba(124, 58, 237, 0.2);
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-lightning me-3 mt-1" style="font-size: 1.2rem; color: #f59e0b;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">Quick Price Movement</div>
                    <p class="mb-1" style="color: #cbd5e1;">Dogecoin (DOGE) is experiencing high volatility. Price changed by 8% in the last hour.</p>
                    <small style="color: #94a3b8;">12 hours ago</small>
                </div>
            </div>
        </div>
        <div class="notification-item-modal" style="
            padding: 1.2rem;
            transition: all 0.3s ease;
            background: rgba(45, 27, 105, 0.3);
        ">
            <div class="d-flex align-items-start">
                <i class="bi bi-check-circle me-3 mt-1" style="font-size: 1.2rem; color: #10b981;"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold" style="color: #f8fafc;">Welcome to CryptoTracker!</div>
                    <p class="mb-1" style="color: #cbd5e1;">Your account has been successfully verified. You can now set up price alerts and track your favorite cryptocurrencies.</p>
                    <small style="color: #94a3b8;">1 day ago</small>
                </div>
            </div>
        </div>
    `;
    
    // Footer modala
    const modalFooter = document.createElement('div');
    modalFooter.style.cssText = `
        padding: 1rem 1.5rem;
        border-top: 1px solid rgba(124, 58, 237, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(15, 15, 35, 0.9);
        border-radius: 0 0 15px 15px;
        backdrop-filter: blur(10px);
    `;
    modalFooter.innerHTML = `
        <small style="color: #9ca3af;">Showing all notifications</small>
        <div>
            <button class="btn btn-sm btn-outline-secondary me-2" id="mark-all-read-modal" style="
                background: rgba(124, 58, 237, 0.1);
                border: 2px solid rgba(124, 58, 237, 0.6);
                backdrop-filter: blur(10px);
                color: #c4b5fd;
                transition: all 0.3s ease;
            ">
                <i class="bi bi-check2-all me-1"></i>Mark All Read
            </button>
            <button class="btn btn-sm btn-primary" id="close-notifications-modal-btn" style="
                background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                border: none;
                transition: all 0.3s ease;
                color: white;
            ">
                <i class="bi bi-x-lg me-1"></i>Close
            </button>
        </div>
    `;
    
    // Składaj modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalContainer.appendChild(modalContent);
    
    // Dodaj do body
    document.body.appendChild(modalContainer);
    document.body.style.overflow = 'hidden';
    
    // Animacja pojawienia się
    setTimeout(() => {
        modalContainer.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Event listenery
    const closeBtn = document.getElementById('close-notifications-modal');
    const closeBtnFooter = document.getElementById('close-notifications-modal-btn');
    const markAllReadModalBtn = document.getElementById('mark-all-read-modal');
    
    function closeModal() {
        modalContainer.style.opacity = '0';
        modalContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            modalContainer.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeModal);
    
    if (markAllReadModalBtn) {
        // Dodaj hover effect do przycisku Mark All Read
        markAllReadModalBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(124, 58, 237, 0.3)';
            this.style.borderColor = '#8b5cf6';
            this.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.5)';
            this.style.transform = 'translateY(-2px)';
        });
        
        markAllReadModalBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(124, 58, 237, 0.1)';
            this.style.borderColor = 'rgba(124, 58, 237, 0.6)';
            this.style.boxShadow = '';
            this.style.transform = '';
        });
        
        markAllReadModalBtn.addEventListener('click', function() {
            // Oznacz wszystkie jako przeczytane
            const modalItems = document.querySelectorAll('.notification-item-modal');
            modalItems.forEach(item => {
                item.style.opacity = '0.6';
                item.style.background = 'rgba(124, 58, 237, 0.1)';
                item.style.borderLeft = '4px solid rgba(124, 58, 237, 0.5)';
            });
            
            // Aktualizuj liczniki w dropdown
            const notificationCount = document.getElementById('notification-count');
            const totalNotifications = document.getElementById('total-notifications');
            if (notificationCount) notificationCount.style.display = 'none';
            if (totalNotifications) totalNotifications.textContent = '0';
            
            showSuccessToast('All notifications marked as read!');
        });
    }
    
    // Dodaj hover effect do przycisku Close
    if (closeBtnFooter) {
        closeBtnFooter.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #7c3aed, #2563eb)';
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 5px 15px rgba(124, 58, 237, 0.4)';
        });
        
        closeBtnFooter.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Zamknij po kliknięciu na tło
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    // Zamknij po ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Dodaj hover effects do powiadomień
    const modalItems = document.querySelectorAll('.notification-item-modal');
    modalItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.style.transition = 'all 0.3s ease';
        
        item.addEventListener('mouseenter', function() {
            if (this.style.opacity !== '0.6') {
                this.style.background = 'rgba(124, 58, 237, 0.2)';
                this.style.borderLeft = '4px solid #8b5cf6';
                this.style.transform = 'translateX(5px)';
                this.style.boxShadow = '0 5px 15px rgba(124, 58, 237, 0.3)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (this.style.opacity !== '0.6') {
                this.style.background = 'rgba(45, 27, 105, 0.3)';
                this.style.borderLeft = '';
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        item.addEventListener('click', function() {
            this.style.opacity = '0.6';
            this.style.background = 'rgba(124, 58, 237, 0.1)';
            this.style.borderLeft = '4px solid rgba(124, 58, 237, 0.5)';
            showInfoToast('Notification marked as read');
        });
    });
}

// Make functions globally available
window.createNotificationsDropdown = createNotificationsDropdown;
window.showAllNotificationsModal = showAllNotificationsModal;
window.updateNotificationCount = updateNotificationCount;
