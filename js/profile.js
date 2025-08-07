// Profile Management System
// Handles profile-specific functionality and user data management

// Initialize profile page
function initializeProfile() {
    console.log('Initializing profile page...');
    
    // Sprawdź czy użytkownik jest zalogowany
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn !== 'true' || !currentUser) {
        // Jeśli nie jest zalogowany, przekieruj na główną stronę
        showErrorToast('Please log in to access your profile');
        window.location.href = 'index.html';
        return;
    }
    
    // Ustaw dane użytkownika na stronie profilu
    updateProfileData(currentUser);
    
    // Initialize reset password button
    initializeResetPasswordButton();
    
    // Load watchlist data
    loadWatchlistData();
    
    // Setup watchlist refresh button
    setupWatchlistRefresh();
    
    console.log('Profile page initialized for user:', currentUser);
}

// Update profile data on the page
function updateProfileData(username) {
    // Aktualizuj nazwę użytkownika w profilu
    const usernameElements = document.querySelectorAll('.username-display');
    usernameElements.forEach(element => {
        element.textContent = username;
    });
    
    // Ustaw dodatkowe dane użytkownika (można rozszerzyć o prawdziwe dane z API)
    const profileData = getProfileData(username);
    updateProfileElements(profileData);
}

// Get profile data (mock data - in real app would come from API)
function getProfileData(username) {
    return {
        username: username,
        email: `${username}@example.com`,
        joinDate: '2024-01-15',
        totalAlerts: 12,
        activeAlerts: 8,
        favoriteCoins: ['Bitcoin', 'Ethereum', 'Cardano'],
        portfolioValue: '$45,230.50',
        lastLogin: new Date().toLocaleDateString()
    };
}

// Update profile elements with user data
function updateProfileElements(profileData) {
    // Aktualizuj elementy profilu jeśli istnieją
    const emailElement = document.getElementById('user-email');
    if (emailElement) emailElement.textContent = profileData.email;
    
    // Aktualizuj email w headerze
    const profileEmailElement = document.getElementById('profile-email');
    if (profileEmailElement) profileEmailElement.textContent = profileData.email;
    
    // Aktualizuj username w headerze
    const profileUsernameElement = document.getElementById('profile-username');
    if (profileUsernameElement) profileUsernameElement.textContent = profileData.username;
    
    // Aktualizuj bio w headerze
    const profileBioElement = document.getElementById('profile-bio');
    if (profileBioElement) {
        const savedProfile = localStorage.getItem(`profile_${profileData.username}`);
        let bioText = 'No bio available';
        
        if (savedProfile) {
            const profileSettings = JSON.parse(savedProfile);
            bioText = profileSettings.bio || 'No bio available';
        }
        
        profileBioElement.textContent = bioText;
    }
    
    const joinDateElement = document.getElementById('join-date');
    if (joinDateElement) joinDateElement.textContent = profileData.joinDate;
    
    const totalAlertsElement = document.getElementById('total-alerts');
    if (totalAlertsElement) totalAlertsElement.textContent = profileData.totalAlerts;
    
    const activeAlertsElement = document.getElementById('active-alerts');
    if (activeAlertsElement) activeAlertsElement.textContent = profileData.activeAlerts;
    
    const portfolioValueElement = document.getElementById('portfolio-value');
    if (portfolioValueElement) portfolioValueElement.textContent = profileData.portfolioValue;
    
    const lastLoginElement = document.getElementById('last-login');
    if (lastLoginElement) lastLoginElement.textContent = profileData.lastLogin;
    
    // Aktualizuj listę ulubionych monet
    updateFavoriteCoins(profileData.favoriteCoins);
}

// Update favorite coins display
function updateFavoriteCoins(coins) {
    const favoriteCoinsList = document.getElementById('favorite-coins-list');
    if (favoriteCoinsList) {
        favoriteCoinsList.innerHTML = '';
        
        coins.forEach(coin => {
            const coinElement = document.createElement('span');
            coinElement.className = 'badge me-1 mb-1';
            coinElement.style.cssText = `
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
                border: 1px solid rgba(124, 58, 237, 0.4);
                color: #c4b5fd;
                font-size: 0.8rem;
                padding: 0.5rem 0.8rem;
                backdrop-filter: blur(10px);
            `;
            coinElement.textContent = coin;
            favoriteCoinsList.appendChild(coinElement);
        });
    }
}

