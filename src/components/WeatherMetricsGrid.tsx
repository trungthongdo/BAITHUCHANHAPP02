import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { getUVLevel, getWindDirection, getVisibilityLabel } from '../utils/weatherHelpers';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subtitle, color }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
    <Text style={[styles.cardValue, color ? { color } : {}]}>{value}</Text>
    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
  </View>
);

interface WeatherMetricsGridProps {
  current: {
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    wind_degree: number;
    pressure_mb: number;
    vis_km: number;
    uv: number;
    precip_mm: number;
    feelslike_c: number;
  };
}

const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ current }) => {
  const uvInfo = getUVLevel(current.uv);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📊</Text>
        <Text style={styles.headerTitle}>CHỈ SỐ THỜI TIẾT</Text>
      </View>
      <View style={styles.grid}>
        <MetricCard
          icon="💧"
          label="Độ ẩm"
          value={`${current.humidity}%`}
          subtitle={current.humidity > 80 ? 'Cao' : current.humidity < 40 ? 'Thấp' : 'Trung bình'}
        />
        <MetricCard
          icon="💨"
          label="Gió"
          value={`${Math.round(current.wind_kph)} km/h`}
          subtitle={`Hướng ${getWindDirection(current.wind_degree)} (${current.wind_dir})`}
        />
        <MetricCard
          icon="🌡️"
          label="Cảm giác như"
          value={`${Math.round(current.feelslike_c)}°C`}
        />
        <MetricCard
          icon="☀️"
          label="Chỉ số UV"
          value={`${current.uv}`}
          subtitle={uvInfo.label}
          color={uvInfo.color}
        />
        <MetricCard
          icon="🌂"
          label="Lượng mưa"
          value={`${current.precip_mm} mm`}
        />
        <MetricCard
          icon="🔭"
          label="Tầm nhìn"
          value={`${current.vis_km} km`}
          subtitle={getVisibilityLabel(current.vis_km)}
        />
        <MetricCard
          icon="📍"
          label="Áp suất"
          value={`${current.pressure_mb} mb`}
        />
        <MetricCard
          icon="🧭"
          label="Hướng gió"
          value={getWindDirection(current.wind_degree)}
          subtitle={`${current.wind_degree}°`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    width: '48.2%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  cardLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default WeatherMetricsGrid;
