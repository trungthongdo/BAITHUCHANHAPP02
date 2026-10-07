import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { fetchWeatherByCoords, fetchWeatherByCity } from '../services/weatherService';
import { WeatherData, LocationCoords } from '../types/weather';
import { DEFAULT_LOCATION } from '../constants/api';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  location: LocationCoords | null;
  refreshWeather: () => Promise<void>;
  searchWeather: (city: string) => Promise<void>;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
    return error.response?.data?.error?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Quyền truy cập vị trí',
        message: 'Ứng dụng cần quyền truy cập vị trí để cung cấp thời tiết tại vị trí của bạn.',
        buttonNeutral: 'Hỏi lại sau',
        buttonNegative: 'Từ chối',
        buttonPositive: 'Đồng ý',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const loadWeatherByCoords = useCallback(async (lat: number, lon: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherByCoords(lat, lon);
      setWeatherData(data);
    } catch (err: unknown) {
      setError(getErrorMessage(
        err,
        'Không thể tải dữ liệu thời tiết. Vui lòng thử lại.',
      ));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDefaultWeather = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherByCoords(
        DEFAULT_LOCATION.lat,
        DEFAULT_LOCATION.lon,
        DEFAULT_LOCATION.name,
      );
      setWeatherData(data);
      setLocation({
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lon,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(
        err,
        'Không thể tải dữ liệu thời tiết. Vui lòng kiểm tra kết nối mạng.',
      ));
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Không có quyền truy cập vị trí',
          'Ứng dụng sẽ hiển thị thời tiết tại Hà Nội. Bạn có thể tìm kiếm thành phố khác.',
          [{ text: 'Đồng ý' }],
        );
        await loadDefaultWeather();
        return;
      }

      const position = await new Promise<{
        coords: { latitude: number; longitude: number };
      }>((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });
      const coords: LocationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(coords);
      await loadWeatherByCoords(coords.latitude, coords.longitude);
    } catch {
      Alert.alert(
        'Không lấy được vị trí',
        'Ứng dụng sẽ hiển thị thời tiết tại Hà Nội. Bạn có thể thử lại hoặc tìm kiếm thành phố khác.',
        [{ text: 'Đồng ý' }],
      );
      await loadDefaultWeather();
    }
  }, [
    loadDefaultWeather,
    loadWeatherByCoords,
    requestLocationPermission,
  ]);

  const refreshWeather = useCallback(async (): Promise<void> => {
    if (location) {
      await loadWeatherByCoords(location.latitude, location.longitude);
      return;
    }

    await getCurrentLocation();
  }, [getCurrentLocation, loadWeatherByCoords, location]);

  const searchWeather = useCallback(async (city: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
      setLocation({
        latitude: data.location.lat,
        longitude: data.location.lon,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(
        err,
        'Không tìm thấy địa điểm. Vui lòng thử lại.',
      ));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    weatherData,
    loading,
    error,
    location,
    refreshWeather,
    searchWeather,
  };
};
