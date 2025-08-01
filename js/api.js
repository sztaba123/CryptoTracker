const URL = "https://api4.binance.com/api/v3/ticker/24hr";

// Mapping crypto names to Binance symbols
const cryptoMapping = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT',
    'cardano': 'ADAUSDT',
    'solana': 'SOLUSDT',
    'dogecoin': 'DOGEUSDT',
    'bnb': 'BNBUSDT'
};

function checkIsUSDT(symbol) {
    if (symbol.endsWith('USDT')) {
        return true;
    }
    return false;
}

// New function for individual crypto price fetching
async function fetchCryptoPrice(cryptoName) {
    try {
        const symbol = cryptoMapping[cryptoName];
        if (!symbol) {
            throw new Error(`Symbol not found for ${cryptoName}`);
        }
        
        const response = await fetch(`${URL}?symbol=${symbol}`);
        const data = await response.json();
        
        return {
            price: parseFloat(data.lastPrice),
            change24h: parseFloat(data.priceChangePercent)
        };
    } catch (error) {
        console.error(`Error fetching ${cryptoName} price:`, error);
        return null;
    }
}

// Pobieranie danych dla konkretnych kryptowalut
function fetchCryptoData() {
    // Pobierz dane dla Bitcoin, Ethereum i BNB
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
    
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            // Filtruj tylko potrzebne symbole
            const btcData = data.find(item => item.symbol === 'BTCUSDT');
            const ethData = data.find(item => item.symbol === 'ETHUSDT');
            const bnbData = data.find(item => item.symbol === 'BNBUSDT');
            
            // Aktualizuj karty kryptowalut
            if (btcData) updateCryptoCardOld('bitcoin', btcData);
            if (ethData) updateCryptoCardOld('ethereum', ethData);
            if (bnbData) updateCryptoCardOld('bnb', bnbData);
            
        })
        .catch(error => console.error('Error fetching crypto data:', error));
        
}

function updateCryptoCardOld(cryptoId, data) {
    const priceElement = document.querySelector(`#${cryptoId} .price`);
    const changeElement = document.querySelector(`#${cryptoId} .change`);
    
    if (priceElement && changeElement) {
        // Formatowanie ceny
        const price = parseFloat(data.lastPrice);
        const change = parseFloat(data.priceChangePercent);
        
        priceElement.textContent = `$${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
        
        // Formatowanie zmiany procentowej
        const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)}% (24h)`;
        changeElement.textContent = changeText;
        
        // Zmiana koloru w zależności od zysku/straty
        changeElement.className = `change ${change >= 0 ? 'text-success' : 'text-danger'}`;
    }
}




// Uruchomienie przy załadowaniu strony
window.addEventListener('load', () => {
    fetchCryptoData();
});

// Odświeżanie co 30 sekund
setInterval(() => {
    fetchCryptoData();
}, 30000);