// Save profile changes
function saveProfileChanges() {
    // Zbierz dane z formularza profilu
    const email = document.getElementById('profile-email')?.value;
    const bio = document.getElementById('profile-bio')?.value;
    const notifications = document.getElementById('email-notifications')?.checked;
    
    // W prawdziwej aplikacji wysłałbyś to do API
    const profileUpdates = {
        email: email,
        bio: bio,
        notifications: notifications,
        updatedAt: new Date().toISOString()
    };
    
    // Zapisz w localStorage jako przykład
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profileUpdates));
        showSuccessToast('Profile updated successfully!');
    } else {
        showErrorToast('Error saving profile changes');
    }
}

// Load profile settings
function loadProfileSettings() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const savedProfile = localStorage.getItem(`profile_${currentUser}`);
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            
            // Załaduj zapisane dane do formularza
            const emailInput = document.getElementById('profile-email');
            if (emailInput) emailInput.value = profileData.email || '';
            
            const bioInput = document.getElementById('profile-bio');
            if (bioInput) bioInput.value = profileData.bio || '';
            
            const notificationsInput = document.getElementById('email-notifications');
            if (notificationsInput) notificationsInput.checked = profileData.notifications || false;
        }
    }
}

// Delete user account (confirmation required)
function deleteAccount() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showErrorToast('No user logged in');
        return;
    }
    
    // Pokaż potwierdzenie
    if (confirm(`Are you sure you want to delete your account "${currentUser}"? This action cannot be undone.`)) {
        // Usuń dane użytkownika
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem(`profile_${currentUser}`);
        
        showSuccessToast('Account deleted successfully');
        
        // Przekieruj na główną stronę
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Change password functionality
function changePassword() {
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showErrorToast('Please fill all password fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showErrorToast('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        showErrorToast('Password must be at least 6 characters long');
        return;
    }
    
    // W prawdziwej aplikacji sprawdziłbyś obecne hasło przez API
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Symulacja zmiany hasła
        showSuccessToast('Password changed successfully!');
        
        // Wyczyść pola
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }
}

// Export user data
function exportUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showErrorToast('No user logged in');
        return;
    }
    
    // Zbierz wszystkie dane użytkownika
    const userData = {
        username: currentUser,
        profile: JSON.parse(localStorage.getItem(`profile_${currentUser}`) || '{}'),
        exportDate: new Date().toISOString(),
        alerts: JSON.parse(localStorage.getItem(`alerts_${currentUser}`) || '[]'),
        settings: JSON.parse(localStorage.getItem(`settings_${currentUser}`) || '{}')
    };
    
    // Utwórz plik do pobrania
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Utwórz link do pobrania
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `cryptotracker_data_${currentUser}_${new Date().toISOString().split('T')[0]}.json`;
    downloadLink.click();
    
    // Wyczyść URL
    URL.revokeObjectURL(url);
    
    showSuccessToast('User data exported successfully!');
}

function showEditProfileModal() {
    const editProfileModal = document.querySelector('.edit-profile-container');
    if (editProfileModal) {
        editProfileModal.classList.remove('hide');
        editProfileModal.classList.add('show');
        editProfileModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Załaduj aktualne dane profilu do modalu
        loadCurrentProfileData();
        
        // Dodaj event listenery
        setupEditModalListeners();
    }
}

// Load current profile data into edit modal
function loadCurrentProfileData() {
    const currentUser = localStorage.getItem('currentUser');
    const userEmail = localStorage.getItem('userEmail') || `${currentUser}@example.com`;
    
    // Wypełnij pola formularza
    const usernameInput = document.getElementById('edit-username');
    const emailInput = document.getElementById('edit-email');
    const bioInput = document.getElementById('edit-bio');
    
    if (usernameInput) usernameInput.value = currentUser || '';
    if (emailInput) emailInput.value = userEmail;
    if (bioInput) {
        const savedProfile = localStorage.getItem(`profile_${currentUser}`);
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            bioInput.value = profileData.bio || '';
        }
    }
}

// Setup modal event listeners
function setupEditModalListeners() {
    const modal = document.querySelector('.edit-profile-container');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const saveBtn = modal.querySelector('.btn-save');
    const form = modal.querySelector('.edit-profile-form');
    
    // Close modal function
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hide')) {
            closeModal();
        }
    });
    
    // Form submission
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            saveEditProfileChanges();
            closeModal();
        };
    }
}

