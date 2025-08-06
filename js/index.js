// Main JavaScript functionality for CryptoTracker

document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation link
    setActiveNavLink();
    
    // Initialize crypto price updates
    initializeCryptoPrices();
    
    // Initialize button handlers
    initializeButtonHandlers();
    
    // Initialize animations
    initializeAnimations();
    
    // Update market statistics (only on non-crypto pages)
    if (!window.location.pathname.includes('crypto.html')) {
        updateMarketStats();
    }
    
    // Auto-refresh prices every 30 seconds
    setInterval(updateAllPrices, 30000);
});

// Set active navigation link based on current page
function setActiveNavLink() {
    // Get current page name from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize cryptocurrency price updates
function initializeCryptoPrices() {
    updateAllPrices();
    updateHeroButton(); // Aktualizuj przycisk hero na podstawie statusu logowania
}

// Update all cryptocurrency prices
async function updateAllPrices() {
    const cryptos = ['bitcoin', 'ethereum', 'cardano', 'solana', 'dogecoin', 'bnb'];
    
    for (const crypto of cryptos) {
        try {
            const data = await fetchCryptoPrice(crypto);
            updateCryptoCard(crypto, data);
        } catch (error) {
            console.error(`Error updating ${crypto}:`, error);
            // Pokaż toast tylko dla pierwszego błędu, żeby nie spamować
            if (crypto === 'bitcoin') {
                showErrorToast('Unable to fetch cryptocurrency prices. Please check your connection.');
            }
        }
    }
}

// Update individual crypto card
function updateCryptoCard(cryptoId, data) {
    const card = document.getElementById(cryptoId);
    if (!card) return;
    
    const priceElement = card.querySelector('.price');
    const changeElement = card.querySelector('.change');
    
    if (data && data.price) {
        priceElement.textContent = `$${data.price.toFixed(2)}`;
        
        const changePercent = data.change24h || 0;
        const changeClass = changePercent >= 0 ? 'text-success' : 'text-danger';
        const changeSymbol = changePercent >= 0 ? '+' : '';
        
        changeElement.textContent = `${changeSymbol}${changePercent.toFixed(2)}%`;
        changeElement.className = `change ${changeClass}`;
    }
}

// Initialize button handlers
function initializeButtonHandlers() {
    // CTA button handler
    const ctaSignupBtn = document.getElementById('cta-signup');
    if (ctaSignupBtn) {
        ctaSignupBtn.addEventListener('click', function() {
            // Show register modal
            const registerContainer = document.querySelector('.register-container');
            if (registerContainer) {
                registerContainer.classList.remove('hide');
            }
        });
    }
    
    // Hero button handlers
    const heroSignupBtn = document.getElementById('hero-main-btn');
    const heroLearnBtn = document.getElementById('hero-learn-btn');
    
    if (heroSignupBtn) {
        heroSignupBtn.addEventListener('click', function() {
            // Sprawdź czy użytkownik jest zalogowany
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                // Jeśli zalogowany, przewiń do sekcji dashboard
                const dashboardSection = document.querySelector('.crypto-dashboard');
                if (dashboardSection) {
                    dashboardSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Jeśli nie zalogowany, pokaż modal rejestracji
                const registerContainer = document.querySelector('.register-container');
                if (registerContainer) {
                    registerContainer.classList.remove('hide');
                    registerContainer.classList.add('show');
                    registerContainer.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }
    
    if (heroLearnBtn) {
        heroLearnBtn.addEventListener('click', function() {
            // Scroll to features section
            const featuresSection = document.querySelector('.features-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize animations and effects
function initializeAnimations() {
    // Add intersection observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    const cards = document.querySelectorAll('.crypto-card, .feature-card, .trending-card, .testimonial-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Update market statistics with real data
function updateMarketStats() {
    // Simulate market data updates
    updateMarketCap();
    updateVolume24h();
    updateActiveUsers();
}

function updateMarketCap() {
    const marketCapElement = document.getElementById('market-cap');
    if (marketCapElement) {
        // Simulate real market cap data
        const marketCap = (2.1 + (Math.random() - 0.5) * 0.2).toFixed(1);
        marketCapElement.textContent = `$${marketCap}T`;
    }
}

function updateVolume24h() {
    const volumeElement = document.getElementById('volume-24h');
    if (volumeElement) {
        // Simulate real volume data
        const volume = Math.floor(85 + Math.random() * 20);
        volumeElement.textContent = `$${volume}B`;
    }
}

function updateActiveUsers() {
    const usersElement = document.getElementById('active-users');
    if (usersElement) {
        // Simulate growing user base
        const users = Math.floor(10000 + Math.random() * 500);
        usersElement.textContent = `${(users / 1000).toFixed(1)}K+`;
    }
}

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="spinner-border spinner-border-sm me-2" role="status"></div>Loading...';
    }
}

function hideLoading(element, originalText) {
    if (element) {
        element.innerHTML = originalText;
    }
}

// Add typing effect for hero text
function typewriterEffect(element, text, speed = 100) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize typewriter effect for hero subtitle
setTimeout(() => {
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle && heroSubtitle.textContent) {
        const originalText = heroSubtitle.textContent;
        typewriterEffect(heroSubtitle, originalText, 50);
    }
}, 1000);

// Add real-time clock for active trading hours
function updateTradingClock() {
    const clockElement = document.getElementById('trading-clock');
    if (clockElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'UTC'
        });
        clockElement.textContent = `UTC: ${timeString}`;
    }
}

// Update trading clock every second
setInterval(updateTradingClock, 1000);

// Funkcja aktualizująca przycisk hero na podstawie statusu logowania
function updateHeroButton() {
    const heroMainBtn = document.getElementById('hero-main-btn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (heroMainBtn) {
        if (currentUser) {
            heroMainBtn.innerHTML = '<i class="bi bi-graph-up me-2"></i>View Dashboard';
        } else {
            heroMainBtn.innerHTML = '<i class="bi bi-rocket-takeoff me-2"></i>Start Tracking Now';
        }
    }
}

console.log('CryptoTracker initialized successfully!');
