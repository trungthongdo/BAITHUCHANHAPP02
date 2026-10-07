import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ForecastDay } from '../types/weather';
import {
  getWeatherEmoji,
  formatTemp,
  formatDay,
  formatDate,
} from '../utils/weatherHelpers';
import { COLORS, SIZES, SPACING } from '../constants/theme';

interface DailyForecastItemProps {
  day: ForecastDay;
  referenceDate: string;
  isFirst?: boolean;
  globalMin?: number;
  globalMax?: number;
  onPress?: (day: ForecastDay) => void;
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({
  day, referenceDate, isFirst, globalMin = 0, globalMax = 40, onPress,
}) => {
  const range = globalMax - globalMin || 1;
  const leftFlex = (day.day.mintemp_c - globalMin) / range;
  const fillFlex = (day.day.maxtemp_c - day.day.mintemp_c) / range;
  const rightFlex = (globalMax - day.day.maxtemp_c) / range;

  return (
    <TouchableOpacity
      style={[styles.itemContainer, isFirst && styles.itemContainerFirst]}
      onPress={() => onPress && onPress(day)}
      activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <Text style={[styles.dayName, isFirst && styles.dayNameFirst]}>
          {formatDay(day.date, referenceDate)}
        </Text>
        <Text style={styles.dateText}>{formatDate(day.date)}</Text>
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.weatherEmoji}>
          {getWeatherEmoji(day.day.condition.code, 1)}
        </Text>
        {day.day.daily_chance_of_rain > 0 && (
          <View style={styles.rainRow}>
            <Text style={styles.rainIcon}>💧</Text>
            <Text style={styles.rainText}>{day.day.daily_chance_of_rain}%</Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.tempRow}>
          <Text style={styles.minTemp}>{formatTemp(day.day.mintemp_c)}</Text>
          <View style={styles.tempBar}>
            {leftFlex > 0 && <View style={[styles.tempBarSegment, { flex: leftFlex }]} />}
            <View style={[styles.tempBarSegment, styles.tempBarFill, { flex: Math.max(fillFlex, 0.05) }]} />
            {rightFlex > 0 && <View style={[styles.tempBarSegment, { flex: rightFlex }]} />}
          </View>
          <Text style={styles.maxTemp}>{formatTemp(day.day.maxtemp_c)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface DailyForecastSectionProps {
  forecastDays: ForecastDay[];
  referenceDate: string;
  onDayPress?: (day: ForecastDay) => void;
}

const DailyForecastSection: React.FC<DailyForecastSectionProps> = ({
  forecastDays,
  referenceDate,
  onDayPress,
}) => {
  const globalMin = forecastDays.length
    ? Math.min(...forecastDays.map(d => d.day.mintemp_c))
    : 0;
  const globalMax = forecastDays.length
    ? Math.max(...forecastDays.map(d => d.day.maxtemp_c))
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📅</Text>
        <Text style={styles.headerTitle}>DỰ BÁO {forecastDays.length} NGÀY</Text>
      </View>
      {forecastDays.length === 0 ? (
        <Text style={styles.emptyText}>Hiện chưa có dữ liệu dự báo cho các ngày tới.</Text>
      ) : (
        forecastDays.map((day, index) => (
          <DailyForecastItem
            key={day.date}
            day={day}
            referenceDate={referenceDate}
            isFirst={index === 0}
            globalMin={globalMin}
            globalMax={globalMax}
            onPress={onDayPress}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: SPACING.base,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    paddingVertical: SPACING.md,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
  itemContainerFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  leftSection: {
    width: 84,
  },
  dayName: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  dayNameFirst: {
    color: COLORS.white,
    fontWeight: '700',
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  weatherEmoji: {
    fontSize: 30,
  },
  rainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rainIcon: {
    fontSize: 10,
  },
  rainText: {
    color: '#38bdf8',
    fontSize: SIZES.xs,
    marginLeft: 2,
    fontWeight: '600',
  },
  rightSection: {
    width: 140,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  maxTemp: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '700',
    width: 38,
    textAlign: 'right',
  },
  tempBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  tempBarSegment: {
    height: 6,
  },
  tempBarFill: {
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
  minTemp: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    width: 36,
  },
});

export default DailyForecastSection;
