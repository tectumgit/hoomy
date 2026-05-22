import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
  Share,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useCart } from '@/hooks/use-cart';
import { mockProducts, mockSuppliers, MockProduct } from '@/mocks/homeData';

// Включаем поддержку LayoutAnimation на Android для плавных переходов
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

// Получение единиц измерения на русском
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

// Функция генерации детальных характеристик по типу продукта
const getProductDetails = (product: MockProduct) => {
  const defaults = {
    description: product.description || `Свежие ${product.name.toLowerCase()} высокого качества оптом напрямую от надежного поставщика. Продукт прошел строгий фитосанитарный и санитарный контроль, бережно хранится в кондиционируемых помещениях при оптимальной температуре и готов к оперативной отгрузке.`,
    country: 'Россия',
    brand: 'Фермерское хозяйство',
    storageTemp: '+2°C...+6°C',
    shelfLife: '14 дней',
    nutrition: {
      kcal: 45,
      proteins: 1.2,
      fats: 0.5,
      carbs: 9.8,
    }
  };

  // Кастомизация для известных товаров
  const nameLower = product.name.toLowerCase();
  if (nameLower.includes('апельсин')) {
    return {
      description: 'Свежие, сочные отборные апельсины напрямую от локального импортера. Отлично подходят для выжимания свежих фрешей, приготовления десертов и употребления в свежем виде. Проходят ручную калибровку перед каждой отгрузкой партии.',
      country: 'Египет',
      brand: 'Fruit Fresh',
      storageTemp: '+4°C...+8°C',
      shelfLife: '30 дней',
      nutrition: { kcal: 43, proteins: 0.9, fats: 0.2, carbs: 8.1 }
    };
  }
  
  if (nameLower.includes('яблок')) {
    return {
      description: 'Отборные сезонные яблоки с плотной сочной мякотью и сладким вкусом. Сорт идеален как для розничной торговли, так и для переработки на соки или пироги. Поставляются в прочных деревянных ящиках.',
      country: 'Россия (Краснодар)',
      brand: 'Сады Кубани',
      storageTemp: '+2°C...+6°C',
      shelfLife: '45 дней',
      nutrition: { kcal: 47, proteins: 0.4, fats: 0.4, carbs: 9.8 }
    };
  }

  if (nameLower.includes('огурц')) {
    return {
      description: 'Хрустящие короткоплодные огурцы грунтового выращивания. Ровные плоды, тонкая кожура, ароматная мякоть без горечи. Подходят для овощных нарезок, свежих салатов и консервации.',
      country: 'Россия (Ростов)',
      brand: 'Зеленый Дом',
      storageTemp: '+6°C...+10°C',
      shelfLife: '10 дней',
      nutrition: { kcal: 15, proteins: 0.8, fats: 0.1, carbs: 3.0 }
    };
  }

  if (nameLower.includes('молок')) {
    return {
      description: 'Пастеризованное коровье молоко оптимальной жирности 2,5%. Произведено по традиционной технологии без добавления консервантов и сухого молока. Прекрасный выбор для кафе, ресторанов и пищевых производств.',
      country: 'Россия',
      brand: 'Молочные Берега',
      storageTemp: '+2°C...+4°C',
      shelfLife: '7 дней',
      nutrition: { kcal: 53, proteins: 3.0, fats: 2.5, carbs: 4.7 }
    };
  }

  if (nameLower.includes('сметан')) {
    return {
      description: 'Густая сметана 20% жирности, изготовленная исключительно из свежих сливок и закваски. Обладает нежной однородной текстурой и классическим кисломолочным вкусом. Идеально к блинам, супам и заправкам.',
      country: 'Россия',
      brand: 'Фермерское Подворье',
      storageTemp: '+2°C...+4°C',
      shelfLife: '10 дней',
      nutrition: { kcal: 204, proteins: 2.5, fats: 20.0, carbs: 3.4 }
    };
  }

  return defaults;
};