// Save edit profile changes
function saveEditProfileChanges() {
    const currentUser = localStorage.getItem('currentUser');
    const newUsername = document.getElementById('edit-username').value;
    const newEmail = document.getElementById('edit-email').value;
    const newBio = document.getElementById('edit-bio').value;
    
    if (!newUsername || !newEmail) {
        showErrorToast('Username and email are required');
        return;
    }
    
    // Save to localStorage (w prawdziwej aplikacji byłoby to API call)
    const profileUpdates = {
        username: newUsername,
        email: newEmail,
        bio: newBio,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profileUpdates));
    localStorage.setItem('userEmail', newEmail);
    
    // Jeśli zmieniono username, zaktualizuj go
    if (newUsername !== currentUser) {
        localStorage.setItem('currentUser', newUsername);
        // Przenieś profile data do nowego klucza
        localStorage.setItem(`profile_${newUsername}`, JSON.stringify(profileUpdates));
        localStorage.removeItem(`profile_${currentUser}`);
    }
    
    // Odśwież dane na stronie
    updateProfileData(newUsername);
    
    // Aktualizuj bio w headerze bezpośrednio
    const profileBioElement = document.getElementById('profile-bio');
    if (profileBioElement) {
        profileBioElement.textContent = newBio || 'No bio available';
    }
    
    showSuccessToast('Profile updated successfully!');
}

// Reset Password Modal Functions
function showResetPasswordModal() {
    const resetPasswordModal = document.querySelector('.reset-password-container');
    if (resetPasswordModal) {
        resetPasswordModal.classList.remove('hide');
        resetPasswordModal.classList.add('show');
        resetPasswordModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Clear form fields
        clearResetPasswordForm();
        
        // Setup event listeners
        setupResetPasswordModalListeners();
    }
}

// Clear reset password form
function clearResetPasswordForm() {
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (oldPasswordInput) oldPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
    
    // Remove any existing password strength indicators
    const existingStrengthIndicator = document.querySelector('.password-strength');
    if (existingStrengthIndicator) {
        existingStrengthIndicator.remove();
    }
}

// Setup reset password modal event listeners
function setupResetPasswordModalListeners() {
    const modal = document.querySelector('.reset-password-container');
    if (!modal) {
        console.error('Reset password modal not found');
        return;
    }
    
    // Check if listeners are already set up to avoid duplicates
    if (modal.hasAttribute('data-listeners-set')) {
        return;
    }
    
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const form = modal.querySelector('.reset-password-form');
    const newPasswordInput = document.getElementById('new-password');
    
    console.log('Setting up reset password modal listeners:', {
        modal: !!modal,
        closeBtn: !!closeBtn,
        cancelBtn: !!cancelBtn,
        form: !!form,
        newPasswordInput: !!newPasswordInput
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearResetPasswordForm();
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
    
    // ESC key to close
    const escapeHandler = function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hide')) {
            closeModal();
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Password strength indicator
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Reset password form submitted');
            handleResetPassword();
        });
    } else {
        console.error('Reset password form not found');
    }
    
    // Mark listeners as set up
    modal.setAttribute('data-listeners-set', 'true');
}

// Check password strength
function checkPasswordStrength(password) {
    const newPasswordInput = document.getElementById('new-password');
    let existingIndicator = document.querySelector('.password-strength');
    
    // Remove existing indicator
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (password.length === 0) return;
    
    // Create strength indicator
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    
    let strength = 0;
    let message = '';
    
    // Check password criteria
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
        strengthIndicator.classList.add('weak');
        message = '⚠️ Weak password - add more characters, numbers, or symbols';
    } else if (strength < 5) {
        strengthIndicator.classList.add('medium');
        message = '⚡ Medium password - consider adding special characters';
    } else {
        strengthIndicator.classList.add('strong');
        message = '✅ Strong password';
    }
    
    strengthIndicator.textContent = message;
    newPasswordInput.parentNode.appendChild(strengthIndicator);
}

