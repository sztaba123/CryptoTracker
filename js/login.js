// Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing login modal...');
    
    const loginBtn = document.getElementById('login-btn');
    const loginContainer = document.querySelector('.login-container');
    const closeBtn = loginContainer ? loginContainer.querySelector('.close-btn') : null;
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
                    
                    // Zapisz dane użytkownika w localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', data.user.username);
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userId', data.user.id);
                    
                    // Aktualizuj interfejs użytkownika po zalogowaniu
                    updateUIAfterLogin(data.user.username);
                    
                    loginForm.reset(); // Wyczyść formularz
                    closeModal();
                } else {
                    showErrorToast(data.message || 'Please check your credentials and try again.');
                    console.error('Login failed:', data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                showErrorToast('Unable to connect to the server. Please check your internet connection and try again.');
            }
        });
    }

});