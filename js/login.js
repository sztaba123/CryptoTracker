// Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing login modal...');
    
    const loginBtn = document.getElementById('login-btn');
    const loginContainer = document.querySelector('.login-container');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.querySelector('.login-form');

    console.log('Elements found:', {
        loginBtn: !!loginBtn,
        loginContainer: !!loginContainer,
        closeBtn: !!closeBtn,
        loginForm: !!loginForm
    });

    // Upewnij się, że modal jest ukryty na start
    if (loginContainer) {
        loginContainer.classList.add('hide');
        loginContainer.classList.remove('show');
        loginContainer.style.display = 'none'; // Dodatkowe zabezpieczenie
    }

    // Otwórz modal po kliknięciu Login
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked');
            if (loginContainer) {
                loginContainer.classList.remove('hide');
                loginContainer.classList.add('show');
                loginContainer.style.display = ''; // Usuń inline style
                document.body.style.overflow = 'hidden';
                console.log('Modal opened');
            }
        });
    }

    // Zamknij modal po kliknięciu X
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close button clicked');
            closeModal();
        });
    }

    // Zamknij modal po kliknięciu na ciemne tło
    if (loginContainer) {
        loginContainer.addEventListener('click', function(e) {
            if (e.target === loginContainer) {
                console.log('Clicked on backdrop');
                closeModal();
            }
        });
    }

    // Zamknij modal po naciśnięciu ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginContainer && !loginContainer.classList.contains('hide')) {
            console.log('ESC pressed');
            closeModal();
        }
    });

    // Funkcja zamykania modal
    function closeModal() {
        console.log('Closing modal');
        if (loginContainer) {
            loginContainer.classList.add('hide');
            loginContainer.classList.remove('show');
            loginContainer.style.display = 'none'; // Dodatkowe zabezpieczenie
            document.body.style.overflow = 'auto';
            console.log('Modal closed');
        }
    }

    // Obsługa formularza login z API
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Login attempt:', { email });

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    showSuccessToast(`Welcome back, ${data.user.username}!`);
                    console.log('Login successful:', data.user);
                    loginForm.reset(); // Wyczyść formularz
                    closeModal();

                    // Aktualizuj interfejs użytkownika po zalogowaniu
                    updateUIAfterLogin(data.user);
                    
                    // Zapisz dane użytkownika w localStorage
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                } else {
                    showError('Login failed', data.message || 'Please check your credentials and try again.');
                    console.error('Login failed:', data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                showError('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.');
            }
        });
    }

});

// Funkcje zarządzania interfejsem użytkownika
function updateUIAfterLogin(user) {
    console.log('Updating UI after login for user:', user.username);
    
    // Ukryj przyciski login/register
    const loginBtn = document.getElementById('login-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    const authButtonsContainer = document.querySelector('.d-flex.flex-column.flex-lg-row.align-items-center.justify-content-center.justify-content-lg-start.ms-lg-auto');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (signUpBtn) signUpBtn.style.display = 'none';
    
    // Utwórz dropdown menu użytkownika
    const userDropdown = createUserDropdown(user);
    
    // Dodaj dropdown do kontenera
    if (authButtonsContainer) {
        authButtonsContainer.appendChild(userDropdown);
    }
}

function createUserDropdown(user) {
    // Główny kontener dropdown
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown';
    dropdownContainer.id = 'user-dropdown';
    
    // Przycisk dropdown
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'btn btn-outline-light dropdown-toggle d-flex align-items-center';
    dropdownButton.type = 'button';
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.innerHTML = `
        <i class="bi bi-person-circle me-2"></i>
        <span class="d-none d-lg-inline">${user.username}</span>
        <span class="d-lg-none">Profile</span>
    `;
    
    // Menu dropdown
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
    
    // Header z informacjami użytkownika
    const headerItem = document.createElement('li');
    headerItem.innerHTML = `
        <h6 class="dropdown-header">
            <i class="bi bi-person-circle me-2"></i>
            ${user.username}
        </h6>
    `;
    
    // Separator
    const separator1 = document.createElement('li');
    separator1.innerHTML = '<hr class="dropdown-divider">';
    
    // Opcja profilu
    const profileItem = document.createElement('li');
    profileItem.innerHTML = `
        <a class="dropdown-item" href="#" id="profile-link">
            <i class="bi bi-person me-2"></i>My Profile
        </a>
    `;
    
    // Opcja ustawień
    const settingsItem = document.createElement('li');
    settingsItem.innerHTML = `
        <a class="dropdown-item" href="#" id="settings-link">
            <i class="bi bi-gear me-2"></i>Settings
        </a>
    `;
    
    // Separator
    const separator2 = document.createElement('li');
    separator2.innerHTML = '<hr class="dropdown-divider">';
    
    // Opcja wylogowania
    const logoutItem = document.createElement('li');
    logoutItem.innerHTML = `
        <a class="dropdown-item text-danger" href="#" id="logout-link">
            <i class="bi bi-box-arrow-right me-2"></i>Logout
        </a>
    `;
    
    // Dodaj wszystkie elementy do menu
    dropdownMenu.appendChild(headerItem);
    dropdownMenu.appendChild(separator1);
    dropdownMenu.appendChild(profileItem);
    dropdownMenu.appendChild(settingsItem);
    dropdownMenu.appendChild(separator2);
    dropdownMenu.appendChild(logoutItem);
    
    // Dodaj przycisk i menu do kontenera
    dropdownContainer.appendChild(dropdownButton);
    dropdownContainer.appendChild(dropdownMenu);
    
    // Dodaj event listenery
    addDropdownEventListeners();
    
    return dropdownContainer;
}

function addDropdownEventListeners() {
    // Dodaj event listenery po krótkim opóźnieniu, żeby elementy były już w DOM
    setTimeout(() => {
        const profileLink = document.getElementById('profile-link');
        const settingsLink = document.getElementById('settings-link');
        const logoutLink = document.getElementById('logout-link');
        
        if (profileLink) {
            profileLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Profile clicked');
                // Tu można dodać przekierowanie do profilu
                showInfoToast('Profile page coming soon!');
            });
        }
        
        if (settingsLink) {
            settingsLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Settings clicked');
                // Tu można dodać przekierowanie do ustawień
                showInfoToast('Settings page coming soon!');
            });
        }
        
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Logout clicked');
                
                // Pokaż potwierdzenie wylogowania
                showConfirm('Are you sure you want to logout?', {
                    confirmText: 'Logout',
                    cancelText: 'Cancel',
                    onConfirm: () => {
                        logout();
                        showSuccessToast('You have been logged out successfully!');
                    }
                });
            });
        }
    }, 100);
}

function logout() {
    console.log('Logging out user');
    
    // Usuń dane użytkownika z localStorage
    localStorage.removeItem('currentUser');
    
    // Usuń dropdown użytkownika
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
        userDropdown.remove();
    }
    
    // Przywróć przyciski login/register
    const loginBtn = document.getElementById('login-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    
    if (loginBtn) loginBtn.style.display = '';
    if (signUpBtn) signUpBtn.style.display = '';
    
    console.log('User logged out successfully');
}

// Sprawdź czy użytkownik jest już zalogowany przy ładowaniu strony
function checkExistingLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            console.log('Found existing login:', user.username);
            updateUIAfterLogin(user);
        } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// Uruchom sprawdzenie przy ładowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkExistingLogin, 500); // Opóźnienie, żeby upewnić się, że DOM jest gotowy
});

// Udostępnij funkcje globalnie
window.updateUIAfterLogin = updateUIAfterLogin;
window.logout = logout;
window.checkExistingLogin = checkExistingLogin;