// Handle reset password
function handleResetPassword() {
    console.log('handleResetPassword called');
    
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    console.log('Password fields:', {
        oldPassword: oldPassword ? 'filled' : 'empty',
        newPassword: newPassword ? 'filled' : 'empty',
        confirmPassword: confirmPassword ? 'filled' : 'empty'
    });
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
        showErrorToast('Please fill all password fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showErrorToast('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        showErrorToast('Password must be at least 6 characters long');
        return;
    }
    
    if (oldPassword === newPassword) {
        showErrorToast('New password must be different from old password');
        return;
    }
    
    // Get user email
    const userEmail = localStorage.getItem('userEmail');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!userEmail || !currentUser) {
        showErrorToast('User session not found. Please log in again.');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.reset-password-form .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Changing Password...';
    submitBtn.disabled = true;
    
    // Call API to change password
    fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: userEmail,
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            const modal = document.querySelector('.reset-password-container');
            modal.classList.add('hide');
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            showSuccessToast('Password changed successfully!');
            clearResetPasswordForm();
        } else {
            showErrorToast(data.message || 'Error changing password');
        }
    })
    .catch(error => {
        console.error('Password change error:', error);
        showErrorToast('Network error. Please check your connection and try again.');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Add click handler for reset password button
function initializeResetPasswordButton() {
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', showResetPasswordModal);
    }
}

// Make functions globally available
window.initializeProfile = initializeProfile;
window.saveProfileChanges = saveProfileChanges;
window.loadProfileSettings = loadProfileSettings;
window.deleteAccount = deleteAccount;
window.changePassword = changePassword;
window.exportUserData = exportUserData;
window.showEditProfileModal = showEditProfileModal;
window.showResetPasswordModal = showResetPasswordModal;
window.handleResetPassword = handleResetPassword;
window.removeFromWatchlist = removeFromWatchlist;
window.editPriceAlert = editPriceAlert;

// Watchlist Management Functions
function loadWatchlistData() {
    console.log('Loading watchlist data...');
    showWatchlistLoading();
    
    const watchlist = getWatchlist();
    
    if (watchlist.length === 0) {
        showEmptyWatchlist();
        updateWatchlistStats(0, 0);
        return;
    }
    
    // Get current prices for watchlist items
    loadWatchlistPrices(watchlist);
}

function getWatchlist() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return [];
    
    const watchlist = localStorage.getItem(`watchlist_${currentUser}`);
    return watchlist ? JSON.parse(watchlist) : [];
}

function saveWatchlist(watchlist) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    localStorage.setItem(`watchlist_${currentUser}`, JSON.stringify(watchlist));
}

async function loadWatchlistPrices(watchlist) {
    try {
        // Create comma-separated list of crypto IDs
        const cryptoIds = watchlist.map(item => item.id).join(',');
        
        // Fetch current prices from CoinGecko
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }
        
        const priceData = await response.json();
        
        // Merge price data with watchlist
        const enrichedWatchlist = watchlist.map(item => ({
            ...item,
            currentPrice: priceData[item.id]?.usd || 0,
            priceChange24h: priceData[item.id]?.usd_24h_change || 0
        }));
        
        displayWatchlist(enrichedWatchlist);
        updateWatchlistStats(enrichedWatchlist.length, countActiveAlerts(enrichedWatchlist));
        
    } catch (error) {
        console.error('Error loading watchlist prices:', error);
        showWatchlistError();
    }
}

function displayWatchlist(watchlist) {
    const container = document.getElementById('watchlist-grid');
    const loading = document.getElementById('watchlist-loading');
    const empty = document.getElementById('empty-watchlist');
    
    if (loading) loading.classList.add('d-none');
    if (empty) empty.classList.add('d-none');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    watchlist.forEach(item => {
        const card = createWatchlistCard(item);
        container.appendChild(card);
    });
}

