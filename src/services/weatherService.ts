import axios from 'axios';
import { WEATHER_ENDPOINTS, FORECAST_DAYS, DEFAULT_LOCATION } from '../constants/api';
import { LocationSearchResult, WeatherData } from '../types/weather';

const weatherApi = axios.create({
  timeout: 10000,
});

interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset_seconds: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    surface_pressure: number;
    visibility: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    surface_pressure: number[];
    visibility: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    temperature_2m_mean: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

interface OpenMeteoLocation {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface OpenMeteoSearchResponse {
  results?: OpenMeteoLocation[];
}

const hourlyFields = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'surface_pressure',
  'visibility',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'is_day',
].join(',');

const dailyFields = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'temperature_2m_mean',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'uv_index_max',
  'sunrise',
  'sunset',
].join(',');

const toWeatherCondition = (code: number) => {
  const conditionCodes: Record<number, number> = {
    0: 1000,
    1: 1003,
    2: 1003,
    3: 1006,
    45: 1030,
    48: 1030,
    51: 1150,
    53: 1150,
    55: 1150,
    56: 1150,
    57: 1150,
    61: 1180,
    63: 1180,
    65: 1180,
    66: 1183,
    67: 1183,
    71: 1213,
    73: 1213,
    75: 1213,
    77: 1213,
    80: 1240,
    81: 1240,
    82: 1240,
    85: 1213,
    86: 1213,
    95: 1273,
    96: 1273,
    99: 1273,
  };
  const labels: Record<number, string> = {
    0: 'Trời quang',
    1: 'Trời khá quang',
    2: 'Ít mây',
    3: 'Nhiều mây',
    45: 'Sương mù',
    48: 'Sương muối',
    51: 'Mưa phùn nhẹ',
    53: 'Mưa phùn',
    55: 'Mưa phùn dày',
    56: 'Mưa phùn đóng băng nhẹ',
    57: 'Mưa phùn đóng băng dày',
    61: 'Mưa nhẹ',
    63: 'Mưa vừa',
    65: 'Mưa to',
    66: 'Mưa đóng băng nhẹ',
    67: 'Mưa đóng băng to',
    71: 'Tuyết nhẹ',
    73: 'Tuyết vừa',
    75: 'Tuyết dày',
    77: 'Mưa tuyết',
    80: 'Mưa rào nhẹ',
    81: 'Mưa rào vừa',
    82: 'Mưa rào lớn',
    85: 'Mưa tuyết nhẹ',
    86: 'Mưa tuyết dày',
    95: 'Dông',
    96: 'Dông kèm mưa đá nhẹ',
    99: 'Dông kèm mưa đá lớn',
  };

  return {
    code: conditionCodes[code] ?? 1003,
    text: labels[code] ?? 'Không rõ',
    icon: '',
  };
};

const toWindDirection = (degree: number): string => {
  const directions = ['B', 'BĐB', 'ĐB', 'ĐĐB', 'Đ', 'ĐĐN', 'ĐN', 'NĐN', 'N', 'NTN', 'TN', 'TTN', 'T', 'TTB', 'TB', 'BTB'];
  return directions[Math.round(degree / 22.5) % directions.length];
};

const toEpoch = (localDateTime: string, utcOffsetSeconds: number): number => {
  const [date, time = '00:00'] = localDateTime.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return Math.floor(
    (Date.UTC(year, month - 1, day, hours, minutes) - utcOffsetSeconds * 1000) / 1000,
  );
};

