//API key for this 83952679d8b4602680ec29986cff7f07
const apiKey = '83952679d8b4602680ec29986cff7f07'; // Replace with your actual API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-container');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});

async function fetchWeatherData(city) {
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherData.cod === '404') {
            throw new Error('City not found');
        }

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message || 'Error fetching weather data. Please try again.');
    }
}

function displayCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind: ${data.wind.speed} m/s`;
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    
    dailyForecasts.slice(0, 5).forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        forecastItem.innerHTML = `
            <h4>${dayName}</h4>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather icon">
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Initial weather data fetch for a default city
fetchWeatherData('London');

