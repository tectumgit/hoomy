import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductCard } from '@/components/home/ProductCard';
import { useAllProducts } from '@/hooks/use-api';
import { MockProduct } from '@/mocks/homeData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2; // Расчет ширины для 2-х колонок с отступами

const CATEGORIES = [
  { id: 'all', name: 'Все акции', emoji: '🔥' },
  { id: 'cat_1', name: 'Овощи', emoji: '🥬' },
  { id: 'cat_2', name: 'Фрукты', emoji: '🍊' },
  { id: 'cat_3', name: 'Молочка', emoji: '🧀' },
  { id: 'cat_4', name: 'Мясо', emoji: '🥩' },
];

export default function DiscountsScreen() {
  const { data: allProducts, loading } = useAllProducts();

  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Модифицируем товары, чтобы гарантировать наличие скидочных цен на демонстрационном стенде
  const discountedProducts = useMemo(() => {
    if (!allProducts) return [];

    return allProducts.map((prod) => {
      // Если у товара уже есть скидка - оставляем.
      if (prod.discountPriceKopecks && prod.discountPriceKopecks < prod.priceKopecks) {
        return prod;
      }
      
      // Для демонстрации 2026-акций добавим скидку на определенные товары
      const demoDiscountIds = ['prod_2', 'prod_4', 'prod_8', 'prod_10', 'prod_12'];
      if (demoDiscountIds.includes(prod.id)) {
        return {
          ...prod,
          discountPriceKopecks: Math.round(prod.priceKopecks * 0.8), // 20% скидка
        };
      }
      
      return prod;
    }).filter(prod => !!prod.discountPriceKopecks && prod.discountPriceKopecks < prod.priceKopecks);
  }, [allProducts]);

  // Фильтрация по категории и строке поиска
  const filteredProducts = useMemo(() => {
    return discountedProducts.filter((prod) => {
      const matchesCategory = selectedCat === 'all' || prod.categoryId === selectedCat;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [discountedProducts, selectedCat, searchQuery]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Хедер */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.headerTitle}>Скидки месяца</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Крупный опт дешевле</ThemedText>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Поиск */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск по скидкам..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Категории-вкладки */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isActive = selectedCat === item.id;
              return (
                <TouchableOpacity
                  style={[styles.categoryBadge, isActive && styles.categoryBadgeActive]}
                  onPress={() => setSelectedCat(item.id)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.categoryEmoji}>{item.emoji}</ThemedText>
                  <ThemedText style={[styles.categoryName, isActive && styles.categoryNameActive]}>
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Сетка товаров */}
        <FlatList
          data={filteredProducts as MockProduct[]}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyIcon}>🛍️</ThemedText>
              <ThemedText style={styles.emptyTitle}>Акций не найдено</ThemedText>
              <ThemedText style={styles.emptyText}>
                Попробуйте выбрать другую категорию или изменить поисковый запрос
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              style={styles.card}
            />
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoriesSection: {
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryBadgeActive: {
    backgroundColor: '#FFF2EB',
    borderColor: '#FFD9C4',
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  categoryNameActive: {
    color: '#FF6500',
    fontWeight: 'bold',
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 0, // Убираем боковой отступ, так как gridRow делает justify-between
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
});
