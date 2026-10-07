import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Đang tải dữ liệu thời tiết...',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌤️</Text>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );
};

interface EmptyScreenProps {
  message: string;
  onRetry: () => void;
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.errorEmoji}>🌦️</Text>
    <Text style={styles.errorTitle}>Chưa có dữ liệu</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryText}>Tải lại</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.gradientStart,
  },
  emoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  spinner: {
    marginBottom: SPACING.lg,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: SIZES.base,
    textAlign: 'center',
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    color: COLORS.textSecondary,
    fontSize: SIZES.base,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
  },
  retryText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
});
