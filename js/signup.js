// Sign Up Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sign Up modal script loaded...');
    
    const signUpBtn = document.getElementById('sign-up-btn');
    const registerContainer = document.querySelector('.register-container');
    const registerCloseBtn = registerContainer ? registerContainer.querySelector('.close-btn') : null;
    const registerForm = document.querySelector('.register-form');

    console.log('Sign Up elements found:', {
        signUpBtn: !!signUpBtn,
        registerContainer: !!registerContainer,
        registerCloseBtn: !!registerCloseBtn,
        registerForm: !!registerForm
    });

    // Upewnij się, że modal jest ukryty na start
    if (registerContainer) {
        registerContainer.classList.add('hide');
        registerContainer.classList.remove('show');
        registerContainer.style.display = 'none';
    }

    // Otwórz register modal po kliknięciu Sign Up
    if (signUpBtn && registerContainer) {
        signUpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sign Up button clicked');
            
            registerContainer.classList.remove('hide');
            registerContainer.classList.add('show');
            registerContainer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Register modal opened');
        });
    }

    // Zamknij register modal po kliknięciu X
    if (registerCloseBtn) {
        registerCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Register close button clicked');
            closeRegisterModal();
        });
    }

    // Zamknij modal po kliknięciu na backdrop
    if (registerContainer) {
        registerContainer.addEventListener('click', function(e) {
            if (e.target === registerContainer) {
                console.log('Clicked on register backdrop');
                closeRegisterModal();
            }
        });
    }

    // Zamknij modal po naciśnięciu ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && registerContainer && !registerContainer.classList.contains('hide')) {
            console.log('ESC pressed - closing register');
            closeRegisterModal();
        }
    });

    // Funkcja zamykania register modal
    function closeRegisterModal() {
        console.log('Closing register modal');
        if (registerContainer) {
            registerContainer.classList.add('hide');
            registerContainer.classList.remove('show');
            registerContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('Register modal closed');
        }
    }

    // Obsługa formularza register z API
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            console.log('🚀 Register attempt:', { username, email, password });
            
            try {
                // Wywołaj API rejestracji
                console.log('📡 Sending request to /api/register...');
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });
                
                console.log('📥 Response received:', response.status);
                const data = await response.json();
                console.log('📊 Response data:', data);
                
                if (data.success) {
                    showSuccess('Registration successful!', {
                        message: 'Your account has been created and you are now logged in.',
                        autoClose: true,
                        autoCloseTime: 2000,
                        onConfirm: () => {
                            registerForm.reset(); // Wyczyść formularz
                            closeRegisterModal();
                            
                            // Automatycznie zaloguj użytkownika po rejestracji
                            const userData = {
                                username: username,
                                email: email,
                                id: data.userId || Date.now() // Fallback ID jeśli nie ma w response
                            };
                            
                            // Sprawdź czy funkcje z login.js są dostępne
                            if (typeof updateUIAfterLogin === 'function') {
                                updateUIAfterLogin(userData);
                                localStorage.setItem('currentUser', JSON.stringify(userData));
                            }
                        }
                    });
                } else {
                    showError('Registration failed', data.message || 'Please try again with different credentials.');
                }
                
            } catch (error) {
                console.error('❌ Registration error:', error);
                showError('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.');
            }
        });
    }
});
  






