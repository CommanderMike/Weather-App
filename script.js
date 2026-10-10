const form = document.getElementById("weather-form");
const apiKeyInput = document.getElementById("api-key");
const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country");
const submitBtn = document.getElementById("get-weather-btn");
const resultCard = document.getElementById("result-card");
const resultContent = document.getElementById("result-content");
const errorMessage = document.getElementById("error-message");

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_BASE = "https://api.openweathermap.org";

function showError(message) {
  errorMessage.textContent = message;
  resultCard.setAttribute("aria-hidden", "true");
}

function clearError() {
  errorMessage.textContent = "";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.classList.add("loading");
  } else {
    submitBtn.classList.remove("loading");
  }
}

function clearResult() {
  resultContent.innerHTML = "";
  resultCard.setAttribute("aria-hidden", "true");
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

function getWindDirection(degrees) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

function renderWeather(data) {
  clearError();

  const { name, sys, main, weather, wind, visibility, clouds } = data;
  const country = sys && sys.country ? sys.country : "";
  const location = country ? `${name}, ${country}` : name;
  const condition = weather && weather[0] ? weather[0].description : "";
  const iconCode = weather && weather[0] ? weather[0].icon : "";
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : "";

  const humidity = main ? Math.round(main.humidity) : "--";
  const pressure = main ? Math.round(main.pressure) : "--";
  const temp = main ? Math.round(main.temp) : "--";
  const feelsLike = main ? Math.round(main.feels_like) : "--";
  const tempMin = main ? Math.round(main.temp_min) : "--";
  const tempMax = main ? Math.round(main.temp_max) : "--";
  const sunrise = sys && sys.sunrise ? formatDate(sys.sunrise) : "--";
  const sunset = sys && sys.sunset ? formatDate(sys.sunset) : "--";
  const windSpeed = wind ? Math.round(wind.speed) : "--";
  const windDir = wind && wind.deg !== undefined ? getWindDirection(wind.deg) : "--";
  const windGust = wind && wind.gust ? Math.round(wind.gust) : "--";
  const visKm = visibility !== undefined && visibility !== null ? Math.round(visibility / 1000) : "--";
  const cloudCover = clouds && clouds.all !== undefined ? Math.round(clouds.all) : "--";

  const html = `
    <div class="weather-header">
      <div class="location">${location}</div>
      <div class="condition">${condition}</div>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
      <div class="temp">${temp}<span style="font-size: 1.5rem; font-weight: 400; color: var(--muted);">°C</span></div>
      ${iconUrl ? `<img class="weather-icon" src="${iconUrl}" alt="${condition}" />` : ""}
    </div>

    <div class="weather-details">
      <div class="detail-item">
        <span class="detail-label">Feels Like</span>
        <span class="detail-value">${feelsLike}°C</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Min / Max</span>
        <span class="detail-value">${tempMin}°C / ${tempMax}°C</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Humidity</span>
        <span class="detail-value">${humidity}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Pressure</span>
        <span class="detail-value">${pressure} hPa</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Wind</span>
        <span class="detail-value">${windSpeed} m/s ${windDir}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Gusts</span>
        <span class="detail-value">${windGust} m/s</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Visibility</span>
        <span class="detail-value">${visKm} km</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Cloud Cover</span>
        <span class="detail-value">${cloudCover}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Sunrise</span>
        <span class="detail-value">${sunrise}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Sunset</span>
        <span class="detail-value">${sunset}</span>
      </div>
    </div>
  `;

  resultContent.innerHTML = html;
  resultCard.setAttribute("aria-hidden", "true");
  // Force reflow so the browser registers the aria-hidden change cleanly
  void resultCard.offsetWidth;
  resultCard.setAttribute("aria-hidden", "false");
}

async function fetchWeather(apiKey, city, country) {
  const params = new URLSearchParams({
    q: `${city},${country}`,
    appid: apiKey,
    units: "metric",
  });

  const response = await fetch(`${WEATHER_URL}?${params}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    let message = "Unable to retrieve weather information.";
    if (data && data.message) {
      message = data.message;
    }

    const status = response.status;
    if (status === 401 || status === 403) {
      message = "Invalid API key. Please check your OpenWeatherMap API key.";
    } else if (status === 404) {
      message = `Location "${city}, ${country}" not found. Please check the city and country.`;
    } else if (status === 429) {
      message = "Too many requests. Please wait a moment and try again.";
    }
    throw new Error(message);
  }

  return data;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const city = cityInput.value.trim();
  const country = countryInput.value.trim();

  if (!apiKey) {
    return showError("Please enter your OpenWeatherMap API key.");
  }

  if (!city) {
    return showError("Please enter a city.");
  }

  if (!country) {
    return showError("Please enter a country.");
  }

  clearResult();
  clearError();
  setLoading(true);

  try {
    const data = await fetchWeather(apiKey, city, country);
    renderWeather(data);
  } catch (err) {
    showError(err.message || "Request failed. Please try again later.");
  } finally {
    setLoading(false);
  }
});
