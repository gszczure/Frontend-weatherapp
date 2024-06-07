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
}, handleGeolocationError);

function updateWeatherData(latitude, longitude) {
    fetchWeatherData(latitude, longitude)
        .then(data => displayWeatherData(data))
        .catch(error => console.error('Error:', error));
}

function fetchWeatherData(latitude, longitude) {
    return fetch(`https://backend-weatherapp.onrender.com/weather?latitude=${latitude}&longitude=${longitude}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        });
}

function displayWeatherData(data) {
    const weatherDataElement = document.getElementById('weatherData');
    weatherDataElement.innerHTML = '';

    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.maxTemperature}</td>
            <td>${entry.minTemperature}</td>
            <td>${entry.generatedEnergy}</td>
            <td>${getWeatherIcon(entry.weatherCode)}</td>
        `;
        weatherDataElement.appendChild(row);
    });
}

function getWeatherIcon(weatherCode) {
    const weatherIcons = {
        0: '<i class="fas fa-sun fa-2xl" style="color: #FFD43B;"></i>',
        1: '<i class="fas fa-cloud-sun fa-2xl" style="color: #a88322;"></i>',
        2: '<i class="fas fa-cloud-sun fa-2xl" style="color: #a88322;"></i>',
        3: '<i class="fa-solid fa-cloud fa-2xl" style="color: #808080"></i>',
        45: '<i class="fas fa-smog fa-2xl" style="color: #ffffff;"></i>',
        48: '<i class="fas fa-smog fa-2xl" style="color: #ffffff;"></i>',
        51: '<i class="fas fa-cloud-rain fa-2xl" style="color: #4a90e2;"></i>',
        53: '<i class="fas fa-cloud-rain fa-2xl" style="color: #4a90e2;"></i>',
        55: '<i class="fas fa-cloud-rain fa-2xl" style="color: #4a90e2;"></i>',
        61: '<i class="fa-solid fa-cloud-rain fa-2xl" style="color: #4a90e2;"></i>',
        63: '<i class="fa-solid fa-cloud-rain fa-2xl" style="color: #4a90e2;"></i>',
        65: '<i class="fas fa-cloud-showers-heavy fa-2xl" style="color: #4a90e2;"></i>',
        66: '<i class="fas fa-cloud-sleet fa-2xl" style="color: #4a90e2;"></i>',
        67: '<i class="fas fa-cloud-sleet fa-2xl" style="color: #4a90e2;"></i>',
        71: '<i class="fas fa-snowflake fa-2xl" style="color: #fff;"></i>',
        73: '<i class="fas fa-snowflake fa-2xl" style="color: #fff;"></i>',
        75: '<i class="fas fa-snowflake fa-2xl" style="color: #fff;"></i>',
        77: '<i class="fas fa-snowflake fa-2xl" style="color: #fff;"></i>',
        80: '<i class="fas fa-cloud-showers-heavy fa-2xl" style="color: #4a90e2;"></i>',
        81: '<i class="fas fa-cloud-showers-heavy fa-2xl" style="color: #4a90e2;"></i>',
        82: '<i class="fas fa-cloud-showers-heavy fa-2xl" style="color: #4a90e2;"></i>',
        85: '<i class="fas fa-snowflakes fa-2xl" style="color: #fff;"></i>',
        86: '<i class="fas fa-snowflakes fa-2xl" style="color: #fff;"></i>',
        95: '<i class="fas fa-bolt fa-2xl" style="color: #ffd700;"></i>',
        96: '<i class="fas fa-bolt fa-2xl" style="color: #ffd700;"></i>',
        99: '<i class="fas fa-bolt fa-2xl" style="color: #ffd700;"></i>',
        default: '<i class="fas fa-question fa-2xl" style="color: #000;"></i>'
    };
    return weatherIcons[weatherCode] || weatherIcons.default;
}

function handleGeolocationError(error) {
    console.error('Geolocation error:', error);
}
