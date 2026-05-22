import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MockProduct } from '@/mocks/homeData';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: MockProduct;
  style?: any;
}

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

export function ProductCard({ product, style }: ProductCardProps) {
  const { items: cartItems, addToCart, updateQuantity } = useCart();
  
  const hasDiscount = !!product.discountPriceKopecks && product.discountPriceKopecks < product.priceKopecks;
  const activePriceKopecks = hasDiscount ? product.discountPriceKopecks! : product.priceKopecks;
  
  const priceRubles = (product.priceKopecks / 100).toLocaleString('ru-RU');
  const activePriceRubles = (activePriceKopecks / 100).toLocaleString('ru-RU');
  const minPartyRubles = ((activePriceKopecks * product.minQuantity) / 100).toLocaleString('ru-RU');
  
  const discountPercent = hasDiscount 
    ? Math.round((1 - activePriceKopecks / product.priceKopecks) * 100) 
    : 0;

  const unitLabel = getUnitLabel(product.unit);

  // Проверяем наличие в корзине
  const cartItem = cartItems.find(i => i.productId === product.id);
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
      updateQuantity(product.id, 0); // Удаляем из корзины при опускании ниже минимума
    } else {
      updateQuantity(product.id, quantityInCart - product.orderStep);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      activeOpacity={0.9}
      onPress={() => {
        router.push({
          pathname: '/product/[id]',
          params: { id: product.id }
        });
      }}
    >
      <View style={styles.imageContainer}>
        {/* Заглушка изображения */}
        <View style={styles.imagePlaceholder}>
          <ThemedText style={styles.emojiText}>{product.mockEmoji || '📦'}</ThemedText>
        </View>

        {/* Процент скидки */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <ThemedText style={styles.discountText}>-{discountPercent}%</ThemedText>
          </View>
        )}

        {/* Кнопка добавления / Степпер */}
        {quantityInCart === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
            <Feather name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperBtn} onPress={handleDecrease}>
              <Feather name={quantityInCart <= product.minQuantity ? "trash-2" : "minus"} size={12} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.stepperValue}>{quantityInCart}</ThemedText>
            <TouchableOpacity style={styles.stepperBtn} onPress={handleIncrease}>
              <Feather name="plus" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {product.name}
        </ThemedText>

        <ThemedText style={styles.stockText}>
          В наличии: {product.stockQuantity} {unitLabel}
        </ThemedText>

        {/* Отображение цены со скидкой */}
        <View style={styles.priceRow}>
          <ThemedText style={styles.price}>
            {activePriceRubles} ₽/{unitLabel}
          </ThemedText>
          {hasDiscount && (
            <ThemedText style={styles.oldPrice}>
              {priceRubles} ₽
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
  },
  emojiText: {
    fontSize: 44,
    lineHeight: 52,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepperContainer: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    left: 6,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6500',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepperBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 2,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    height: 36,
  },
  details: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  stockText: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});
