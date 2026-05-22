import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockProducts } from '@/mocks/homeData';

// Мок-данные шаблона закупки
const mockTemplateSuppliers = [
  {
    id: 's1',
    name: 'Фермер Казань',
    logo: '👨‍🌾',
    deliveryDay: 'Вторник (26 мая)',
    items: [
      { id: '1', name: 'Картофель молодой', quantity: 20, unit: 'кг', price: 90, icon: '🥔', inStock: true },
      { id: '3', name: 'Огурцы грунтовые', quantity: 10, unit: 'кг', price: 120, icon: '🥒', inStock: true, priceChanged: '+10 ₽' }
    ]
  },
  {
    id: 's2',
    name: 'Молочный Двор',
    logo: '🥛',
    deliveryDay: 'Четверг (28 мая)',
    items: [
      { id: '6', name: 'Молоко фермерское 3.2%', quantity: 12, unit: 'л', price: 85, icon: '🥛', inStock: true },
      { id: '99', name: 'Йогурт клубничный', quantity: 20, unit: 'шт', price: 60, icon: '🍓', inStock: false } // Нет в наличии
    ]
  }
];

export default function WeeklyPurchaseScreen() {
  const [isValidated, setIsValidated] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);

  // Вычисляем сумму только тех товаров, что в наличии
  const activeItemsCount = mockTemplateSuppliers.reduce((acc, sup) => 
    acc + sup.items.filter(i => i.inStock).length, 0
  );

  const totalPrice = mockTemplateSuppliers.reduce((acc, sup) => {
    const supplierSum = sup.items
      .filter(item => item.inStock)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + supplierSum;
  }, 0);

  const handleOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      Alert.alert(
        'Заказ оформлен!',
        `Успешно создано 2 подзаказа на общую сумму ${totalPrice.toLocaleString('ru-RU')} ₽.\n\nДаты доставок:\n• Фермер Казань: Вторник\n• Молочный Двор: Четверг`,
        [
          {
            text: 'Отлично',
            onPress: () => router.replace('/(tabs)/orders'),
          }
        ]
      );
    }, 2000);
  };

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
          <ThemedText style={styles.headerTitle}>Закупка на неделю</ThemedText>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Информация', 'Редактирование шаблона будет доступно в следующем релизе')}
          >
            <Feather name="edit-3" size={20} color="#FF6500" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Инфо-карточка */}
          <View style={styles.infoCard}>
            <View style={styles.infoBadge}>
              <Feather name="repeat" size={24} color="#FF6500" />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoTitle}>Умный шаблон закупки</ThemedText>
              <ThemedText style={styles.infoDesc}>
                Каждое воскресенье Hoomy проверяет актуальность цен и остатки у поставщиков для вашего шаблона закупки.
              </ThemedText>
            </View>
          </View>

          {/* Предупреждения валидации (RFC Логика) */}
          {isValidated && (
            <View style={styles.validationSection}>
              <ThemedText style={styles.validationSectionTitle}>Результаты проверки остатков:</ThemedText>
              
              <View style={[styles.alertBox, styles.alertDanger]}>
                <Feather name="alert-triangle" size={18} color="#FF3B30" style={styles.alertIcon} />
                <ThemedText style={styles.alertText}>
                  Товар <ThemedText style={{ fontWeight: 'bold' }}>Йогурт клубничный (20 шт)</ThemedText> временно отсутствует на складе поставщика «Молочный Двор». Он был исключен из текущей закупки.
                </ThemedText>
              </View>

              <View style={[styles.alertBox, styles.alertWarning]}>
                <Feather name="info" size={18} color="#FF9500" style={styles.alertIcon} />
                <ThemedText style={styles.alertText}>
                  Цены на <ThemedText style={{ fontWeight: 'bold' }}>Огурцы грунтовые</ThemedText> изменились с прошлого заказа (+10 ₽ / кг). Сумма заказа скорректирована.
                </ThemedText>
              </View>
            </View>
          )}

          {/* Список поставщиков и товаров */}
          <View style={styles.suppliersList}>
            <ThemedText style={styles.listHeader}>Товары в заказе на неделю</ThemedText>

            {mockTemplateSuppliers.map((supplier) => (
              <View key={supplier.id} style={styles.supplierCard}>
                <View style={styles.supplierHeader}>
                  <View style={styles.supplierInfo}>
                    <View style={styles.supplierAvatar}>
                      <ThemedText style={styles.supplierAvatarText}>{supplier.logo}</ThemedText>
                    </View>
                    <View>
                      <ThemedText style={styles.supplierName}>{supplier.name}</ThemedText>
                      <View style={styles.deliveryRow}>
                        <Feather name="calendar" size={12} color="#666" style={{ marginRight: 4 }} />
                        <ThemedText style={styles.deliveryText}>Доставка: {supplier.deliveryDay}</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.itemsContainer}>
                  {supplier.items.map((item) => (
                    <View 
                      key={item.id} 
                      style={[styles.itemRow, !item.inStock && styles.itemRowOutOfStock]}
                    >
                      <View style={styles.itemEmojiContainer}>
                        <ThemedText style={styles.itemEmoji}>{item.icon}</ThemedText>
                      </View>

                      <View style={styles.itemInfo}>
                        <ThemedText style={[styles.itemName, !item.inStock && styles.itemNameOutOfStock]}>
                          {item.name}
                        </ThemedText>
                        <ThemedText style={styles.itemCalc}>
                          {item.quantity} {item.unit} × {item.price} ₽
                        </ThemedText>
                      </View>

                      <View style={styles.itemRight}>
                        {item.inStock ? (
                          <>
                            <ThemedText style={styles.itemSum}>
                              {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                            </ThemedText>
                            {item.priceChanged && (
                              <View style={styles.priceChangeBadge}>
                                <ThemedText style={styles.priceChangeText}>{item.priceChanged}</ThemedText>
                              </View>
                            )}
                          </>
                        ) : (
                          <View style={styles.outOfStockBadge}>
                            <ThemedText style={styles.outOfStockText}>Нет на складе</ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Липкий подвал заказа */}
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <View>
              <ThemedText style={styles.footerCount}>Товаров в наличии: {activeItemsCount}</ThemedText>
              <ThemedText style={styles.footerDeliveries}>Поставщиков: 2</ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText style={styles.footerTotalLabel}>Итого к оплате</ThemedText>
              <ThemedText style={styles.footerTotalVal}>{totalPrice.toLocaleString('ru-RU')} ₽</ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.footerButton, isOrdering && styles.footerButtonDisabled]}
            onPress={handleOrder}
            disabled={isOrdering}
            activeOpacity={0.8}
          >
            {isOrdering ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ThemedText style={styles.footerButtonText}>Подтвердить и оплатить</ThemedText>
            )}
          </TouchableOpacity>
        </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoCard: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  validationSection: {
    marginBottom: 24,
  },
  validationSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  alertBox: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  alertDanger: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD1D1',
  },
  alertWarning: {
    backgroundColor: '#FFF9F0',
    borderColor: '#FFE8C4',
  },
  alertIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: '#444',
    lineHeight: 16,
  },
  suppliersList: {
    marginBottom: 20,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  supplierCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  supplierHeader: {
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D2',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplierAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supplierAvatarText: {
    fontSize: 18,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  deliveryText: {
    fontSize: 11,
    color: '#666',
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  itemRowOutOfStock: {
    borderBottomColor: '#F5F5F5',
  },
  itemEmojiContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  itemNameOutOfStock: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemCalc: {
    fontSize: 12,
    color: '#888',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemSum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priceChangeBadge: {
    backgroundColor: '#FFF9F0',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: '#FFE8C4',
  },
  priceChangeText: {
    fontSize: 10,
    color: '#FF9500',
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    backgroundColor: '#FFF5F5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: '#FFD1D1',
  },
  outOfStockText: {
    fontSize: 10,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EFEA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  footerCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  footerDeliveries: {
    fontSize: 12,
    color: '#666',
  },
  footerTotalLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  footerTotalVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  footerButton: {
    backgroundColor: '#FF6500',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  footerButtonDisabled: {
    backgroundColor: '#FFA366',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
