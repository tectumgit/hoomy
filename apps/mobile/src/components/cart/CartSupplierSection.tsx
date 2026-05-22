import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MockCartItem } from '@/mocks/mockCartData';
import { Supplier } from '@hoomy/shared';

import { mockProducts } from '@/mocks/homeData';
import { useCart } from '@/hooks/use-cart';

type CartSupplierSectionProps = {
  supplier: Supplier;
  items: MockCartItem[];
  onRemoveOrder?: () => void;
  onRemoveItem?: (itemId: string) => void;
};

export function CartSupplierSection({ supplier, items, onRemoveOrder, onRemoveItem }: CartSupplierSectionProps) {
  const { updateQuantity } = useCart();
  const formatPrice = (kopecks: number) => (kopecks / 100).toLocaleString('ru-RU') + ' ₽';

  // Вычисляем сумму товаров
  const totalKopecks = items.reduce((acc, item) => acc + item.unitPriceKopecks * item.quantity, 0);
  
  const minKopecks = supplier.minOrderAmountKopecks;
  const isMinMet = totalKopecks >= minKopecks;
  const diffKopecks = minKopecks - totalKopecks;

  const handleIncrease = (item: MockCartItem) => {
    const prod = mockProducts.find(p => p.id === item.productId);
    const step = prod ? prod.orderStep : 1;
    const max = prod ? prod.stockQuantity : 999;
    const newQty = Math.min(item.quantity + step, max);
    updateQuantity(item.productId, newQty);
  };

  const handleDecrease = (item: MockCartItem) => {
    const prod = mockProducts.find(p => p.id === item.productId);
    const min = prod ? prod.minQuantity : 1;
    const step = prod ? prod.orderStep : 1;
    if (item.quantity - step < min) {
      return;
    }
    const newQty = item.quantity - step;
    updateQuantity(item.productId, newQty);
  };

  return (
    <View style={styles.container}>
      {/* Шапка статуса заказа (имя поставщика теперь в табах) */}
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <ThemedText style={styles.minOrderText}>Мин. заказ {formatPrice(minKopecks)}</ThemedText>
            {isMinMet ? (
              <View style={[styles.statusBadge, styles.statusSuccess]}>
                <ThemedText style={styles.statusSuccessText}>Минимум набран</ThemedText>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.statusWarning]}>
                <ThemedText style={styles.statusWarningText}>
                  Добавьте еще {formatPrice(diffKopecks)}
                </ThemedText>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.deleteOrderBtn} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                "Удалить заказ",
                "Вы уверены, что хотите удалить заказ от этого поставщика?",
                [
                  { text: "Отмена", style: "cancel" },
                  { text: "Удалить", style: "destructive", onPress: onRemoveOrder }
                ]
              );
            }}
          >
            <Feather name="trash-2" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Список товаров */}
      <View style={styles.itemsList}>
        {items.map((item, index) => {
          const prod = mockProducts.find(p => p.id === item.productId);
          const minQty = prod ? prod.minQuantity : 1;
          const isAtMin = item.quantity <= minQty;

          return (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <TouchableOpacity 
                  style={styles.itemMainInfo}
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push({
                      pathname: '/product/[id]',
                      params: { id: item.productId }
                    });
                  }}
                >
                  <View style={styles.itemEmojiContainer}>
                    <ThemedText style={styles.itemEmoji}>{item.iconEmoji}</ThemedText>
                  </View>
                  
                  <View style={styles.itemInfoContent}>
                    <ThemedText style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.itemCalc}>
                      {item.quantity} {item.unit} × {formatPrice(item.unitPriceKopecks)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>

                <View style={styles.itemActions}>
                  <ThemedText style={styles.itemPrice}>
                    {formatPrice(item.unitPriceKopecks * item.quantity)}
                  </ThemedText>
                  
                  {/* Кнопки плюс/минус и удаление */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={styles.deleteItemBtn}
                      activeOpacity={0.7}
                      onPress={() => {
                        Alert.alert(
                          "Удалить товар",
                          `Вы уверены, что хотите удалить "${item.name}" из корзины?`,
                          [
                            { text: "Отмена", style: "cancel" },
                            { text: "Удалить", style: "destructive", onPress: () => onRemoveItem && onRemoveItem(item.id) }
                          ]
                        );
                      }}
                    >
                      <Feather name="trash-2" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={[styles.qBtn, isAtMin && { opacity: 0.4 }]}
                        disabled={isAtMin}
                        onPress={() => handleDecrease(item)}
                      >
                        <ThemedText style={styles.qBtnText}>-</ThemedText>
                      </TouchableOpacity>
                      <ThemedText style={styles.qValue}>{item.quantity}</ThemedText>
                      <TouchableOpacity 
                        style={styles.qBtn}
                        onPress={() => handleIncrease(item)}
                      >
                        <ThemedText style={styles.qBtnText}>+</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {index < items.length - 1 ? <View style={styles.itemDivider} /> : null}
            </View>
          );
        })}
      </View>

      {/* Подвал и оформление */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <ThemedText style={styles.totalLabel}>Итого:</ThemedText>
          <ThemedText style={styles.totalValue}>{formatPrice(totalKopecks)}</ThemedText>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutBtn, !isMinMet && styles.checkoutBtnDisabled]} 
          activeOpacity={0.8}
          disabled={!isMinMet}
        >
          <ThemedText style={styles.checkoutBtnText}>
            Оформить заказ
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  minOrderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  deleteOrderBtn: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusSuccess: {
    backgroundColor: '#E6F4D2',
  },
  statusSuccessText: {
    color: '#4A7D00',
    fontWeight: '600',
    fontSize: 13,
  },
  statusWarning: {
    backgroundColor: '#FFF2EB',
  },
  statusWarningText: {
    color: '#FF6500',
    fontWeight: '600',
    fontSize: 13,
  },
  itemsList: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  itemEmojiContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemMainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfoContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemCalc: {
    fontSize: 13,
    color: '#999',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteItemBtn: {
    padding: 8,
    marginRight: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  qBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  qValue: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutBtn: {
    backgroundColor: '#FF6500',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutBtnDisabled: {
    backgroundColor: '#FFD1B3',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
