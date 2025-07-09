const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherCard = document.getElementById("weatherCard");
const locationP = document.getElementById("location");
const temperatureSpan = document.getElementById("temperature");
const weatherIconImg = document.getElementById("weatherIcon");
const conditionP = document.getElementById("condition");
const humiditySpan = document.getElementById("humidity");
const windSpeedSpan = document.getElementById("windSpeed");
const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

let currentCoords = null;
let currentUnit = "metric";

const apiKey = "bfeabd7e030ba7d8bf78d00aed7b6ca2";

getWeatherBtn.addEventListener("click", () => {
  getLocationFromIP();
});

celsiusBtn.addEventListener("click", () => {
  if (currentUnit !== "metric") {
    currentUnit = "metric";
    updateActiveUnit();
    if (currentCoords) fetchWeather(currentCoords.lat, currentCoords.lon);
  }
});

fahrenheitBtn.addEventListener("click", () => {
  if (currentUnit !== "imperial") {
    currentUnit = "imperial";
    updateActiveUnit();
    if (currentCoords) fetchWeather(currentCoords.lat, currentCoords.lon);
  }
});

function updateActiveUnit() {
  celsiusBtn.classList.toggle("active", currentUnit === "metric");
  fahrenheitBtn.classList.toggle("active", currentUnit === "imperial");
}

function getLocationFromIP() {
  // Example using ipapi.co (free for basic use)
  fetch("https://ipapi.co/json/")
    .then(response => {
      if (!response.ok) throw new Error("Unable to determine location.");
      return response.json();
    })
    .then(data => {
      const lat = data.latitude;
      const lon = data.longitude;
      currentCoords = { lat, lon };
      fetchWeather(lat, lon);
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
    });
}

function fetchWeather(lat, lon) {
  weatherCard.style.display = "none";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Weather data unavailable.");
      return response.json();
    })
    .then((data) => {
      const city = data.name;
      const country = data.sys.country;
      const temp = data.main.temp;
      const conditionMain = data.weather[0].main;
      const conditionDesc = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      const conditionIconMap = {
        Clear: "icons/sunny.png",
        Clouds: "icons/clouds.png",
        Rain: "icons/rain.png",
        Snow: "icons/snow.png",
        Thunderstorm: "icons/thunder.png",
        Drizzle: "icons/rain.png",
        Haze: "icons/fog.png",
        Smoke: "icons/fog.png",
        Dust: "icons/fog.png",
        Sand: "icons/fog.png",
        Fog: "icons/fog.png",
        Tornado: "icons/tornado.png"
      };

      const customIcon = conditionIconMap[conditionMain] || "icons/clear.png";

      locationP.textContent = `${city}, ${country}`;
      temperatureSpan.textContent = `${temp.toFixed(1)} ${currentUnit === "metric" ? "°C" : "°F"}`;
      conditionP.textContent = conditionDesc.charAt(0).toUpperCase() + conditionDesc.slice(1);
      weatherIconImg.src = customIcon;
      weatherIconImg.alt = conditionMain;
      humiditySpan.textContent = `${humidity}%`;
      windSpeedSpan.textContent = `${windSpeed} ${currentUnit === "metric" ? "km/h" : "mph"}`;

      weatherCard.style.display = "block";
    })
    .catch((err) => {
      alert(`Error: ${err.message}`);
    });
}