// Функция выбора градиентного оттенка в зависимости от типа продукта для сочного фона (2026 тренд)
const getProductThemeColor = (product: MockProduct) => {
  const name = product.name.toLowerCase();
  if (name.includes('апельсин') || name.includes('мандарин')) return ['#FFF3E0', '#FFE0B2']; // Оранжевый
  if (name.includes('яблок') || name.includes('огур') || name.includes('зелен')) return ['#E8F5E9', '#C8E6C9']; // Зеленый
  if (name.includes('молок') || name.includes('сметан') || name.includes('сыр')) return ['#F5F5F5', '#E0E0E0']; // Серый/белый
  if (name.includes('мяс') || name.includes('колбас') || name.includes('фарш')) return ['#FFEBEE', '#FFCDD2']; // Розоватый/красный
  return ['#FFFDE7', '#FFF9C4']; // Желтый/нейтральный
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items: cartItems, addToCart, updateQuantity } = useCart();

  // Состояния для раскрытия аккордеонов
  const [descOpen, setDescOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [nutritionOpen, setNutritionOpen] = useState(false);

  // Поиск товара в каталоге
  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === id);
  }, [id]);

  // Поиск поставщика
  const supplier = useMemo(() => {
    if (!product) return null;
    return mockSuppliers.find((s) => s.id === product.supplierId);
  }, [product]);

  // Похожие товары от этого же поставщика
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts.filter(
      (p) => p.supplierId === product.supplierId && p.id !== product.id
    );
  }, [product]);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Товар не найден</ThemedText>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Вернуться назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasDiscount = !!product.discountPriceKopecks && product.discountPriceKopecks < product.priceKopecks;
  const activePriceKopecks = hasDiscount ? product.discountPriceKopecks! : product.priceKopecks;
  
  const priceRubles = (product.priceKopecks / 100).toLocaleString('ru-RU');
  const activePriceRubles = (activePriceKopecks / 100).toLocaleString('ru-RU');
  const discountPercent = hasDiscount 
    ? Math.round((1 - activePriceKopecks / product.priceKopecks) * 100) 
    : 0;

  const unitLabel = getUnitLabel(product.unit);
  const minPartyCostRubles = ((activePriceKopecks * product.minQuantity) / 100).toLocaleString('ru-RU');

  // Работа с корзиной
  const cartItem = cartItems.find((i) => i.productId === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

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
    const newQty = Math.min(quantityInCart + product.orderStep, product.stockQuantity);
    updateQuantity(product.id, newQty);
  };

  const handleDecrease = () => {
    if (quantityInCart - product.orderStep < product.minQuantity) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, quantityInCart - product.orderStep);
    }
  };

  // Поделиться товаром
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Посмотри ${product.name} у поставщика ${supplier?.name || ''} в приложении Hoomy! Опт от ${product.minQuantity} ${unitLabel} по цене ${activePriceRubles} ₽/${unitLabel}.`,
      });
    } catch (error) {
      console.warn('Ошибка при попытке поделиться:', error);
    }
  };

  const details = getProductDetails(product);
  const themeColors = getProductThemeColor(product);

  const toggleSection = (section: 'desc' | 'specs' | 'nutrition') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (section === 'desc') setDescOpen(!descOpen);
    if (section === 'specs') setSpecsOpen(!specsOpen);
    if (section === 'nutrition') setNutritionOpen(!nutritionOpen);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Блок изображения / 3D эмодзи-карточка с мягким градиентом в стиле 2026 */}
        <View style={[styles.imageWrapper, { backgroundColor: themeColors[0] }]}>
          {/* Плавающие кнопки управления */}
          <TouchableOpacity style={styles.floatingClose} onPress={() => router.back()} activeOpacity={0.8}>
            <Feather name="x" size={22} color="#1E1E1E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingShare} onPress={handleShare} activeOpacity={0.8}>
            <Feather name="share-2" size={20} color="#1E1E1E" />
          </TouchableOpacity>

          <Text style={styles.largeEmoji}>{product.mockEmoji || '📦'}</Text>
          <View style={styles.gradientOverlay} />
        </View>

        {/* Информационный контейнер */}
        <View style={styles.infoWrapper}>
          {/* Хедер товара */}
          <View style={styles.headerBlock}>
            {supplier && (
              <TouchableOpacity 
                style={styles.supplierBadge}
                onPress={() => {
                  router.dismiss();
                  router.push(`/supplier/${supplier.id}`);
                }}
              >
                <Feather name="truck" size={12} color="#FF6500" style={styles.supplierIcon} />
                <Text style={styles.supplierNameText}>{supplier.name}</Text>
              </TouchableOpacity>
            )}
            <ThemedText style={styles.productName}>{product.name}</ThemedText>
            
            {/* Блок цен */}
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.activePrice}>
                  {activePriceRubles} ₽ <Text style={styles.unitText}>/ {unitLabel}</Text>
                </Text>
                {hasDiscount && (
                  <>
                    <Text style={styles.oldPrice}>{priceRubles} ₽</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>-{discountPercent}%</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Сетка B2B характеристик (2x2) */}
          <View style={styles.specsGrid}>
            <View style={styles.gridCard}>
              <Feather name="package" size={16} color="#777" style={styles.gridCardIcon} />
              <Text style={styles.gridCardLabel}>Мин. партия</Text>
              <Text style={styles.gridCardValue}>{product.minQuantity} {unitLabel}</Text>
            </View>

            <View style={styles.gridCard}>
              <Feather name="git-commit" size={16} color="#777" style={styles.gridCardIcon} />
              <Text style={styles.gridCardLabel}>Шаг заказа</Text>
              <Text style={styles.gridCardValue}>+{product.orderStep} {unitLabel}</Text>
            </View>

            <View style={styles.gridCard}>
              <Feather name="layers" size={16} color="#777" style={styles.gridCardIcon} />
              <Text style={styles.gridCardLabel}>В наличии</Text>
              <Text style={styles.gridCardValue}>{product.stockQuantity} {unitLabel}</Text>
            </View>

            <View style={styles.gridCard}>
              <Feather name="shopping-bag" size={16} color="#777" style={styles.gridCardIcon} />
              <Text style={styles.gridCardLabel}>Сумма партии</Text>
              <Text style={styles.gridCardValue}>{minPartyCostRubles} ₽</Text>
            </View>
          </View>

          {/* Информационные раскрывающиеся панели (аккордеоны) */}
          
          {/* Описание */}
          <View style={styles.accordionSection}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => toggleSection('desc')}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.accordionTitle}>Описание товара</ThemedText>
              <Feather name={descOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
            </TouchableOpacity>
            {descOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.descriptionText}>{details.description}</Text>
              </View>
            )}
          </View>

          {/* Характеристики */}
          <View style={styles.accordionSection}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => toggleSection('specs')}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.accordionTitle}>Характеристики</ThemedText>
              <Feather name={specsOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
            </TouchableOpacity>
            {specsOpen && (
              <View style={styles.accordionContent}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Страна происхождения</Text>
                  <Text style={styles.tableValue}>{details.country}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Торговая марка / Бренд</Text>
                  <Text style={styles.tableValue}>{details.brand}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Температура хранения</Text>
                  <Text style={styles.tableValue}>{details.storageTemp}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Срок годности</Text>
                  <Text style={styles.tableValue}>{details.shelfLife}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Пищевая ценность */}
          <View style={styles.accordionSection}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => toggleSection('nutrition')}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.accordionTitle}>Пищевая ценность (на 100 г)</ThemedText>
              <Feather name={nutritionOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
            </TouchableOpacity>
            {nutritionOpen && (
              <View style={styles.accordionContent}>
                <Text style={styles.energyText}>
                  Энергетическая ценность: <Text style={styles.energyVal}>{details.nutrition.kcal} ккал</Text>
                </Text>

                {/* Бары бжу */}
                <View style={styles.nutritionRow}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Белки</Text>
                    <Text style={styles.nutritionValue}>{details.nutrition.proteins} г</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(details.nutrition.proteins * 3, 100)}%`, backgroundColor: '#4CD964' }]} />
                    </View>
                  </View>

                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Жиры</Text>
                    <Text style={styles.nutritionValue}>{details.nutrition.fats} г</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(details.nutrition.fats * 3, 100)}%`, backgroundColor: '#FFCC00' }]} />
                    </View>
                  </View>

                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Углеводы</Text>
                    <Text style={styles.nutritionValue}>{details.nutrition.carbs} г</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(details.nutrition.carbs * 1.5, 100)}%`, backgroundColor: '#FF9500' }]} />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Рекомендации: карусель "Рекомендуем у этого поставщика" */}
          {similarProducts.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <ThemedText style={styles.sectionTitle}>Рекомендуем у этого поставщика</ThemedText>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {similarProducts.map((simProd) => {
                  const hasSimDiscount = !!simProd.discountPriceKopecks && simProd.discountPriceKopecks < simProd.priceKopecks;
                  const simPriceKopecks = hasSimDiscount ? simProd.discountPriceKopecks! : simProd.priceKopecks;
                  const simPriceRub = (simPriceKopecks / 100).toLocaleString('ru-RU');
                  
                  return (
                    <TouchableOpacity 
                      key={simProd.id} 
                      style={styles.simCard}
                      onPress={() => {
                        // Переходим на эту же страницу с новым ID
                        router.setParams({ id: simProd.id });
                      }}
                    >
                      <View style={styles.simImageBg}>
                        <Text style={styles.simEmoji}>{simProd.mockEmoji || '📦'}</Text>
                      </View>
                      <Text style={styles.simName} numberOfLines={1}>{simProd.name}</Text>
                      <Text style={styles.simPrice}>{simPriceRub} ₽ / {getUnitLabel(simProd.unit)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Прилипающая нижняя кнопка / степпер добавления в корзину */}
      <View style={styles.bottomBar}>
        {quantityInCart === 0 ? (
          <TouchableOpacity 
            style={styles.addCartBtn} 
            onPress={handleAdd} 
            activeOpacity={0.8}
          >
            <Text style={styles.addCartBtnText}>
              Добавить в корзину • {(activePriceKopecks * product.minQuantity / 100).toLocaleString('ru-RU')} ₽
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepperContainer}>
            <TouchableOpacity 
              style={styles.stepperActionBtn} 
              onPress={handleDecrease}
              activeOpacity={0.7}
            >
              <Feather 
                name={quantityInCart <= product.minQuantity ? "trash-2" : "minus"} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <View style={styles.stepperCenter}>
              <Text style={styles.stepperQtyText}>
                {quantityInCart} {unitLabel}
              </Text>
              <Text style={styles.stepperSumText}>
                {(activePriceKopecks * quantityInCart / 100).toLocaleString('ru-RU')} ₽
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.stepperActionBtn} 
              onPress={handleIncrease}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  scrollContent: {
    paddingBottom: 110, // Отступ для липкой кнопки снизу
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#FF6500',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  imageWrapper: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  largeEmoji: {
    fontSize: 110,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(250, 250, 249, 0.4)', // Переход к белому фону
  },
  floatingClose: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  floatingShare: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  infoWrapper: {
    backgroundColor: '#FAFAF9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerBlock: {
    marginBottom: 20,
  },
  supplierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFE6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  supplierIcon: {
    marginRight: 6,
  },
  supplierNameText: {
    color: '#FF6500',
    fontSize: 12,
    fontWeight: '700',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1D',
    lineHeight: 30,
    marginBottom: 12,
  },
  priceContainer: {
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  activePrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E1E1D',
  },
  unitText: {
    fontSize: 16,
    color: '#777',
    fontWeight: '400',
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  gridCard: {
    width: (width - 42) / 2, // Две колонки с учетом отступов
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFEFEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  gridCardIcon: {
    marginBottom: 8,
  },
  gridCardLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridCardValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E1E1D',
  },
  accordionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFEFEA',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1D',
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F3',
    paddingTop: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555554',
    lineHeight: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F3',
  },
  tableLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tableValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1E1D',
  },
  energyText: {
    fontSize: 14,
    color: '#555554',
    marginBottom: 12,
  },
  energyVal: {
    fontWeight: 'bold',
    color: '#1E1E1D',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  nutritionItem: {
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E1E1D',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#EFEFEA',
    borderRadius: 2,
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  recommendationsContainer: {
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E1E1D',
    marginBottom: 14,
  },
  horizontalScroll: {
    gap: 12,
    paddingRight: 16,
  },
  simCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EFEFEA',
  },
  simImageBg: {
    height: 80,
    backgroundColor: '#F7F7F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  simEmoji: {
    fontSize: 32,
  },
  simName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  simPrice: {
    fontSize: 11,
    color: '#FF6500',
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEA',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Учет выреза iOS Home Indicator
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  addCartBtn: {
    backgroundColor: '#FF6500',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF6500',
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 8,
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  stepperActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperCenter: {
    alignItems: 'center',
  },
  stepperQtyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepperSumText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 1,
  },
});
