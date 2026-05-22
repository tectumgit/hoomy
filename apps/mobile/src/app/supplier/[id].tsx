import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductCard } from '@/components/home/ProductCard';
import { useSupplier, useProducts } from '@/hooks/use-api';
import { useCart } from '@/hooks/use-cart';
import { mockCategories } from '@/mocks/homeData';

export default function SupplierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items: cartItems } = useCart();

  const { data: supplier, loading: supplierLoading, error: supplierError } = useSupplier(id || '');
  const { data: products, loading: productsLoading } = useProducts(id || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const isLoading = supplierLoading || productsLoading;

  // Рассчитываем динамические категории поставщика (на основе его товаров)
  const supplierCategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const catIds = Array.from(new Set(products.map(p => p.categoryId)));
    return mockCategories.filter(cat => catIds.includes(cat.id));
  }, [products]);

  // Фильтруем товары по поиску и категориям
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryId]);

  // Считаем сумму товаров именно этого поставщика в корзине
  const currentSupplierCartItems = useMemo(() => {
    return cartItems.filter(item => item.supplierId === id);
  }, [cartItems, id]);

  const supplierTotalKopecks = useMemo(() => {
    return currentSupplierCartItems.reduce((acc, item) => acc + item.unitPriceKopecks * item.quantity, 0);
  }, [currentSupplierCartItems]);

  const minOrderKopecks = supplier?.minOrderAmountKopecks || 0;
  const isMinOrderMet = supplierTotalKopecks >= minOrderKopecks;
  const diffKopecks = minOrderKopecks - supplierTotalKopecks;

  const formatPrice = (kopecks: number) => (kopecks / 100).toLocaleString('ru-RU') + ' ₽';

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6500" />
      </ThemedView>
    );
  }

  if (supplierError || !supplier) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Поставщик не найден</ThemedText>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backBtnText}>Назад на главную</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const freeDeliveryFromRubles = supplier.freeDeliveryFromKopecks 
    ? (supplier.freeDeliveryFromKopecks / 100).toLocaleString('ru-RU')
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Шапка экрана */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backHeaderBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {supplier.name}
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item as any} style={styles.gridProductCard} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.supplierCard}>
            {/* Детали поставщика */}
            <View style={styles.supplierDetail}>
              <View style={styles.logoContainer}>
                <ThemedText style={styles.logoEmoji}>{supplier.logoUrl}</ThemedText>
              </View>
              <View style={styles.supplierInfo}>
                <View style={styles.ratingRow}>
                  <Feather name="star" size={14} color="#FF6500" />
                  <ThemedText style={styles.ratingVal}>{supplier.rating}</ThemedText>
                  <ThemedText style={styles.reviewsCount}>
                    ({supplier.reviewsCount} отзывов)
                  </ThemedText>
                </View>
                <ThemedText style={styles.supplierDesc}>{supplier.description}</ThemedText>
              </View>
            </View>

            {/* Доставка и Мин заказ */}
            <View style={styles.deliveryBlock}>
              <View style={styles.deliveryItem}>
                <Feather name="truck" size={16} color="#FF6500" />
                <View style={styles.deliveryTextCol}>
                  <ThemedText style={styles.deliveryLabel}>Доставка</ThemedText>
                  <ThemedText style={styles.deliveryValue}>
                    {freeDeliveryFromRubles ? `Бесплатно от ${freeDeliveryFromRubles} ₽` : 'Доставка платная'}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.deliveryDivider} />
              <View style={styles.deliveryItem}>
                <Feather name="shopping-bag" size={16} color="#FF6500" />
                <View style={styles.deliveryTextCol}>
                  <ThemedText style={styles.deliveryLabel}>Мин. заказ</ThemedText>
                  <ThemedText style={styles.deliveryValue}>
                    {(supplier.minOrderAmountKopecks / 100).toLocaleString('ru-RU')} ₽
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Поисковая строка */}
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск товаров у поставщика..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x" size={18} color="#888" />
                </TouchableOpacity>
              )}
            </View>

            {/* Категории поставщика */}
            <View style={styles.categoriesSection}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[{ id: 'all', name: 'Все товары' }, ...supplierCategories]}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.categoriesList}
                renderItem={({ item }) => {
                  const isActive = selectedCategoryId === item.id;
                  return (
                    <TouchableOpacity
                      style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                      onPress={() => setSelectedCategoryId(item.id)}
                    >
                      <ThemedText
                        style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}
                      >
                        {item.name.replace('\n', ' ')}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="info" size={48} color="#CCCCCC" />
            <ThemedText style={styles.emptyText}>Товары не найдены</ThemedText>
            <ThemedText style={styles.emptySub}>
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </ThemedText>
          </View>
        }
      />

      {/* Плавающая панель корзины */}
      {currentSupplierCartItems.length > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartBarInfo}>
            <ThemedText style={styles.cartCount}>
              В корзине {currentSupplierCartItems.length} поз. на {formatPrice(supplierTotalKopecks)}
            </ThemedText>
            {!isMinOrderMet ? (
              <ThemedText style={styles.cartMinWarning}>
                Добавьте еще {formatPrice(diffKopecks)} до минимума
              </ThemedText>
            ) : (
              <ThemedText style={styles.cartMinSuccess}>
                Минимальный заказ набран!
              </ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={[styles.cartGoBtn, !isMinOrderMet && styles.cartGoBtnDisabled]}
            disabled={!isMinOrderMet}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <ThemedText style={styles.cartGoBtnText}>В корзину</ThemedText>
            <Feather name="arrow-right" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#FF6500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  backHeaderBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 100, // Отступ снизу для плавающего таб-бара корзины
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  gridProductCard: {
    flex: 1,
    width: 'auto',
    marginRight: 0,
    marginHorizontal: 6,
  },
  supplierCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  supplierDetail: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    marginRight: 16,
  },
  logoEmoji: {
    fontSize: 32,
  },
  supplierInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
    marginRight: 6,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#888',
  },
  supplierDesc: {
    fontSize: 12,
    color: '#666',
  },
  deliveryBlock: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  deliveryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  deliveryTextCol: {
    marginLeft: 8,
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryDivider: {
    width: 1,
    backgroundColor: '#E8E2D2',
    marginHorizontal: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
  },
  categoriesSection: {
    marginBottom: 4,
  },
  categoriesList: {
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
  },
  categoryTabActive: {
    backgroundColor: '#FF6500',
    borderColor: '#FF6500',
  },
  categoryTabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
    lineHeight: 18,
  },
  cartBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  cartBarInfo: {
    flex: 1,
    marginRight: 16,
  },
  cartCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  cartMinWarning: {
    fontSize: 12,
    color: '#FF6500',
    fontWeight: '600',
  },
  cartMinSuccess: {
    fontSize: 12,
    color: '#4A7D00',
    fontWeight: '600',
  },
  cartGoBtn: {
    backgroundColor: '#FF6500',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cartGoBtnDisabled: {
    backgroundColor: '#FFD1B3',
  },
  cartGoBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
