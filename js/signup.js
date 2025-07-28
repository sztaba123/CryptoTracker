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

    // Obsługa formularza register
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            console.log('Register attempt:', { username, email, password });
            
            // Tu możesz dodać logikę rejestracji
            alert('Registration successful! Please login.');
            closeRegisterModal();
        });
    }
});