function createWatchlistCard(item) {
    const card = document.createElement('div');
    card.className = 'watchlist-item';
    
    const changeClass = item.priceChange24h >= 0 ? 'positive' : 'negative';
    const changeIcon = item.priceChange24h >= 0 ? '▲' : '▼';
    
    // Calculate performance since added
    const addedPrice = item.addedPrice || item.currentPrice;
    const performancePercent = ((item.currentPrice - addedPrice) / addedPrice) * 100;
    const performanceClass = performancePercent > 0 ? 'profit' : performancePercent < 0 ? 'loss' : 'neutral';
    const performanceText = performancePercent > 0 ? `+${performancePercent.toFixed(2)}%` : `${performancePercent.toFixed(2)}%`;
    
    // Price alert info
    const hasAlert = item.priceAlert;
    const alertClass = hasAlert ? '' : 'no-alert';
    const alertText = hasAlert 
        ? `Alert: ${item.alertType} $${formatNumber(item.priceAlert)}`
        : 'No price alert set';
    
    // Format added date
    const addedDate = new Date(item.addedDate).toLocaleDateString();
    
    card.innerHTML = `
        <div class="watchlist-crypto-header">
            <img src="${item.image}" alt="${item.name}" class="watchlist-crypto-logo" loading="lazy">
            <div class="watchlist-crypto-info">
                <h5>${item.name}</h5>
                <p class="crypto-symbol">${item.symbol}</p>
            </div>
        </div>
        
        <div class="watchlist-price-info">
            <div class="current-price">$${formatNumber(item.currentPrice)}</div>
            <div class="price-change ${changeClass}">
                ${changeIcon} ${item.priceChange24h.toFixed(2)}%
            </div>
        </div>
        
        <div class="watchlist-stats">
            <div class="watchlist-stat">
                <span class="label">Added</span>
                <span class="value">${addedDate}</span>
            </div>
            <div class="watchlist-stat">
                <span class="label">Added at</span>
                <span class="value">$${formatNumber(addedPrice)}</span>
            </div>
        </div>
        
        <div class="performance-indicator">
            <span class="performance-badge ${performanceClass}">
                ${performanceText} since added
            </span>
        </div>
        
        <div class="price-alert-info ${alertClass}">
            <p class="alert-text ${alertClass}">
                <i class="bi ${hasAlert ? 'bi-bell-fill' : 'bi-bell'} me-1"></i>
                ${alertText}
            </p>
        </div>
        
        <div class="watchlist-actions">
            <button class="btn-edit-alert" onclick="editPriceAlert('${item.id}', '${item.name}', ${item.currentPrice})">
                <i class="bi bi-bell me-1"></i>Alert
            </button>
            <button class="btn-remove" onclick="removeFromWatchlist('${item.id}', '${item.name}')">
                <i class="bi bi-trash me-1"></i>Remove
            </button>
        </div>
    `;
    
    return card;
}

function countActiveAlerts(watchlist) {
    return watchlist.filter(item => item.priceAlert).length;
}

function updateWatchlistStats(trackedCount, alertsCount) {
    // Update tracked cryptos count
    const trackedElement = document.getElementById('tracked-cryptos-count');
    if (trackedElement) trackedElement.textContent = trackedCount;
    
    // Update total alerts count
    const totalAlertsElement = document.getElementById('total-alerts');
    if (totalAlertsElement) totalAlertsElement.textContent = alertsCount;
    
    // Update active alerts badge
    const activeAlertsElement = document.getElementById('active-alerts');
    if (activeAlertsElement) activeAlertsElement.textContent = alertsCount;
    
    // Update watchlist count in quick stats
    const watchlistCountElement = document.getElementById('watchlist-count');
    if (watchlistCountElement) watchlistCountElement.textContent = trackedCount;
}

function showWatchlistLoading() {
    const loading = document.getElementById('watchlist-loading');
    const grid = document.getElementById('watchlist-grid');
    const empty = document.getElementById('empty-watchlist');
    
    if (loading) loading.classList.remove('d-none');
    if (grid) grid.innerHTML = '';
    if (empty) empty.classList.add('d-none');
}

function showEmptyWatchlist() {
    const loading = document.getElementById('watchlist-loading');
    const grid = document.getElementById('watchlist-grid');
    const empty = document.getElementById('empty-watchlist');
    
    if (loading) loading.classList.add('d-none');
    if (grid) grid.innerHTML = '';
    if (empty) empty.classList.remove('d-none');
}

