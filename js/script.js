// js/script.js

const apiKey = 'SJEOPoWMlCWvlraopEyyfFKCHsL532mT'; // Tomorrow.io API key

document.getElementById('city-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const city = e.target.value;
        getCoordinates(city);
    }
});

function getCoordinates(city) {
    fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon);
            } else {
                console.error('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
        });
}

function getWeather(lat, lon) {
    fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            updateWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeather(data) {
    const cityName = data.location.name;
    const date = new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const temperature = `${Math.round(data.timelines.hourly[0].temperature)}°C`;
    const weatherDescription = data.timelines.hourly[0].condition;
    const temperatureMin = Math.round(data.timelines.daily[0].temperatureMin);
    const temperatureMax = Math.round(data.timelines.daily[0].temperatureMax);
    const temperatureRange = `${temperatureMin}°C / ${temperatureMax}°C`;

    document.getElementById('city-name').textContent = cityName;
    document.getElementById('date').textContent = date;
    document.getElementById('temperature').textContent = temperature;
    document.getElementById('weather-description').textContent = weatherDescription;
    document.getElementById('temperature-range').textContent = temperatureRange;
}
