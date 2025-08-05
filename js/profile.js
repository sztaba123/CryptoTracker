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

// Make functions globally available
window.initializeProfile = initializeProfile;
window.saveProfileChanges = saveProfileChanges;
window.loadProfileSettings = loadProfileSettings;
window.deleteAccount = deleteAccount;
window.changePassword = changePassword;
window.exportUserData = exportUserData;
window.showEditProfileModal = showEditProfileModal;