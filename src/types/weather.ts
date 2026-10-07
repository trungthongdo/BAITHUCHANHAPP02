export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    wind_degree: number;
    pressure_mb: number;
    vis_km: number;
    uv: number;
    precip_mm: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    is_day: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    avghumidity: number;
    daily_chance_of_rain: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
  };
  hour: HourlyForecast[];
}

export interface HourlyForecast {
  time: string;
  time_epoch: number;
  temp_c: number;
  feelslike_c: number;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  wind_degree: number;
  pressure_mb: number;
  precip_mm: number;
  chance_of_rain: number;
  vis_km: number;
  uv: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  is_day: number;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationSearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}
