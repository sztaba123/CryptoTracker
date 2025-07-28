const URL = "https://api4.binance.com/api/v3/ticker/24hr";

function checkIsUSDT(symbol) {
    if (symbol.endsWith('USDT')) {
        return true;
    }
    return false;
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
            if (btcData) updateCryptoCard('bitcoin', btcData);
            if (ethData) updateCryptoCard('ethereum', ethData);
            if (bnbData) updateCryptoCard('bnb', bnbData);
            
        })
        .catch(error => console.error('Error fetching crypto data:', error));
        
}

function updateCryptoCard(cryptoId, data) {
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

