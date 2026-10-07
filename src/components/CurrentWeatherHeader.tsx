import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { WeatherData } from '../types/weather';
import {
  getWeatherEmoji,
  formatTemp,
  formatFullDate,
} from '../utils/weatherHelpers';
import { COLORS, SIZES, SPACING } from '../constants/theme';

interface CurrentWeatherHeaderProps {
  data: WeatherData;
  onRefresh: () => void;
  onSearch: () => void;
}

const CurrentWeatherHeader: React.FC<CurrentWeatherHeaderProps> = ({
  data,
  onRefresh,
  onSearch,
}) => {
  const { current, location, forecast } = data;
  const today = forecast.forecastday[0];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the emoji
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [data, fadeAnim, pulseAnim, scaleAnim, slideAnim]);

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
        <View style={styles.locationContainer}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationName} numberOfLines={1} ellipsizeMode="tail">
            {location.name}{location.country ? `, ${location.country}` : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Date */}
      <Animated.Text
        style={[styles.dateText, { transform: [{ translateY: slideAnim }] }]}>
        {formatFullDate(location.localtime)}
      </Animated.Text>

      {/* Weather Emoji */}
      <Animated.Text
        style={[styles.weatherEmoji, { transform: [{ scale: pulseAnim }] }]}>
        {getWeatherEmoji(current.condition.code, current.is_day)}
      </Animated.Text>

      {/* Temperature */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.temperature}>{formatTemp(current.temp_c)}</Text>
      </Animated.View>

      {/* Condition */}
      <Text style={styles.conditionText}>{current.condition.text}</Text>

      {/* High/Low/Feels Like */}
      <View style={styles.tempDetails}>
        <View style={styles.tempDetailItem}>
          <Text style={styles.tempDetailLabel}>Cao</Text>
          <Text style={styles.tempDetailValue}>
            {today ? formatTemp(today.day.maxtemp_c) : '—'}
          </Text>
        </View>
        <View style={styles.tempDetailDivider} />
        <View style={styles.tempDetailItem}>
          <Text style={styles.tempDetailLabel}>Thấp</Text>
          <Text style={styles.tempDetailValue}>
            {today ? formatTemp(today.day.mintemp_c) : '—'}
          </Text>
        </View>
        <View style={styles.tempDetailDivider} />
        <View style={styles.tempDetailItem}>
          <Text style={styles.tempDetailLabel}>Cảm giác</Text>
          <Text style={styles.tempDetailValue}>{formatTemp(current.feelslike_c)}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: (StatusBar.currentHeight || 24) + SPACING.base,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.base,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  locationPin: {
    fontSize: 14,
    marginRight: 4,
  },
  locationName: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 18,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  weatherEmoji: {
    fontSize: 110,
    marginBottom: SPACING.md,
  },
  temperature: {
    color: COLORS.white,
    fontSize: 96,
    fontWeight: '200',
    letterSpacing: -4,
    textAlign: 'center',
  },
  conditionText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.lg,
    fontWeight: '500',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  tempDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tempDetailItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
  },
  tempDetailLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginBottom: 4,
    fontWeight: '500',
  },
  tempDetailValue: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '700',
  },
  tempDetailDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default CurrentWeatherHeader;
