import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { HourlyForecast } from '../types/weather';
import {
  getWeatherEmoji,
  formatTemp,
  formatHour,
  formatFullDate,
  getUVLevel,
  getWindDirection,
  getVisibilityLabel,
} from '../utils/weatherHelpers';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

interface HourlyForecastCardProps {
  hour: HourlyForecast;
  index: number;
}

const HourlyCard: React.FC<HourlyForecastCardProps> = ({ hour, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, index, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.hourCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}>
      <Text style={styles.hourTime}>{formatHour(hour.time)}</Text>
      <Text style={styles.hourEmoji}>{getWeatherEmoji(hour.condition.code, hour.is_day)}</Text>
      <Text style={styles.hourTemp}>{formatTemp(hour.temp_c)}</Text>
      <View style={styles.rainContainer}>
        <Text style={styles.rainIcon}>💧</Text>
        <Text style={styles.rainText}>{hour.chance_of_rain}%</Text>
      </View>
    </Animated.View>
  );
};

interface HourlyForecastSectionProps {
  hours: HourlyForecast[];
}

const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ hours }) => {
  const [selectedHour, setSelectedHour] = useState<HourlyForecast | null>(null);
  const uvInfo = selectedHour ? getUVLevel(selectedHour.uv) : null;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🕐</Text>
          <Text style={styles.headerTitle}>DỰ BÁO THEO GIỜ</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {hours.map((hour, index) => (
            <TouchableOpacity
              key={hour.time_epoch}
              activeOpacity={0.75}
              onPress={() => setSelectedHour(hour)}>
              <HourlyCard
                hour={hour}
                index={index}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={selectedHour !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedHour(null)}>
        {selectedHour && uvInfo ? (
          <ScrollView contentContainerStyle={styles.modalOverlay}>
            <View style={styles.detailCard}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedHour(null)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.detailDate}>
                {formatFullDate(selectedHour.time.slice(0, 10))}
              </Text>
              <Text style={styles.detailTime}>{formatHour(selectedHour.time)}</Text>
              <Text style={styles.detailCondition}>
                {getWeatherEmoji(selectedHour.condition.code, selectedHour.is_day)}  {selectedHour.condition.text}
              </Text>
              <Text style={styles.detailTemp}>{formatTemp(selectedHour.temp_c)}</Text>
              <Text style={styles.detailFeelsLike}>
                Cảm giác như {formatTemp(selectedHour.feelslike_c)}
              </Text>
              <View style={styles.detailGrid}>
                <DetailMetric label="Độ ẩm" value={`${selectedHour.humidity}%`} />
                <DetailMetric label="Khả năng mưa" value={`${selectedHour.chance_of_rain}%`} />
                <DetailMetric label="Lượng mưa" value={`${selectedHour.precip_mm} mm`} />
                <DetailMetric label="Gió" value={`${Math.round(selectedHour.wind_kph)} km/h ${getWindDirection(selectedHour.wind_degree)}`} />
                <DetailMetric label="Chỉ số UV" value={`${selectedHour.uv} - ${uvInfo.label}`} />
                <DetailMetric label="Áp suất" value={`${selectedHour.pressure_mb} mb`} />
                <DetailMetric label="Tầm nhìn" value={`${selectedHour.vis_km} km (${getVisibilityLabel(selectedHour.vis_km)})`} />
              </View>
            </View>
          </ScrollView>
        ) : null}
      </Modal>
    </>
  );
};

const DetailMetric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailMetric}>
    <Text style={styles.detailMetricLabel}>{label}</Text>
    <Text style={styles.detailMetricValue}>{value}</Text>
  </View>
);

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
  scrollContent: {
    paddingRight: SPACING.sm,
  },
  hourCard: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SPACING.sm,
    marginRight: 10,
    borderRadius: 20,
    minWidth: 74,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hourTime: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  hourEmoji: {
    fontSize: 28,
    marginVertical: SPACING.xs,
  },
  hourTemp: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  rainIcon: {
    fontSize: 10,
  },
  rainText: {
    color: COLORS.rainy,
    fontSize: SIZES.xs,
    marginLeft: 2,
  },
  modalOverlay: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.base,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  detailCard: {
    backgroundColor: COLORS.gradientStart,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: SPACING.xs,
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.lg,
  },
  detailDate: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    textAlign: 'center',
  },
  detailTime: {
    color: COLORS.white,
    fontSize: SIZES.xxl,
    fontWeight: '700',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  detailCondition: {
    color: COLORS.textSecondary,
    fontSize: SIZES.base,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  detailTemp: {
    color: COLORS.white,
    fontSize: 56,
    fontWeight: '200',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  detailFeelsLike: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  detailMetric: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    flexBasis: '48%',
    flexGrow: 1,
    padding: SPACING.md,
  },
  detailMetricLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
  },
  detailMetricValue: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
});

export default HourlyForecastSection;
