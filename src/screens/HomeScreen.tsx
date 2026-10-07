import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useWeather } from '../hooks/useWeather';
import {
  getHourlyForecast,
  getWeatherGradient,
  getWeatherGlowColor,
} from '../utils/weatherHelpers';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '../components/StatusScreens';
import CurrentWeatherHeader from '../components/CurrentWeatherHeader';
import HourlyForecastSection from '../components/HourlyForecastSection';
import DailyForecastSection from '../components/DailyForecastSection';
import WeatherMetricsGrid from '../components/WeatherMetricsGrid';
import SearchModal from '../components/SearchModal';
import { COLORS, SPACING } from '../constants/theme';
import { ForecastDay } from '../types/weather';
import { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { weatherData, loading, error, refreshWeather, searchWeather } = useWeather();
  const [searchVisible, setSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshWeather();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDayPress = (day: ForecastDay) => {
    if (!weatherData) {
      return;
    }

    navigation.navigate('DayDetail', { day, weatherData });
  };

  if (loading && !refreshing) {
    return <LoadingScreen message="Đang lấy dữ liệu thời tiết..." />;
  }

  if (error && !weatherData) {
    return <ErrorScreen message={error} onRetry={refreshWeather} />;
  }

  if (!weatherData) {
    return (
      <EmptyScreen
        message="Chưa nhận được dữ liệu thời tiết. Hãy thử tải lại."
        onRetry={refreshWeather}
      />
    );
  }

  const gradient = getWeatherGradient(
    weatherData.current.condition.code,
    weatherData.current.is_day,
  );

  const hourlyData = getHourlyForecast(weatherData);
  const todayForecast = weatherData.forecast.forecastday[0];

  const glowColor = getWeatherGlowColor(
    weatherData.current.condition.code,
    weatherData.current.is_day,
  );

  return (
    <View style={[styles.container, { backgroundColor: gradient[0] }]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        style={[styles.ambientGlowPrimary, { backgroundColor: glowColor }]}
      />

      {!weatherData.current.is_day && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={[styles.starDot, styles.starPositionOne]} />
          <View style={[styles.starDot, styles.starPositionTwo]} />
          <View style={[styles.starDot, styles.starPositionThree]} />
          <View style={[styles.starDot, styles.starPositionFour]} />
          <View style={[styles.starDot, styles.starPositionFive]} />
          <View style={[styles.starDot, styles.starPositionSix]} />
          <View style={[styles.starDot, styles.starPositionSeven]} />
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        >

        {error ? (
          <View style={styles.errorNotice}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refreshWeather} accessibilityRole="button">
              <Text style={styles.errorRetry}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <CurrentWeatherHeader
          data={weatherData}
          onRefresh={refreshWeather}
          onSearch={() => setSearchVisible(true)}
        />

        {hourlyData.length > 0 ? (
          <HourlyForecastSection hours={hourlyData} />
        ) : (
          <View style={styles.emptyNotice}>
            <Text style={styles.emptyText}>Chưa có dữ liệu dự báo theo giờ.</Text>
          </View>
        )}

        <DailyForecastSection
          forecastDays={weatherData.forecast.forecastday}
          referenceDate={weatherData.location.localtime}
          onDayPress={handleDayPress}
        />

        <WeatherMetricsGrid current={weatherData.current} />

        {todayForecast ? (
          <View style={styles.astroCard}>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌅</Text>
              <Text style={styles.astroLabel}>Bình minh</Text>
              <Text style={styles.astroTime}>{todayForecast.astro.sunrise}</Text>
            </View>
            <View style={styles.astroDivider} />
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌇</Text>
              <Text style={styles.astroLabel}>Hoàng hôn</Text>
              <Text style={styles.astroTime}>{todayForecast.astro.sunset}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyNotice}>
            <Text style={styles.emptyText}>Chưa có dữ liệu bình minh và hoàng hôn.</Text>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>

      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelectCity={searchWeather}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientGlowPrimary: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 340,
    height: 340,
    borderRadius: 170,
    opacity: 0.85,
    zIndex: 0,
  },
  starDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
  },
  starPositionOne: { top: '8%', left: '15%', opacity: 0.8 },
  starPositionTwo: { top: '12%', left: '80%', opacity: 0.6 },
  starPositionThree: { top: '18%', left: '30%', opacity: 0.5 },
  starPositionFour: { top: '22%', left: '88%', opacity: 0.7 },
  starPositionFive: { top: '28%', left: '10%', opacity: 0.4 },
  starPositionSix: { top: '35%', left: '75%', opacity: 0.5 },
  starPositionSeven: { top: '42%', left: '20%', opacity: 0.7 },
  errorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.base,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 83, 80, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.45)',
  },
  errorText: {
    color: COLORS.white,
    flex: 1,
    fontSize: 12,
    marginRight: SPACING.sm,
  },
  errorRetry: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    padding: SPACING.xs,
  },
  emptyNotice: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    padding: SPACING.base,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
  },
  astroCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    padding: SPACING.xl,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  astroItem: {
    flex: 1,
    alignItems: 'center',
  },
  astroIcon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  astroLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  astroTime: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  astroDivider: {
    width: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: SPACING.base,
  },
  footer: {
    height: SPACING.xxxl,
  },
});

export default HomeScreen;
