const apiKey = "fb9dca5292d12f74aade37bc3c330e0d"; 
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const airQualityUrl = "https://api.openweathermap.org/data/2.5/air_pollution?";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherInfo = document.getElementById("weatherInfo");
    const loading = document.getElementById("loading");

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    loading.classList.add("show");
    weatherInfo.classList.remove("show");

    try {
        const weatherResponse = await fetch(`${weatherUrl}${city}&appid=${apiKey}&units=metric`);
        if (!weatherResponse.ok) throw new Error("City not found");
        const weatherData = await weatherResponse.json();

        const { lat, lon } = weatherData.coord;
        const airResponse = await fetch(`${airQualityUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const airData = await airResponse.json();

        loading.classList.remove("show");
        displayWeather(weatherData, airData);
    } catch (error) {
        loading.classList.remove("show");
        weatherInfo.classList.add("show");
        weatherInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
function displayWeather(weatherData, airData) {
    const weatherInfo = document.getElementById("weatherInfo");
    weatherInfo.classList.add("show");

    // Weather Data
    document.getElementById("cityName").textContent = weatherData.name;
    document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    document.getElementById("temperature").textContent = `${Math.round(weatherData.main.temp)}°C`;
    document.getElementById("condition").textContent = weatherData.weather[0].description;
    document.getElementById("humidity").textContent = `${weatherData.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${weatherData.wind.speed} m/s`;
    document.getElementById("sunrise").textContent = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sunset").textContent = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Air Quality
    const aqi = airData.list[0].main.aqi;
    const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1];
    document.getElementById("airQuality").textContent = `${aqiText} (AQI: ${aqi})`;

    // Dynamic background
    const condition = weatherData.weather[0].description.toLowerCase();
    document.body.style.background = getBackground(condition);
}

function getBackground(condition) {
    if (condition.includes("clear")) return "linear-gradient(135deg, #f5f7fa, #c3e0e5)";
    if (condition.includes("cloud")) return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    if (condition.includes("rain")) return "linear-gradient(135deg, #3498db, #2c3e50)";
    if (condition.includes("snow")) return "linear-gradient(135deg, #ecf0f1, #bdc3c7)";
    return "linear-gradient(135deg, #6dd5fa, #2980b9)"; // Default
}