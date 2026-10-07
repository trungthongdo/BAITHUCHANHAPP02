import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  getWeatherEmoji,
  formatTemp,
  formatFullDate,
  getUVLevel,
  getWeatherGradient,
} from '../utils/weatherHelpers';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

const DetailItem: React.FC<{
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
}> = ({ icon, label, value, subValue, color }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, color ? { color } : {}]}>{value}</Text>
      {subValue ? <Text style={styles.detailSubValue}>{subValue}</Text> : null}
    </View>
  </View>
);

const DayDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'DayDetail'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DayDetail'>>();
  const { day } = route.params;

  const gradient = getWeatherGradient(day.day.condition.code, 1);
  const uvInfo = getUVLevel(day.day.uv);

  return (
    <View style={[styles.container, { backgroundColor: gradient[0] }]}>
      <StatusBar barStyle="light-content" />

      {/* Atmospheric Linear Gradient Background */}
      <LinearGradient
        colors={gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết thời tiết</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Info */}
        <View style={styles.mainCard}>
          <Text style={styles.dateText}>{formatFullDate(day.date)}</Text>
          <Text style={styles.weatherEmoji}>
            {getWeatherEmoji(day.day.condition.code, 1)}
          </Text>
          <Text style={styles.conditionText}>{day.day.condition.text}</Text>

          <View style={styles.tempRow}>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>Cao nhất</Text>
              <Text style={[styles.tempValue, styles.maxTempValue]}>
                {formatTemp(day.day.maxtemp_c)}
              </Text>
            </View>
            <View style={styles.tempDivider} />
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>Trung bình</Text>
              <Text style={styles.tempValue}>
                {formatTemp(day.day.avgtemp_c)}
              </Text>
            </View>
            <View style={styles.tempDivider} />
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>Thấp nhất</Text>
              <Text style={[styles.tempValue, styles.minTempValue]}>
                {formatTemp(day.day.mintemp_c)}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>📊 Thông tin chi tiết</Text>
        </View>

        <View style={styles.detailsCard}>
          <DetailItem
            icon="💧"
            label="Độ ẩm trung bình"
            value={`${day.day.avghumidity}%`}
            subValue={day.day.avghumidity > 80 ? 'Độ ẩm cao' : 'Bình thường'}
          />
          <View style={styles.divider} />
          <DetailItem
            icon="🌧️"
            label="Khả năng mưa"
            value={`${day.day.daily_chance_of_rain}%`}
            subValue={`${day.day.totalprecip_mm} mm`}
          />
          <View style={styles.divider} />
          <DetailItem
            icon="💨"
            label="Tốc độ gió tối đa"
            value={`${Math.round(day.day.maxwind_kph)} km/h`}
          />
          <View style={styles.divider} />
          <DetailItem
            icon="☀️"
            label="Chỉ số UV"
            value={`${day.day.uv} - ${uvInfo.label}`}
            color={uvInfo.color}
          />
        </View>

        {/* Astronomy */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>🌟 Thiên văn học</Text>
        </View>

        <View style={styles.astroCard}>
          <View style={styles.astroRow}>
            <View style={styles.astroItem}>
              <Text style={styles.astroEmoji}>🌅</Text>
              <Text style={styles.astroLabel}>Bình minh</Text>
              <Text style={styles.astroTime}>{day.astro.sunrise}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroEmoji}>🌇</Text>
              <Text style={styles.astroLabel}>Hoàng hôn</Text>
              <Text style={styles.astroTime}>{day.astro.sunset}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.astroRow}>
            <View style={styles.astroItem}>
              <Text style={styles.astroEmoji}>🌕</Text>
              <Text style={styles.astroLabel}>Trăng mọc</Text>
              <Text style={styles.astroTime}>{day.astro.moonrise}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroEmoji}>🌑</Text>
              <Text style={styles.astroLabel}>Trăng lặn</Text>
              <Text style={styles.astroTime}>{day.astro.moonset}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.moonPhaseRow}>
            <Text style={styles.moonPhaseIcon}>🌙</Text>
            <Text style={styles.astroLabel}>Pha mặt trăng: </Text>
            <Text style={styles.moonPhaseText}>{day.astro.moon_phase}</Text>
          </View>
        </View>

        {/* Hourly breakdown */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>🕐 Dự báo theo giờ</Text>
        </View>

        <View style={styles.hourlyCard}>
          {day.hour
            .filter((_, i) => i % 3 === 0)
            .map(hour => (
              <View key={hour.time_epoch} style={styles.hourRow}>
                <Text style={styles.hourTime}>
                  {hour.time.slice(11, 16)}
                </Text>
                <Text style={styles.hourEmoji}>
                  {getWeatherEmoji(hour.condition.code, hour.is_day)}
                </Text>
                <Text style={styles.hourCondition} numberOfLines={1}>
                  {hour.condition.text}
                </Text>
                <Text style={styles.hourTemp}>{formatTemp(hour.temp_c)}</Text>
                {hour.chance_of_rain > 0 && (
                  <Text style={styles.hourRain}>💧{hour.chance_of_rain}%</Text>
                )}
              </View>
            ))}
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 50,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  mainCard: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginBottom: SPACING.md,
  },
  weatherEmoji: {
    fontSize: 80,
    marginBottom: SPACING.sm,
  },
  conditionText: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  tempRow: {
    flexDirection: 'row',
    width: '100%',
  },
  tempItem: {
    flex: 1,
    alignItems: 'center',
  },
  tempDivider: {
    width: 1,
    backgroundColor: COLORS.cardBorder,
  },
  tempLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginBottom: SPACING.xs,
  },
  tempValue: {
    color: COLORS.white,
    fontSize: SIZES.xxl,
    fontWeight: '700',
  },
  maxTempValue: {
    color: '#ff7043',
  },
  minTempValue: {
    color: '#64b5f6',
  },
  sectionTitle: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  sectionTitleText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
    width: 36,
    textAlign: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginBottom: 2,
  },
  detailValue: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  detailSubValue: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: SPACING.base,
  },
  astroCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.base,
  },
  astroRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
  },
  astroItem: {
    flex: 1,
    alignItems: 'center',
  },
  astroEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  astroLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginBottom: 4,
  },
  astroTime: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  moonPhaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.md,
    justifyContent: 'center',
  },
  moonPhaseIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  moonPhaseText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  hourlyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  hourTime: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    width: 55,
    fontWeight: '500',
  },
  hourEmoji: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  hourCondition: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginHorizontal: SPACING.sm,
  },
  hourTemp: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  hourRain: {
    color: COLORS.rainy,
    fontSize: SIZES.xs,
    width: 45,
    textAlign: 'right',
  },
  footer: {
    height: SPACING.xxxl,
  },
});

export default DayDetailScreen;
