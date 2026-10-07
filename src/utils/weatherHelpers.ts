import { WeatherData, HourlyForecast } from '../types/weather';

// Get weather condition emoji and icon name based on condition code
export const getWeatherEmoji = (code: number, isDay: number = 1): string => {
  if (code === 1000) return isDay ? '☀️' : '🌙';
  if (code === 1003) return '⛅';
  if (code === 1006) return '☁️';
  if (code === 1009) return '☁️';
  if (code === 1030 || code === 1135 || code === 1147) return '🌫️';
  if (code >= 1063 && code <= 1072) return '🌦️';
  if (code >= 1150 && code <= 1201) return '🌧️';
  if (code >= 1204 && code <= 1237) return '🌨️';
  if (code >= 1240 && code <= 1264) return '🌧️';
  if (code >= 1273 && code <= 1282) return '⛈️';
  return '🌤️';
};

export const getWeatherIconName = (code: number, isDay: number = 1): string => {
  if (code === 1000) return isDay ? 'weather-sunny' : 'weather-night';
  if (code === 1003) return isDay ? 'weather-partly-cloudy' : 'weather-night-partly-cloudy';
  if (code === 1006 || code === 1009) return 'weather-cloudy';
  if (code === 1030 || code === 1135 || code === 1147) return 'weather-fog';
  if (code >= 1063 && code <= 1072) return 'weather-rainy';
  if (code >= 1150 && code <= 1201) return 'weather-pouring';
  if (code >= 1204 && code <= 1237) return 'weather-snowy';
  if (code >= 1240 && code <= 1264) return 'weather-rainy';
  if (code >= 1273 && code <= 1282) return 'weather-lightning-rainy';
  return 'weather-partly-cloudy';
};

export const getWeatherGradient = (code: number, isDay: number = 1): string[] => {
  if (!isDay) {
    if (code >= 1273 && code <= 1282) {
      // Sấm sét ban đêm - tím huyền bí
      return ['#070514', '#120b2e', '#1e114a', '#2b1566', '#170c38', '#080517'];
    }
    if (code >= 1063 && code <= 1264) {
      // Mưa ban đêm - xanh biển sâu
      return ['#050b17', '#09152b', '#0f2245', '#163161', '#0d1f40', '#060d1c'];
    }
    // Đêm trời quang - bầu trời đêm ánh sao sâu thẳm
    return ['#050918', '#0a122e', '#101d46', '#16285f', '#0f1a3e', '#070b1e'];
  }

  // Ban ngày nắng - xanh dương rực rỡ & bầu trời trong xanh
  if (code === 1000) {
    return ['#0284c7', '#0ea5e9', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'];
  }
  // Ban ngày có mây / ít mây - chuyển màu xanh dương sang xanh cobalt
  if (code === 1003) {
    return ['#0284c7', '#2563eb', '#3b82f6', '#1d4ed8', '#1e3a8a', '#0f172a'];
  }
  // Nhiều mây / u ám - xám đá phiến thanh lịch
  if (code === 1006 || code === 1009) {
    return ['#1e293b', '#334155', '#475569', '#3b495d', '#283446', '#1a2230'];
  }
  // Sương mù - xám lạnh mờ sương
  if (code === 1030 || code === 1135 || code === 1147) {
    return ['#222a36', '#323e4e', '#415064', '#364355', '#26303d', '#1a202a'];
  }
  // Mưa / mưa rào - xanh biển xám sâu
  if (code >= 1063 && code <= 1201) {
    return ['#0d2238', '#153556', '#1d4a77', '#255e96', '#183f66', '#0f263e'];
  }
  // Tuyết - xanh băng giá
  if (code >= 1204 && code <= 1237) {
    return ['#283d52', '#39536d', '#4d6d8d', '#5d81a4', '#3d5874', '#233649'];
  }
  // Bão có sấm sét
  if (code >= 1273 && code <= 1282) {
    return ['#0d0b24', '#1a133f', '#291d5e', '#3c2982', '#211649', '#0e0b25'];
  }

  return ['#0284c7', '#0369a1', '#1e3a8a', '#0f172a', '#080d1a', '#050912'];
};

export const getWeatherGlowColor = (code: number, isDay: number = 1): string => {
  if (!isDay) return 'rgba(99, 102, 241, 0.35)'; // Tím indigo lấp lánh ban đêm
  if (code === 1000) return 'rgba(251, 191, 36, 0.45)'; // Vàng cam ấm áp ban ngày
  if (code === 1003) return 'rgba(56, 189, 248, 0.4)'; // Xanh ngọc mây
  if (code >= 1063 && code <= 1201) return 'rgba(59, 130, 246, 0.35)'; // Xanh dương sương mưa
  if (code >= 1273 && code <= 1282) return 'rgba(168, 85, 247, 0.45)'; // Tím sấm chớp
  return 'rgba(148, 163, 184, 0.25)';
};

export const formatTemp = (temp: number): string => `${Math.round(temp)}°`;

export const formatHour = (timeStr: string): string => {
  const hours = Number(timeStr.slice(11, 13));
  if (hours === 0) return '12 SA';
  if (hours < 12) return `${hours} SA`;
  if (hours === 12) return '12 CH';
  return `${hours - 12} CH`;
};

export const formatDay = (dateStr: string, referenceDateStr?: string): string => {
  const date = parseLocalDate(dateStr);
  const today = referenceDateStr ? parseLocalDate(referenceDateStr) : new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dateStr.slice(0, 10) === formatLocalDate(today)) return 'Hôm nay';
  if (dateStr.slice(0, 10) === formatLocalDate(tomorrow)) return 'Ngày mai';

  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[date.getDay()];
};

export const formatDate = (dateStr: string): string => {
  const date = parseLocalDate(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

export const formatFullDate = (dateStr: string): string => {
  const date = parseLocalDate(dateStr);
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const getUVLevel = (uv: number): { label: string; color: string } => {
  if (uv <= 2) return { label: 'Thấp', color: '#4CAF50' };
  if (uv <= 5) return { label: 'Trung bình', color: '#FFC107' };
  if (uv <= 7) return { label: 'Cao', color: '#FF9800' };
  if (uv <= 10) return { label: 'Rất cao', color: '#F44336' };
  return { label: 'Nguy hiểm', color: '#9C27B0' };
};

export const getWindDirection = (degree: number): string => {
  const directions = ['B', 'BĐB', 'ĐB', 'ĐĐB', 'Đ', 'ĐĐN', 'ĐN', 'NĐN', 'N', 'NTN', 'TN', 'TTN', 'T', 'TTB', 'TB', 'BTB'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

export const getHourlyForecast = (data: WeatherData): HourlyForecast[] => {
  const nowEpoch = Math.floor(Date.now() / 1000);
  const hours: HourlyForecast[] = [];

  for (const day of data.forecast.forecastday) {
    for (const hour of day.hour) {
      if (hour.time_epoch >= nowEpoch) {
        hours.push(hour);
      }
      if (hours.length === 24) return hours;
    }
  }

  return hours;
};

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getVisibilityLabel = (vis: number): string => {
  if (vis < 1) return 'Rất kém';
  if (vis < 5) return 'Kém';
  if (vis < 10) return 'Trung bình';
  if (vis < 20) return 'Tốt';
  return 'Rất tốt';
};
