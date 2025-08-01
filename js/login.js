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

    // Obsługa formularza login (opcjonalne)
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            console.log('Login attempt:', { username, password });
            
            // Po udanym logowaniu:
            // closeModal();
            // window.location.href = 'dashboard.html';
        });
    }
});