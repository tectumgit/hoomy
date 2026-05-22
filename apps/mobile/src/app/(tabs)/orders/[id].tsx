import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { mockOrders } from '@/mocks/ordersData';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/orders')} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Заказ не найден</ThemedText>
        </View>
        <View style={styles.errorContent}>
          <Feather name="alert-circle" size={48} color="#999" />
          <ThemedText style={styles.errorText}>Пожалуйста, вернитесь в список заказов</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (kopecks: number) => (kopecks / 100).toLocaleString('ru-RU') + ' ₽';

  const getActiveStep = (status: string) => {
    switch (status) {
      case 'assembly': return 2;
      case 'delivering': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const activeStep = getActiveStep(order.statusCode);

  const renderStepper = () => {
    if (order.statusCode === 'cancelled') {
      return (
        <View style={styles.cancelledBanner}>
          <Feather name="x-circle" size={22} color="#FF3B30" />
          <View style={styles.cancelledTextContainer}>
            <ThemedText style={styles.cancelledTitle}>Заказ отменен</ThemedText>
            <ThemedText style={styles.cancelledSubtitle}>Свяжитесь с поставщиком для уточнения деталей</ThemedText>
          </View>
        </View>
      );
    }

    const steps = [
      { label: 'Принят', icon: 'check' },
      { label: 'Сборка', icon: 'package' },
      { label: 'В пути', icon: 'truck' },
      { label: 'Доставлен', icon: 'smile' }
    ];

    return (
      <View style={styles.stepperContainer}>
        {/* Background Line */}
        <View style={styles.stepLineBg}>
          <View 
            style={[
              styles.stepLineActive, 
              { 
                width: activeStep === 4 ? '100%' : activeStep === 3 ? '66%' : activeStep === 2 ? '33%' : '0%' 
              }
            ]} 
          />
        </View>
        
        <View style={styles.stepsRow}>
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < activeStep;
            const isActive = stepNum === activeStep;

            let stepColor = '#E0E0E0';
            if (isActive) stepColor = '#FF6500';
            else if (isCompleted) stepColor = '#10B981';

            return (
              <View key={index} style={styles.stepWrapper}>
                <View style={[
                  styles.stepCircle, 
                  { 
                    borderColor: stepColor,
                    backgroundColor: isActive ? '#FF6500' : isCompleted ? '#E6F7F0' : '#FFFFFF' 
                  }
                ]}>
                  <Feather 
                    name={step.icon as any} 
                    size={15} 
                    color={isActive ? '#FFFFFF' : isCompleted ? '#10B981' : '#999999'} 
                  />
                </View>
                <ThemedText style={[
                  styles.stepLabel, 
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted
                ]}>
                  {step.label}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/orders')} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Заказ №{order.number}</ThemedText>
        <TouchableOpacity style={styles.shareBtn}>
          <Feather name="share-2" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stepper Status */}
        {renderStepper()}

        {/* Supplier Header Card */}
        <View style={styles.supplierCard}>
          <View style={styles.supplierCardInfo}>
            <View style={styles.supplierLogoContainer}>
              <ThemedText style={styles.supplierLogoEmoji}>🏪</ThemedText>
            </View>
            <View style={styles.supplierTextInfo}>
              <ThemedText style={styles.supplierName}>{order.supplierName}</ThemedText>
              <ThemedText style={styles.supplierSubtitle}>Локальный поставщик Hoomy</ThemedText>
            </View>
          </View>
        </View>

        {/* Billing Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Оплата</ThemedText>
            <View style={[
              styles.paymentBadge, 
              order.paymentStatus === 'Оплачен' ? styles.paymentBadgePaid : styles.paymentBadgePending
            ]}>
              <ThemedText style={[
                styles.paymentBadgeText,
                order.paymentStatus === 'Оплачен' ? styles.paymentBadgeTextPaid : styles.paymentBadgeTextPending
              ]}>
                {order.paymentStatus}
              </ThemedText>
            </View>
          </View>
          <View style={styles.cardRow}>
            <ThemedText style={styles.cardLabel}>Сумма заказа</ThemedText>
            <ThemedText style={styles.cardValueLarge}>{formatPrice(order.totalKopecks)}</ThemedText>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <ThemedText style={styles.cardLabel}>Способ оплаты</ThemedText>
            <ThemedText style={styles.cardValue}>{order.paymentMethod}</ThemedText>
          </View>
          <View style={styles.cardRow}>
            <ThemedText style={styles.cardLabel}>В том числе НДС (20%)</ThemedText>
            <ThemedText style={styles.cardValue}>{formatPrice(order.vatKopecks)}</ThemedText>
          </View>
          
          <TouchableOpacity style={styles.invoiceButton} activeOpacity={0.7}>
            <Feather name="file-text" size={16} color="#FF6500" />
            <ThemedText style={styles.invoiceButtonText}>Скачать счет на оплату (PDF)</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Delivery Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Доставка</ThemedText>
            <Feather name="truck" size={18} color="#666" />
          </View>
          
          <View style={styles.cardRowVertical}>
            <ThemedText style={styles.cardLabel}>Адрес доставки</ThemedText>
            <ThemedText style={styles.cardValueBlock}>{order.address}</ThemedText>
          </View>
          
          <View style={styles.cardDivider} />
          
          <View style={styles.cardRow}>
            <ThemedText style={styles.cardLabel}>Дата и время</ThemedText>
            <ThemedText style={styles.cardValue}>{order.date}, {order.deliveryTime}</ThemedText>
          </View>
          
          {order.driverName && (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.driverRow}>
                <View style={styles.driverAvatar}>
                  <Feather name="user" size={18} color="#666" />
                </View>
                <View style={styles.driverInfo}>
                  <ThemedText style={styles.driverName}>{order.driverName}</ThemedText>
                  <ThemedText style={styles.driverSubtitle}>Водитель-экспедитор</ThemedText>
                </View>
                <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
                  <Feather name="phone" size={16} color="#FF6500" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Composition Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Состав заказа</ThemedText>
            <ThemedText style={styles.cardHeaderSubtitle}>
              {order.items.length} поз. · {order.totalWeightKg} кг
            </ThemedText>
          </View>
          
          <View style={styles.itemsList}>
            {order.items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <View style={styles.itemImageContainer}>
                    <ThemedText style={styles.itemEmoji}>{item.iconEmoji}</ThemedText>
                  </View>
                  <View style={styles.itemInfo}>
                    <ThemedText style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.itemQuantity}>
                      {item.quantity} {item.unit} × {formatPrice(item.unitPriceKopecks)}
                    </ThemedText>
                  </View>
                  <View style={styles.itemPriceContainer}>
                    <ThemedText style={styles.itemPrice}>
                      {formatPrice(item.unitPriceKopecks * item.quantity)}
                    </ThemedText>
                  </View>
                </View>
                {index < order.items.length - 1 ? <View style={styles.cardDivider} /> : null}
              </View>
            ))}
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <Feather name="refresh-cw" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <ThemedText style={styles.primaryBtnText}>Повторить заказ</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            activeOpacity={0.8}
            onPress={() => router.push(`/chats/${order.supplierId}`)}
          >
            <Feather name="message-square" size={18} color="#FF6500" style={{ marginRight: 8 }} />
            <ThemedText style={styles.secondaryBtnText}>Написать поставщику</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dangerBtn} activeOpacity={0.8}>
            <Feather name="alert-triangle" size={16} color="#FF3B30" style={{ marginRight: 6 }} />
            <ThemedText style={styles.dangerBtnText}>Открыть спор</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  // Stepper styles
  stepperContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  stepLineBg: {
    height: 2,
    backgroundColor: '#E5E5E5',
    position: 'absolute',
    top: 38, // Align exactly with circle vertical center
    left: '12%',
    right: '12%',
    zIndex: 1,
  },
  stepLineActive: {
    height: 2,
    backgroundColor: '#10B981',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#FF6500',
    fontWeight: 'bold',
  },
  stepLabelCompleted: {
    color: '#333',
  },
  cancelledBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF2F2',
    borderColor: '#FFD1D1',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cancelledTextContainer: {
    flex: 1,
  },
  cancelledTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  cancelledSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  // Supplier Card
  supplierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  supplierCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplierLogoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supplierLogoEmoji: {
    fontSize: 22,
  },
  supplierTextInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  supplierSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  // Info Cards
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardHeaderSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardRowVertical: {
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#999',
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  cardValueBlock: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 4,
    fontWeight: '500',
  },
  cardValueLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentBadgePaid: {
    backgroundColor: '#E6F7F0',
  },
  paymentBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentBadgeTextPaid: {
    color: '#10B981',
  },
  paymentBadgeTextPending: {
    color: '#D97706',
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF5F0',
    borderRadius: 8,
    gap: 6,
  },
  invoiceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6500',
  },
  // Driver Row
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  driverSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Item List
  itemsList: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  // Action Container
  actionsContainer: {
    paddingVertical: 16,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#FF6500',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6500',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#FF6500',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dangerBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  dangerBtnText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
});
