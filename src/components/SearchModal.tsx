import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { searchLocations } from '../services/weatherService';
import { LocationSearchResult } from '../types/weather';
import { COLORS, SIZES, SPACING } from '../constants/theme';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose, onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchQuery = query.trim();
    if (searchQuery.length < 2) {
      setResults([]);
      setError('');
      setSearching(false);
      return;
    }

    let active = true;
    const timeout = setTimeout(async () => {
      setSearching(true);
      setError('');
      try {
        const data = await searchLocations(searchQuery);
        if (active) {
          setResults(data);
        }
      } catch {
        if (active) {
          setError('Không thể tìm kiếm. Vui lòng kiểm tra kết nối và thử lại.');
        }
      } finally {
        if (active) {
          setSearching(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSelect = (location: LocationSearchResult) => {
    onSelectCity(location.name);
    setQuery('');
    setResults([]);
    onClose();
  };

  const popularCities = [
    { name: 'Hà Nội', query: 'Hanoi' },
    { name: 'TP. Hồ Chí Minh', query: 'Ho Chi Minh City' },
    { name: 'Đà Nẵng', query: 'Da Nang' },
    { name: 'Huế', query: 'Hue' },
    { name: 'Nha Trang', query: 'Nha Trang' },
    { name: 'Đà Lạt', query: 'Da Lat' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Text style={styles.title}>Tìm kiếm địa điểm</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchPrefix}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập tên thành phố..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {searching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        )}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {query.length === 0 ? (
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>🏙️ Thành phố phổ biến</Text>
            <View style={styles.popularGrid}>
              {popularCities.map(city => (
                <TouchableOpacity
                  key={city.query}
                  style={styles.popularChip}
                  onPress={() => {
                    onSelectCity(city.query);
                    onClose();
                  }}>
                  <Text style={styles.popularChipText}>{city.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelect(item)}>
                <Text style={styles.resultIcon}>📍</Text>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultDetail}>
                    {item.region ? `${item.region}, ` : ''}{item.country}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !searching && query.length > 1 ? (
                <Text style={styles.emptyText}>Không tìm thấy địa điểm nào</Text>
              ) : undefined
            }
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090e1d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: (StatusBar.currentHeight || 24) + SPACING.base,
    paddingBottom: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: SPACING.base,
    borderRadius: 18,
    paddingHorizontal: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  searchPrefix: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.base,
    paddingVertical: 14,
  },
  clearButton: {
    color: COLORS.textMuted,
    fontSize: SIZES.md,
    padding: SPACING.xs,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    padding: SPACING.base,
  },
  popularSection: {
    padding: SPACING.base,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  popularChipText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  resultDetail: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});

export default SearchModal;
