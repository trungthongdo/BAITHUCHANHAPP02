// Open-Meteo provides weather and geocoding APIs without an API key.
export const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1';
export const GEOCODING_API_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

export const WEATHER_ENDPOINTS = {
  forecast: `${WEATHER_API_BASE_URL}/forecast`,
  search: `${GEOCODING_API_BASE_URL}/search`,
};

export const DEFAULT_LOCATION = {
  name: 'Hà Nội',
  lat: 21.0285,
  lon: 105.8542,
};

export const FORECAST_DAYS = 7;
