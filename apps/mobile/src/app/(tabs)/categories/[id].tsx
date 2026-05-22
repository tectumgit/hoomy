import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { SupplierSection } from '@/components/home/SupplierSection';
import { useSuppliers } from '@/hooks/use-api';
import { mockCategories } from '@/mocks/homeData';
import { Supplier } from '@hoomy/shared';

type SortOption = 'ranking' | 'rating' | 'distance' | 'minOrder';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: suppliers, loading } = useSuppliers();

  // Состояние сортировки и фильтрации
  const [sortBy, setSortBy] = useState<SortOption>('ranking');
  const [minOrderFilter, setMinOrderFilter] = useState<number | null>(null); // лимит в копейках

  // Динамически получаем данные о категории
  const category = useMemo(() => {
    return mockCategories.find((c) => c.id === id);
  }, [id]);

  const categoryName = category ? category.name : 'Категория';

  // Функция расчета коммерческого скора ранжирования
  const getRankingScore = (supplier: Supplier) => {
    const distance = supplier.distanceKm || 10;
    const rating = supplier.rating || 4.0;
    const popularity = supplier.popularityScore || 50;
    const boostLvl = supplier.boostLevel || 0;

    // 1. Базовый скор (Base Score)
    // Дистанция: 100 баллов минус 10 баллов за каждые 5 км. Максимум 100, минимум 0.
    const distanceScore = Math.max(0, Math.min(100, 100 - (distance / 5) * 10));
    
    // Рейтинг: сдвигаем по шкале [3..5] в [0..100]. Если рейтинг < 3, то 0.
    const ratingScore = rating < 3 ? 0 : (rating - 3) * 50;
    
    // Взвешенная сумма базового скора
    const baseScore = distanceScore * 0.4 + ratingScore * 0.4 + popularity * 0.2;

    // 2. Коэффициент безопасности M_safeguard (зависит от отзывов/качества)
    let mSafeguard = 1.0;
    if (rating >= 4.5) {
      mSafeguard = 1.0;
    } else if (rating >= 4.0) {
      mSafeguard = 0.8;
    } else if (rating >= 3.5) {
      mSafeguard = 0.5;
    } else {
      mSafeguard = 0.1; // Почти полностью нейтрализует буст при плохом качестве
    }

    // 3. Множитель буста (Boost)
    let boostMultiplier = 1.0;
    if (boostLvl === 1) boostMultiplier = 1.2; // +20%
    else if (boostLvl === 2) boostMultiplier = 1.5; // +50%
    else if (boostLvl === 3) boostMultiplier = 2.0; // +100%

    // Итоговый скор
    const finalScore = baseScore * mSafeguard * boostMultiplier;

    return {
      finalScore: Math.round(finalScore * 10) / 10,
      distanceScore,
      ratingScore,
      baseScore,
      mSafeguard,
      boostMultiplier,
    };
  };

  // Фильтруем и сортируем список поставщиков
  const processedSuppliers = useMemo(() => {
    if (!suppliers) return [];

    // Шаг 1: Фильтрация по категории
    let list = id 
      ? suppliers.filter((s) => s.categories.includes(id))
      : suppliers;

    // Шаг 2: Фильтрация по минимальному заказу
    if (minOrderFilter !== null) {
      list = list.filter((s) => s.minOrderAmountKopecks <= minOrderFilter);
    }

    // Шаг 3: Сортировка
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      if (sortBy === 'minOrder') {
        return a.minOrderAmountKopecks - b.minOrderAmountKopecks;
      }
      // Сортировка по умолчанию (умное коммерческое ранжирование)
      const scoreA = getRankingScore(a).finalScore;
      const scoreB = getRankingScore(b).finalScore;
      return scoreB - scoreA;
    });
  }, [suppliers, id, sortBy, minOrderFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CategoryHeader title={categoryName} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6500" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Секция сортировки */}
          <View style={styles.filterSection}>
            <ThemedText style={styles.sectionLabel}>Сортировка:</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'ranking' && styles.filterChipActive]}
                onPress={() => setSortBy('ranking')}
              >
                <Feather name="zap" size={12} color={sortBy === 'ranking' ? '#FFF' : '#FF6500'} style={styles.chipIcon} />
                <ThemedText style={[styles.filterChipText, sortBy === 'ranking' && styles.filterChipTextActive]}>
                  Умный рейтинг
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'rating' && styles.filterChipActive]}
                onPress={() => setSortBy('rating')}
              >
                <Feather name="star" size={12} color={sortBy === 'rating' ? '#FFF' : '#888'} style={styles.chipIcon} />
                <ThemedText style={[styles.filterChipText, sortBy === 'rating' && styles.filterChipTextActive]}>
                  По оценке
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'distance' && styles.filterChipActive]}
                onPress={() => setSortBy('distance')}
              >
                <Feather name="map-pin" size={12} color={sortBy === 'distance' ? '#FFF' : '#888'} style={styles.chipIcon} />
                <ThemedText style={[styles.filterChipText, sortBy === 'distance' && styles.filterChipTextActive]}>
                  Поближе
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'minOrder' && styles.filterChipActive]}
                onPress={() => setSortBy('minOrder')}
              >
                <Feather name="shopping-bag" size={12} color={sortBy === 'minOrder' ? '#FFF' : '#888'} style={styles.chipIcon} />
                <ThemedText style={[styles.filterChipText, sortBy === 'minOrder' && styles.filterChipTextActive]}>
                  Мин. заказ
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Секция фильтров */}
          <View style={[styles.filterSection, { marginTop: 0 }]}>
            <ThemedText style={styles.sectionLabel}>Минимальный заказ:</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              <TouchableOpacity 
                style={[styles.filterChip, minOrderFilter === null && styles.filterChipActive]}
                onPress={() => setMinOrderFilter(null)}
              >
                <ThemedText style={[styles.filterChipText, minOrderFilter === null && styles.filterChipTextActive]}>
                  Все
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterChip, minOrderFilter === 200000 && styles.filterChipActive]}
                onPress={() => setMinOrderFilter(200000)}
              >
                <ThemedText style={[styles.filterChipText, minOrderFilter === 200000 && styles.filterChipTextActive]}>
                  До 2 000 ₽
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterChip, minOrderFilter === 400000 && styles.filterChipActive]}
                onPress={() => setMinOrderFilter(400000)}
              >
                <ThemedText style={[styles.filterChipText, minOrderFilter === 400000 && styles.filterChipTextActive]}>
                  До 4 000 ₽
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Диагностическая плашка формулы ранжирования (показывается только в режиме "Умный рейтинг") */}
          {sortBy === 'ranking' && (
            <View style={styles.debugAlert}>
              <Feather name="info" size={16} color="#FF6500" style={{ marginRight: 8 }} />
              <ThemedText style={styles.debugAlertText}>
                Включена умная сортировка. Рейтинг поставщика выступает в качестве защиты от накруток буста (низкокачественные поставщики пессимизируются).
              </ThemedText>
            </View>
          )}

          {/* Список поставщиков */}
          {processedSuppliers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="frown" size={48} color="#CCC" />
              <ThemedText style={styles.emptyText}>Нет подходящих поставщиков</ThemedText>
              <ThemedText style={styles.emptySub}>Попробуйте сбросить фильтры по минимальному заказу</ThemedText>
            </View>
          ) : (
            processedSuppliers.map((supplier) => {
              const scoreDetails = getRankingScore(supplier);
              return (
                <View key={supplier.id} style={styles.supplierWrapper}>
                  {/* Диагностика ранжирования */}
                  <View style={styles.rankingIndicator}>
                    <ThemedText style={styles.indicatorText}>
                      Скор: <ThemedText style={styles.indicatorBold}>{scoreDetails.finalScore}</ThemedText>
                      {supplier.boostLevel && supplier.boostLevel > 0 ? ` · Буст: Lvl ${supplier.boostLevel} (x${scoreDetails.boostMultiplier})` : ''}
                      {` · Дистанция: ${supplier.distanceKm || '?'} км`}
                      {` · Рейтинг: ${supplier.rating}`}
                    </ThemedText>
                    {supplier.rating < 4.0 && (
                      <View style={styles.penaltyBadge}>
                        <ThemedText style={styles.penaltyText}>Штраф качества (x{scoreDetails.mSafeguard})</ThemedText>
                      </View>
                    )}
                  </View>
                  
                  <SupplierSection supplier={supplier} />
                </View>
              );
            })
          )}

          {/* Отступ снизу */}
          <View style={{ height: 40 }} />

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  scrollContent: { paddingBottom: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  filterRow: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E2D2',
  },
  filterChipActive: {
    backgroundColor: '#FF6500',
    borderColor: '#FF6500',
  },
  chipIcon: {
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  debugAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFF2EB',
    borderWidth: 1,
    borderColor: '#FFD3B5',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  debugAlertText: {
    fontSize: 11,
    color: '#FF6500',
    flex: 1,
    lineHeight: 15,
  },
  supplierWrapper: {
    marginBottom: 16,
  },
  rankingIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0EFEA',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  indicatorText: {
    fontSize: 10,
    color: '#666',
  },
  indicatorBold: {
    fontWeight: 'bold',
    color: '#FF6500',
  },
  penaltyBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  penaltyText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
