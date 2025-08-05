// Authentication System
// Handles user login, logout, and authentication state management

// Logout function
function logout() {
    // Usuń dane użytkownika z localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // Aktualizuj UI - pokaż przyciski login/register
    updateUIAfterLogout();
    
    showSuccessToast('Successfully logged out!');
    
    // Przekieruj na główną stronę jeśli nie jesteś już na niej
    if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
        window.location.href = 'index.html';
    }
}

// Check if user is already logged in
function checkExistingLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log('Checking existing login:', { isLoggedIn, currentUser });
    
    if (isLoggedIn === 'true' && currentUser) {
        updateUIAfterLogin(currentUser);
        return true;
    }
    return false;
}

// Login function - now just for UI updates after successful API login
function loginUI(username) {
    // Zapisz stan logowania
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    
    // Aktualizuj UI
    updateUIAfterLogin(username);
    
    showSuccessToast(`Welcome back, ${username}!`);
    return true;
}

// Update UI after successful login
function updateUIAfterLogin(username) {
    console.log('Updating UI after login for user:', username);
    
    // Znajdź kontener z przyciskami
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (!authButtonsContainer) {
        console.log('Auth buttons container not found');
        return;
    }
    
    // Usuń istniejące przyciski login/register
    authButtonsContainer.innerHTML = '';
    
    // Utwórz dropdown powiadomień
    const notificationsDropdown = createNotificationsDropdown();
    
    // Utwórz dropdown użytkownika
    const userDropdown = document.createElement('div');
    userDropdown.className = 'dropdown';
    userDropdown.innerHTML = `
        <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="
            background: rgba(30, 30, 63, 0.8);
            border: 2px solid rgba(124, 58, 237, 0.6);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        ">
            <i class="bi bi-person-circle me-2"></i>
            <span class="user-name">${username}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" style="
            background: rgba(30, 30, 63, 0.95);
            border: 2px solid rgba(124, 58, 237, 0.6);
            backdrop-filter: blur(20px);
        ">
            <li>
                <a class="dropdown-item text-light" href="profile.html" style="
                    transition: all 0.3s ease;
                ">
                    <i class="bi bi-person me-2"></i>Profile
                </a>
            </li>
            <li>
                <a class="dropdown-item text-light" href="#" style="
                    transition: all 0.3s ease;
                ">
                    <i class="bi bi-gear me-2"></i>Settings
                </a>
            </li>
            <li><hr class="dropdown-divider" style="border-color: rgba(124, 58, 237, 0.3);"></li>
            <li>
                <a class="dropdown-item text-light" href="#" onclick="logout()" style="
                    transition: all 0.3s ease;
                ">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                </a>
            </li>
        </ul>
    `;
    
    // Dodaj powiadomienia i dropdown użytkownika
    authButtonsContainer.appendChild(notificationsDropdown);
    authButtonsContainer.appendChild(userDropdown);
    
    // Inicjalizuj Bootstrap dropdown ręcznie
    setTimeout(() => {
        const dropdownElement = userDropdown.querySelector('button[data-bs-toggle="dropdown"]');
        if (dropdownElement && window.bootstrap) {
            new bootstrap.Dropdown(dropdownElement);
        }
        
        const notificationsDropdownElement = notificationsDropdown.querySelector('button[data-bs-toggle="dropdown"]');
        if (notificationsDropdownElement && window.bootstrap) {
            new bootstrap.Dropdown(notificationsDropdownElement);
        }
    }, 100);
    
    // Dodaj hover effects do dropdown przycisków
    const userButton = userDropdown.querySelector('button');
    if (userButton) {
        userButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(124, 58, 237, 0.3)';
            this.style.borderColor = '#8b5cf6';
            this.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.4)';
        });
        
        userButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(30, 30, 63, 0.8)';
            this.style.borderColor = 'rgba(124, 58, 237, 0.6)';
            this.style.boxShadow = '';
        });
    }
    
    // Dodaj hover effects do dropdown items
    const dropdownItems = userDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(124, 58, 237, 0.2)';
            this.style.color = '#f8fafc';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.color = '';
        });
    });
    
    console.log('UI updated after login - dropdowns created');
}

// Update UI after logout
function updateUIAfterLogout() {
    // Znajdź kontener z przyciskami
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (!authButtonsContainer) {
        console.log('Auth buttons container not found');
        return;
    }
    
    // Przywróć oryginalne przyciski login/register
    authButtonsContainer.innerHTML = `
        <button class="btn me-lg-3 mb-2 mb-lg-0 login" id="login-btn" style="
            background: rgba(30, 30, 63, 0.8);
            border: 2px solid rgba(124, 58, 237, 0.6);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        ">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
        </button>
        <button class="btn sign-up" id="sign-up-btn" style="
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border: none;
            transition: all 0.3s ease;
        ">
            <i class="bi bi-person-plus me-1"></i>Sign Up
        </button>
    `;
    
    // Dodaj hover effects do nowych przycisków
    const loginBtn = authButtonsContainer.querySelector('#login-btn');
    const signupBtn = authButtonsContainer.querySelector('#sign-up-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(124, 58, 237, 0.3)';
            this.style.borderColor = '#8b5cf6';
            this.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.4)';
        });
        
        loginBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(30, 30, 63, 0.8)';
            this.style.borderColor = 'rgba(124, 58, 237, 0.6)';
            this.style.boxShadow = '';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #7c3aed, #2563eb)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 20px rgba(124, 58, 237, 0.4)';
        });
        
        signupBtn.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Ponownie inicjalizuj event listenery dla przycisków login/signup
    reinitializeModalListeners();
    
    console.log('UI updated after logout - login/register buttons restored');
}

// Reinitialize modal listeners after UI update
function reinitializeModalListeners() {
    // Dodaj event listenery dla przycisków logowania i rejestracji
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('sign-up-btn');
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');
    
    if (loginBtn && loginContainer) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked (after reinit)');
            loginContainer.classList.remove('hide');
            loginContainer.classList.add('show');
            loginContainer.style.display = '';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (signupBtn && registerContainer) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sign up button clicked (after reinit)');
            registerContainer.classList.remove('hide');
            registerContainer.classList.add('show');
            registerContainer.style.display = '';
            document.body.style.overflow = 'hidden';
        });
    }
}

// Initialize authentication on page load
function initializeAuth() {
    console.log('Initializing authentication system...');
    
    // Sprawdź czy użytkownik jest już zalogowany
    checkExistingLogin();
    
    console.log('Authentication system initialized');
}

// Make functions globally available
window.loginUI = loginUI;
window.logout = logout;
window.checkExistingLogin = checkExistingLogin;
window.updateUIAfterLogin = updateUIAfterLogin;
window.updateUIAfterLogout = updateUIAfterLogout;
window.initializeAuth = initializeAuth;
