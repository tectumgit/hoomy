import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useCart } from '@/hooks/use-cart';
import { mockCategories, mockProducts, mockSuppliers } from '@/mocks/homeData';

const HISTORY_STORAGE_KEY = 'hoomy_search_history';
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// In-memory fallback for native platforms (iOS/Android)
let nativeHistoryMemory: string[] = [];

const loadHistory = (): string[] => {
  if (isWeb) {
    try {
      const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to load search history', e);
      return [];
    }
  }
  return nativeHistoryMemory;
};

const saveHistory = (history: string[]) => {
  if (isWeb) {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  } else {
    nativeHistoryMemory = history;
  }
};

const POPULAR_QUERIES = [
  'Апельсины',
  'Молоко 2,5%',
  'Говядина',
  'Фруктовый двор',
  'Огурцы',
  'Зелень',
];

const getUnitLabel = (unit: string) => {
  const map: Record<string, string> = {
    kg: 'кг',
    g: 'г',
    l: 'л',
    ml: 'мл',
    pcs: 'шт',
    pack: 'уп',
    box: 'кор',
    crate: 'ящ',
    bag: 'меш',
    set: 'наб'
  };
  return map[unit] || unit;
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const { items: cartItems, addToCart, updateQuantity } = useCart();
  const inputRef = useRef<TextInput>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSaveQuery = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      const nextHistory = [trimmed, ...filtered].slice(0, 10);
      saveHistory(nextHistory);
      return nextHistory;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const handleRemoveHistoryItem = (itemToRemove: string) => {
    setHistory((prev) => {
      const nextHistory = prev.filter((q) => q !== itemToRemove);
      saveHistory(nextHistory);
      return nextHistory;
    });
  };

  const handleTagPress = (tag: string) => {
    setQuery(tag);
    handleSaveQuery(tag);
    inputRef.current?.blur();
  };

  const handleClearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Filtering lists based on input
  const normalizedQuery = query.toLowerCase().trim();

  const filteredCategories = normalizedQuery
    ? mockCategories.filter((c) => c.name.toLowerCase().includes(normalizedQuery))
    : [];

  const filteredSuppliers = normalizedQuery
    ? mockSuppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(normalizedQuery) ||
          (s.description && s.description.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const filteredProducts = normalizedQuery
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          (p.description && p.description.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const hasResults =
    filteredCategories.length > 0 ||
    filteredSuppliers.length > 0 ||
    filteredProducts.length > 0;

  const navigateToCategory = (catId: string) => {
    handleSaveQuery(query);
    router.push({ pathname: '/(tabs)/categories/[id]', params: { id: catId } } as any);
  };

  const navigateToSupplier = (supplierId: string) => {
    handleSaveQuery(query);
    router.push(`/supplier/${supplierId}`);
  };

  const navigateToProduct = (productId: string) => {
    handleSaveQuery(query);
    router.push({ pathname: '/product/[id]', params: { id: productId } } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with search input */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Поиск товаров, поставщиков..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => handleSaveQuery(query)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClearInput}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Feather name="x" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main content scroll area */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {normalizedQuery === '' ? (
          /* Empty state view: History and Popular Tags */
          <View>
            {/* Search History */}
            {history.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <ThemedText style={styles.sectionTitle}>История поиска</ThemedText>
                  <TouchableOpacity
                    onPress={handleClearHistory}
                    style={styles.clearHistoryBtn}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={styles.clearHistoryText}>Очистить</ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={styles.historyList}>
                  {history.map((item, idx) => (
                    <View key={`${item}-${idx}`} style={styles.historyItemRow}>
                      <TouchableOpacity
                        style={styles.historyItemTextBtn}
                        onPress={() => handleTagPress(item)}
                        activeOpacity={0.6}
                      >
                        <Feather name="clock" size={16} color="#999" style={styles.historyIcon} />
                        <ThemedText style={styles.historyText} numberOfLines={1}>
                          {item}
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveHistoryItem(item)}
                        style={styles.removeHistoryItemBtn}
                        activeOpacity={0.7}
                      >
                        <Feather name="x" size={16} color="#BBB" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Popular queries */}
            <View style={[styles.sectionContainer, history.length === 0 && { marginTop: 8 }]}>
              <ThemedText style={styles.sectionTitle}>Популярные запросы</ThemedText>
              <View style={styles.popularTagsContainer}>
                {POPULAR_QUERIES.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.popularTag}
                    onPress={() => handleTagPress(tag)}
                    activeOpacity={0.8}
                  >
                    <ThemedText style={styles.popularTagText}>{tag}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : hasResults ? (
          /* Search results matching state */
          <View style={styles.resultsContainer}>
            {/* Matching Categories */}
            {filteredCategories.length > 0 && (
              <View style={styles.resultSection}>
                <ThemedText style={styles.resultSectionTitle}>Категории</ThemedText>
                <View style={styles.categoriesList}>
                  {filteredCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      onPress={() => navigateToCategory(category.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.categoryIconContainer}>
                        <ThemedText style={styles.categoryEmoji}>
                          {category.iconEmoji || '📦'}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.categoryName} numberOfLines={1}>
                        {category.name.replace('\n', ' ')}
                      </ThemedText>
                      <Feather name="chevron-right" size={16} color="#CCC" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Matching Suppliers */}
            {filteredSuppliers.length > 0 && (
              <View style={styles.resultSection}>
                <ThemedText style={styles.resultSectionTitle}>Поставщики</ThemedText>
                <View style={styles.suppliersList}>
                  {filteredSuppliers.map((supplier) => (
                    <TouchableOpacity
                      key={supplier.id}
                      style={styles.supplierCard}
                      onPress={() => navigateToSupplier(supplier.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.supplierLogoContainer}>
                        <ThemedText style={styles.supplierLogoEmoji}>
                          {supplier.logoUrl || '🏢'}
                        </ThemedText>
                      </View>
                      <View style={styles.supplierInfo}>
                        <ThemedText style={styles.supplierName} numberOfLines={1}>
                          {supplier.name}
                        </ThemedText>
                        <View style={styles.supplierDetailsRow}>
                          <View style={styles.ratingBadge}>
                            <Feather name="star" size={12} color="#FFB000" />
                            <ThemedText style={styles.ratingText}>
                              {supplier.rating.toFixed(1)}
                            </ThemedText>
                          </View>
                          {supplier.distanceKm !== undefined && (
                            <ThemedText style={styles.supplierDistance}>
                              • {supplier.distanceKm.toFixed(1)} км
                            </ThemedText>
                          )}
                        </View>
                        <ThemedText style={styles.supplierMinOrder} numberOfLines={1}>
                          Мин. заказ: {supplier.minOrderAmountKopecks / 100} ₽
                        </ThemedText>
                      </View>
                      <Feather name="chevron-right" size={16} color="#CCC" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Matching Products */}
            {filteredProducts.length > 0 && (
              <View style={styles.resultSection}>
                <ThemedText style={styles.resultSectionTitle}>Товары</ThemedText>
                <View style={styles.productsList}>
                  {filteredProducts.map((product) => {
                    const cartItem = cartItems.find((i) => i.productId === product.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    const unitLabel = getUnitLabel(product.unit);
                    const hasDiscount =
                      !!product.discountPriceKopecks &&
                      product.discountPriceKopecks < product.priceKopecks;
                    const activePriceKopecks = hasDiscount
                      ? product.discountPriceKopecks!
                      : product.priceKopecks;
                    const activePriceRubles = (activePriceKopecks / 100).toLocaleString('ru-RU');
                    const oldPriceRubles = (product.priceKopecks / 100).toLocaleString('ru-RU');

                    const handleAdd = () => {
                      addToCart({
                        supplierId: product.supplierId,
                        productId: product.id,
                        name: product.name,
                        iconEmoji: product.mockEmoji || '📦',
                        quantity: product.minQuantity,
                        unit: product.unit,
                        unitPriceKopecks: activePriceKopecks,
                      });
                    };

                    const handleIncrease = () => {
                      const newQty = Math.min(qty + product.orderStep, product.stockQuantity);
                      updateQuantity(product.id, newQty);
                    };

                    const handleDecrease = () => {
                      if (qty - product.orderStep < product.minQuantity) {
                        updateQuantity(product.id, 0);
                      } else {
                        updateQuantity(product.id, qty - product.orderStep);
                      }
                    };

                    return (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => navigateToProduct(product.id)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.productEmojiBg}>
                          <ThemedText style={styles.productEmoji}>
                            {product.mockEmoji || '📦'}
                          </ThemedText>
                        </View>
                        <View style={styles.productInfo}>
                          <ThemedText style={styles.productName} numberOfLines={1}>
                            {product.name}
                          </ThemedText>
                          <ThemedText style={styles.productSupplierName} numberOfLines={1}>
                            {product.supplierName || 'Поставщик'}
                          </ThemedText>
                          <ThemedText style={styles.productMinLimit}>
                            Мин. партия: {product.minQuantity} {unitLabel} • Шаг: {product.orderStep} {unitLabel}
                          </ThemedText>
                          <View style={styles.productPriceRow}>
                            <ThemedText style={styles.productPrice}>
                              {activePriceRubles} ₽/{unitLabel}
                            </ThemedText>
                            {hasDiscount && (
                              <ThemedText style={styles.productOldPrice}>
                                {oldPriceRubles} ₽
                              </ThemedText>
                            )}
                          </View>
                        </View>

                        {/* Quantity controls / add button */}
                        <View style={styles.actionsContainer} onStartShouldSetResponder={() => true}>
                          {qty === 0 ? (
                            <TouchableOpacity
                              style={styles.productAddButton}
                              onPress={handleAdd}
                              activeOpacity={0.8}
                            >
                              <Feather name="plus" size={16} color="#FFF" />
                              <ThemedText style={styles.productAddBtnText}>В корзину</ThemedText>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.stepper}>
                              <TouchableOpacity
                                style={styles.stepperSubButton}
                                onPress={handleDecrease}
                                activeOpacity={0.7}
                              >
                                <Feather
                                  name={qty <= product.minQuantity ? 'trash-2' : 'minus'}
                                  size={12}
                                  color="#FFF"
                                />
                              </TouchableOpacity>
                              <ThemedText style={styles.stepperQtyText}>{qty}</ThemedText>
                              <TouchableOpacity
                                style={styles.stepperSubButton}
                                onPress={handleIncrease}
                                activeOpacity={0.7}
                              >
                                <Feather name="plus" size={12} color="#FFF" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        ) : (
          /* Empty / No items found state */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Feather name="search" size={48} color="#CCC" />
            </View>
            <ThemedText style={styles.emptyTitle}>Ничего не найдено</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Попробуйте сформулировать запрос иначе или сбросить фильтры
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 0,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  clearHistoryBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#FF6500',
    fontWeight: '600',
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F8F7F5',
    paddingHorizontal: 16,
    height: 48,
  },
  historyItemTextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    fontSize: 15,
    color: '#444444',
    fontWeight: '500',
  },
  removeHistoryItemBtn: {
    padding: 8,
  },
  popularTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  popularTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE8E3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  popularTagText: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  categoriesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    overflow: 'hidden',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F7F5',
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  suppliersList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    overflow: 'hidden',
  },
  supplierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F7F5',
  },
  supplierLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  supplierLogoEmoji: {
    fontSize: 26,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  supplierDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF6500',
    marginLeft: 3,
  },
  supplierDistance: {
    fontSize: 12,
    color: '#888888',
  },
  supplierMinOrder: {
    fontSize: 12,
    color: '#666666',
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    alignItems: 'center',
  },
  productEmojiBg: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F8F7F5',
  },
  productEmoji: {
    fontSize: 36,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  productSupplierName: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  productMinLimit: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 4,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  productOldPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  productAddButton: {
    backgroundColor: '#FF6500',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  productAddBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6500',
    borderRadius: 20,
    padding: 2,
    gap: 8,
  },
  stepperSubButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperQtyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EFEA',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