function showWatchlistError() {
    const container = document.getElementById('watchlist-grid');
    const loading = document.getElementById('watchlist-loading');
    
    if (loading) loading.classList.add('d-none');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Failed to load watchlist data. Please try refreshing.
            </div>
        `;
    }
}

function setupWatchlistRefresh() {
    const refreshBtn = document.getElementById('refresh-watchlist');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i>Refreshing...';
            this.disabled = true;
            
            loadWatchlistData();
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showSuccessToast('Watchlist refreshed');
            }, 1000);
        });
    }
}

function removeFromWatchlist(cryptoId, cryptoName) {
    if (confirm(`Remove ${cryptoName} from your watchlist?`)) {
        const watchlist = getWatchlist();
        const filteredWatchlist = watchlist.filter(item => item.id !== cryptoId);
        saveWatchlist(filteredWatchlist);
        
        // Add notification about removal
        if (window.priceMonitor) {
            window.priceMonitor.addNotification({
                type: 'info',
                title: 'Removed from Watchlist',
                message: `${cryptoName} has been removed from your watchlist.`,
                cryptoId: cryptoId,
                cryptoName: cryptoName,
                timestamp: Date.now(),
                read: false
            });
        }
        
        showSuccessToast(`${cryptoName} removed from watchlist`);
        loadWatchlistData(); // Refresh display
    }
}

function editPriceAlert(cryptoId, cryptoName, currentPrice) {
    // Show custom modal instead of browser prompt
    showPriceAlertModal(cryptoId, cryptoName, currentPrice);
}

// Utility function: Format number (reuse from crypto.js logic)
function formatNumber(num) {
    if (!num) return '0';
    
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

// Price Alert Modal Functions
function showPriceAlertModal(cryptoId, cryptoName, currentPrice) {
    const modal = document.querySelector('.price-alert-container');
    const form = modal.querySelector('.price-alert-form');
    
    // Populate modal with crypto data
    document.getElementById('alert-crypto-name').textContent = cryptoName;
    document.getElementById('alert-crypto-symbol').textContent = cryptoId.toUpperCase();
    document.getElementById('alert-crypto-price').textContent = formatNumber(currentPrice);
    
    // Set crypto logo (try to get from existing data or use placeholder)
    const logoElement = document.getElementById('alert-crypto-logo');
    const existingCryptoCard = document.querySelector(`[data-crypto-id="${cryptoId}"]`);
    if (existingCryptoCard) {
        const existingLogo = existingCryptoCard.querySelector('.crypto-logo');
        if (existingLogo) {
            logoElement.src = existingLogo.src;
            logoElement.alt = cryptoName;
        }
    } else {
        // Fallback to CoinGecko logo URL pattern
        logoElement.src = `https://assets.coingecko.com/coins/images/1/small/${cryptoId}.png`;
        logoElement.alt = cryptoName;
    }
    
    // Clear previous form data
    document.getElementById('alert-target-price').value = '';
    document.getElementById('alert-direction').value = 'above';
    
    // Auto-update alert direction based on target price
    const targetPriceInput = document.getElementById('alert-target-price');
    const alertDirectionSelect = document.getElementById('alert-direction');
    
    targetPriceInput.addEventListener('input', () => {
        const inputPrice = parseFloat(targetPriceInput.value);
        if (!isNaN(inputPrice)) {
            alertDirectionSelect.value = inputPrice > currentPrice ? 'above' : 'below';
        }
    });
    
    // Show modal
    modal.classList.remove('hide');
    modal.classList.add('show');
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const targetPrice = parseFloat(document.getElementById('alert-target-price').value);
        const alertType = document.getElementById('alert-direction').value;
        
        if (isNaN(targetPrice) || targetPrice <= 0) {
            showErrorToast('Please enter a valid price');
            return;
        }
        
        // Update watchlist item
        const watchlist = getWatchlist();
        const itemIndex = watchlist.findIndex(item => item.id === cryptoId);
        
        if (itemIndex !== -1) {
            watchlist[itemIndex].priceAlert = targetPrice;
            watchlist[itemIndex].alertType = alertType;
            saveWatchlist(watchlist);
            
            // Add notification about alert update
            if (window.priceMonitor) {
                window.priceMonitor.addNotification({
                    type: 'info',
                    title: 'Price Alert Updated',
                    message: `Price alert for ${cryptoName} has been set to $${formatNumber(targetPrice)} (${alertType} current price).`,
                    cryptoId: cryptoId,
                    cryptoName: cryptoName,
                    timestamp: Date.now(),
                    read: false
                });
            }
            
            showSuccessToast(`Price alert set for ${cryptoName} at $${formatNumber(targetPrice)}`);
            loadWatchlistData(); // Refresh display
        }
        
        // Hide modal
        hidePriceAlertModal();
        
        // Remove event listener
        form.removeEventListener('submit', handleSubmit);
    };
    
    // Add event listener
    form.addEventListener('submit', handleSubmit);
    
    // Handle close button
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    
    const hideModal = () => {
        hidePriceAlertModal();
        form.removeEventListener('submit', handleSubmit);
    };
    
    closeBtn.onclick = hideModal;
    cancelBtn.onclick = hideModal;
    
    // Handle click outside modal
    modal.onclick = (e) => {
        if (e.target === modal) {
            hideModal();
        }
    };
}

function hidePriceAlertModal() {
    const modal = document.querySelector('.price-alert-container');
    modal.classList.remove('show');
    modal.classList.add('hide');
}