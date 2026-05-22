import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { mockSuppliers } from '@/mocks/homeData';
import { MockCartItem } from '@/mocks/mockCartData';
import { CartSupplierSection } from '@/components/cart/CartSupplierSection';
import { useCart } from '@/hooks/use-cart';

export default function CartScreen() {
  const { items: cartItems, removeSupplierOrder, removeFromCartById } = useCart();
  console.log('[CartScreen] Render. cartItems count:', cartItems.length, 'supplierIds list:', Object.keys(cartItems.reduce((acc, item) => {
    if (!acc[item.supplierId]) acc[item.supplierId] = [];
    acc[item.supplierId].push(item);
    return acc;
  }, {} as Record<string, any>)));

  // Группируем корзину по поставщику с помощью useMemo
  const groupedCart = React.useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.supplierId]) {
        acc[item.supplierId] = [];
      }
      acc[item.supplierId].push(item);
      return acc;
    }, {} as Record<string, MockCartItem[]>);
  }, [cartItems]);

  const supplierIds = React.useMemo(() => Object.keys(groupedCart), [groupedCart]);
  const [activeSupplierId, setActiveSupplierId] = useState<string>('');

  // Автоматический выбор вкладки поставщика при изменении списка заказов
  React.useEffect(() => {
    if (supplierIds.length > 0) {
      if (!activeSupplierId || !supplierIds.includes(activeSupplierId)) {
        setActiveSupplierId(supplierIds[0]);
      }
    } else if (activeSupplierId !== '') {
      setActiveSupplierId('');
    }
  }, [supplierIds, activeSupplierId]);

  const formatPrice = (kopecks: number) => (kopecks / 100).toLocaleString('ru-RU') + ' ₽';

  const handleRemoveOrder = (supplierId: string) => {
    removeSupplierOrder(supplierId);
    // Если мы удаляем активного поставщика, переключаемся на первого оставшегося
    if (activeSupplierId === supplierId) {
      const remainingSupplierIds = supplierIds.filter(id => id !== supplierId);
      setActiveSupplierId(remainingSupplierIds[0] || '');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCartById(itemId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Шапка экрана */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Корзина</ThemedText>
      </View>

      {supplierIds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>В корзине пока пусто</ThemedText>
          <ThemedText style={styles.emptySubtitle}>Перейдите в каталог поставщиков, чтобы добавить товары</ThemedText>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Горизонтальные табы поставщиков */}
          <View style={styles.tabsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.tabsScroll}
            >
              {supplierIds.map((supplierId) => {
                const supplier = mockSuppliers.find(s => s.id === supplierId);
                const items = groupedCart[supplierId];
                if (!supplier || !items) return null;

                const isActive = activeSupplierId === supplierId;
                
                // Считаем сумму товаров в этом табе
                const totalKopecks = items.reduce((acc, item) => acc + item.unitPriceKopecks * item.quantity, 0);
                // Дни доставки (возьмем первые два для краткости)
                const deliveryText = supplier.deliveryDays.slice(0, 2).join(', ');

                return (
                  <TouchableOpacity 
                    key={supplierId}
                    style={[styles.tab, isActive && styles.tabActive]}
                    onPress={() => setActiveSupplierId(supplierId)}
                    activeOpacity={0.8}
                  >
                    <ThemedText style={[styles.tabTitle, isActive && styles.tabTitleActive]}>
                      {supplier.name}
                    </ThemedText>
                    <ThemedText style={[styles.tabSubtitle, isActive && styles.tabSubtitleActive]}>
                      {formatPrice(totalKopecks)} · Доставка: {deliveryText}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Содержимое активного таба */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {activeSupplierId && groupedCart[activeSupplierId] && (
              <CartSupplierSection 
                supplier={mockSuppliers.find(s => s.id === activeSupplierId)!} 
                items={groupedCart[activeSupplierId]} 
                onRemoveOrder={() => handleRemoveOrder(activeSupplierId)}
                onRemoveItem={handleRemoveItem}
              />
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9F9F9' 
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 140,
  },
  tabActive: {
    borderColor: '#333',
    borderWidth: 2,
    paddingVertical: 9, // Компенсация border-width, чтобы не прыгала высота
    paddingHorizontal: 15,
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tabTitleActive: {
    fontWeight: '700',
  },
  tabSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  tabSubtitleActive: {
    color: '#666',
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  emptySubtitle: { 
    fontSize: 15, 
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 40,
  }
});