const requiredValue = (values: number[], index: number, field: string): number => {
  const value = values[index];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Dữ liệu thời tiết không hợp lệ: thiếu ${field}.`);
  }
  return value;
};

const getKnownPlaceForCoordinates = (
  latitude: number,
  longitude: number,
): Pick<OpenMeteoLocation, 'name' | 'country' | 'admin1'> => {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(latitude - DEFAULT_LOCATION.lat);
  const longitudeDelta = toRadians(longitude - DEFAULT_LOCATION.lon);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(DEFAULT_LOCATION.lat))
    * Math.cos(toRadians(latitude))
    * Math.sin(longitudeDelta / 2) ** 2;
  const distanceKm = 6371 * 2 * Math.atan2(
    Math.sqrt(haversine),
    Math.sqrt(1 - haversine),
  );

  if (distanceKm <= 50) {
    return {
      name: DEFAULT_LOCATION.name,
      country: 'Việt Nam',
      admin1: DEFAULT_LOCATION.name,
    };
  }

  return { name: 'Vị trí hiện tại' };
};

const normalizeForecast = (
  response: OpenMeteoForecast,
  place: Pick<OpenMeteoLocation, 'name' | 'country' | 'admin1'>,
): WeatherData => {
  if (!response.current || !response.hourly || !response.daily) {
    throw new Error('API thời tiết trả về dữ liệu không đầy đủ.');
  }

  const current = response.current;
  const hours = response.hourly.time.map((time, index) => {
    const windDegree = requiredValue(response.hourly.wind_direction_10m, index, 'hướng gió');
    return {
      time,
      time_epoch: toEpoch(time, response.utc_offset_seconds),
      temp_c: requiredValue(response.hourly.temperature_2m, index, 'nhiệt độ'),
      feelslike_c: requiredValue(response.hourly.apparent_temperature, index, 'nhiệt độ cảm nhận'),
      humidity: requiredValue(response.hourly.relative_humidity_2m, index, 'độ ẩm'),
      wind_kph: requiredValue(response.hourly.wind_speed_10m, index, 'tốc độ gió'),
      wind_dir: toWindDirection(windDegree),
      wind_degree: windDegree,
      pressure_mb: requiredValue(response.hourly.surface_pressure, index, 'áp suất'),
      precip_mm: requiredValue(response.hourly.precipitation, index, 'lượng mưa'),
      chance_of_rain: requiredValue(response.hourly.precipitation_probability, index, 'khả năng mưa'),
      vis_km: requiredValue(response.hourly.visibility, index, 'tầm nhìn') / 1000,
      uv: requiredValue(response.hourly.uv_index, index, 'chỉ số UV'),
      condition: toWeatherCondition(requiredValue(response.hourly.weather_code, index, 'trạng thái thời tiết')),
      is_day: requiredValue(response.hourly.is_day, index, 'thời điểm ngày/đêm'),
    };
  });

  const forecastday = response.daily.time.map((date, index) => {
    const dayHours = hours.filter(hour => hour.time.startsWith(date));
    const averageHumidity = dayHours.length
      ? dayHours.reduce((sum, hour) => sum + hour.humidity, 0) / dayHours.length
      : 0;

    return {
      date,
      date_epoch: toEpoch(date, response.utc_offset_seconds),
      day: {
        maxtemp_c: requiredValue(response.daily.temperature_2m_max, index, 'nhiệt độ cao nhất'),
        mintemp_c: requiredValue(response.daily.temperature_2m_min, index, 'nhiệt độ thấp nhất'),
        avgtemp_c: requiredValue(response.daily.temperature_2m_mean, index, 'nhiệt độ trung bình'),
        maxwind_kph: requiredValue(response.daily.wind_speed_10m_max, index, 'gió tối đa'),
        totalprecip_mm: requiredValue(response.daily.precipitation_sum, index, 'tổng lượng mưa'),
        avghumidity: averageHumidity,
        daily_chance_of_rain: requiredValue(response.daily.precipitation_probability_max, index, 'khả năng mưa trong ngày'),
        uv: requiredValue(response.daily.uv_index_max, index, 'chỉ số UV'),
        condition: toWeatherCondition(requiredValue(response.daily.weather_code, index, 'trạng thái thời tiết')),
      },
      astro: {
        sunrise: response.daily.sunrise[index]?.slice(11, 16) ?? '--',
        sunset: response.daily.sunset[index]?.slice(11, 16) ?? '--',
        moonrise: '--',
        moonset: '--',
        moon_phase: '--',
      },
      hour: hours.filter(hour => hour.time.startsWith(date)),
    };
  });

  const currentWindDegree = current.wind_direction_10m;
  const localTime = current.time.length === 16 ? `${current.time}:00` : current.time;
  const currentCondition = toWeatherCondition(current.weather_code);

  return {
    location: {
      name: place.name,
      country: place.country ?? '',
      region: place.admin1 ?? '',
      lat: response.latitude,
      lon: response.longitude,
      localtime: localTime,
    },
    current: {
      temp_c: current.temperature_2m,
      temp_f: current.temperature_2m * 9 / 5 + 32,
      feelslike_c: current.apparent_temperature,
      feelslike_f: current.apparent_temperature * 9 / 5 + 32,
      humidity: current.relative_humidity_2m,
      wind_kph: current.wind_speed_10m,
      wind_dir: toWindDirection(currentWindDegree),
      wind_degree: currentWindDegree,
      pressure_mb: current.surface_pressure,
      vis_km: current.visibility / 1000,
      uv: current.uv_index,
      precip_mm: current.precipitation,
      condition: currentCondition,
      is_day: current.is_day,
    },
    forecast: { forecastday },
  };
};

const fetchForecast = async (
  latitude: number,
  longitude: number,
  place?: Pick<OpenMeteoLocation, 'name' | 'country' | 'admin1'>,
): Promise<WeatherData> => {
  const response = await weatherApi.get<OpenMeteoForecast>(WEATHER_ENDPOINTS.forecast, {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
      ].join(','),
      hourly: hourlyFields,
      daily: dailyFields,
      forecast_days: FORECAST_DAYS,
      timezone: 'auto',
      wind_speed_unit: 'kmh',
      temperature_unit: 'celsius',
      precipitation_unit: 'mm',
    },
  });

  return normalizeForecast(
    response.data,
    place ?? getKnownPlaceForCoordinates(latitude, longitude),
  );
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number,
  placeName?: string,
): Promise<WeatherData> => fetchForecast(
  lat,
  lon,
  placeName ? { name: placeName } : undefined,
);

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const isCoordinates = /^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/.test(city.trim());
  if (isCoordinates) {
    const [latitude, longitude] = city.split(',').map(Number);
    return fetchForecast(latitude, longitude, { name: 'Vị trí đã chọn' });
  }

  const locations = await searchLocations(city);
  const place = locations[0];
  if (!place) {
    throw new Error('Không tìm thấy địa điểm. Vui lòng kiểm tra tên thành phố.');
  }

  return fetchForecast(place.lat, place.lon, place);
};

export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
  const response = await weatherApi.get<OpenMeteoSearchResponse>(WEATHER_ENDPOINTS.search, {
    params: {
      name: query.trim(),
      count: 10,
      language: 'vi',
      format: 'json',
    },
  });

  return (response.data.results ?? []).map((location, index) => ({
    id: location.id ?? index,
    name: location.name,
    region: location.admin1 ?? '',
    country: location.country ?? '',
    lat: location.latitude,
    lon: location.longitude,
  }));
};
