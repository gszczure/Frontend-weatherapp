var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([0, 0]).addTo(map);

map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 13);
    updateWeatherData(lat, lng);
});

navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 13);
    updateWeatherData(latitude, longitude);
});

function updateWeatherData(latitude, longitude) {
    fetch(`https://backend-weatherapp.onrender.com/weather?latitude=${latitude}&longitude=${longitude}`)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayWeatherData(data) {
    const weatherDataElement = document.getElementById('weatherData');
    weatherDataElement.innerHTML = '';

    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.max_temperature_C}</td>
                <td>${entry.min_temperature_C}</td>
                <td>${entry.generated_energy_kWh}</td>
                <td>${getWeatherIcon(entry.weather_code)}</td>
            `;
        weatherDataElement.appendChild(row);
    });
}

function getWeatherIcon(weatherCode) {
    switch (weatherCode) {
        case 0:
            return '<i class="fas fa-sun fa-2xl" style="color: #FFD43B;"></i>'; // Clear sky
        case 1:
        case 2:
        case 3:
            return '<i class="fas fa-cloud-sun fa-2xl" style="color: #ffffff;"></i>'; // Mainly clear, partly cloudy, and overcast
        case 45:
        case 48:
            return '<i class="fas fa-smog fa-2xl" style="color: #ffffff;"></i>'; // Fog and depositing rime fog
        case 51:
        case 53:
        case 55:
            return '<i class="fas fa-cloud-rain fa-2xl" style="color: #4a90e2;"></i>'; // Drizzle
        case 61:
        case 63:
        case 65:
            return '<i class="fas fa-cloud-showers-heavy fa-2xl" style="color: #4a90e2;"></i>'; // Rain
        case 66:
        case 67:
            return '<i class="fas fa-cloud-sleet fa-2xl" style="color: #4a90e2;"></i>'; // Freezing Rain
        case 71:
        case 73:
        case 75:
        case 77:
            return '<i class="fas fa-snowflake fa-2xl" style="color: #fff;"></i>'; // Snow fall, Snow grains
        case 80:
        case 81:
        case 82:
            return '<i class="fas fa-cloud-showers-heavy fa-2xl" style="color: #4a90e2;"></i>'; // Rain showers
        case 85:
        case 86:
            return '<i class="fas fa-snowflakes fa-2xl" style="color: #fff;"></i>'; // Snow showers
        case 95:
        case 96:
        case 99:
            return '<i class="fas fa-bolt fa-2xl" style="color: #ffd700;"></i>'; // Thunderstorm, Thunderstorm with hail
        default:
            return '<i class="fas fa-question fa-2xl" style="color: #000;"></i>'; // Default
    }
}
