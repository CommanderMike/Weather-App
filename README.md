# Weatherly

Weatherly is a clean, modern, and responsive web application that lets you retrieve live weather information using the [OpenWeatherMap API](https://openweathermap.org/api).

## Features

- Enter your own **OpenWeatherMap API key** (no keys are hard-coded).
- Look up the current weather by **city** and **country**.
- Display:
  - Location name
  - Current temperature
  - Weather condition with an icon
  - "Feels like" temperature
  - Min / max temperatures
  - Humidity and pressure
  - Wind speed, direction and gusts
  - Visibility
  - Cloud cover
  - Sunrise and sunset times
- Clear, user-friendly error messages for:
  - Missing input fields
  - Invalid or expired API keys
  - Locations that cannot be found
  - Rate-limiting and request failures
- A loading state on the "Get Weather" button while data is being fetched.

## Project Structure

```
Weather App/
├── index.html   # Markup for the application
├── style.css    # Styling (clean, modern, responsive)
├── script.js    # Application logic and API integration
└── README.md    # This file
```

## How to Run

This is a static web application. There is no build step required.

### Option 1 — Open directly in a browser

1. Open `index.html` in your preferred browser (Chrome, Firefox, Edge, Safari, etc.).

### Option 2 — Serve with a local static server

Open your terminal, navigate to the project folder, and run one of the following commands:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Or with the live-server extension
npx live-server
```

Then open `http://localhost:8000` in your browser.

## How to Use

1. **Get an API key**

   Sign up for a free account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up) and create an API key on the [API keys page](https://home.openweathermap.org/api_keys). It takes a few minutes for a new key to become active.

2. **Enter the API key**

   Paste your OpenWeatherMap API key into the **API Key** field.

3. **Enter a location**

   - **City** — e.g. `London`
   - **Country** — the 2-letter ISO country code (e.g. `GB` for Great Britain)

4. **Get the weather**

   Click the **Get Weather** button. The current weather for the location will be displayed.

## API Reference

The app calls the OpenWeatherMap **Current Weather Data** endpoint:

```
GET https://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={API key}&units=metric
```

- `units=metric` — temperatures are returned in degrees Celsius.
- The full response can be found in the [OpenWeatherMap documentation](https://openweathermap.org/current).

## Notes

- Newly created API keys may take up to 10 minutes to activate.
- Free-tier API keys are subject to rate limits (60 calls per minute). If you hit the limit, wait a moment and try again.
- The country code is optional in the OpenWeatherMap query, but Weatherly includes it for precision.
