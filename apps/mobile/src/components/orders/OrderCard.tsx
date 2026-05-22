import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MockOrder } from '@/mocks/ordersData';

interface OrderCardProps {
  order: MockOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = () => {
    switch (order.statusCode) {
      case 'assembly':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'delivering':
        return { bg: '#E3F2FD', text: '#1565C0' };
      case 'delivered':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'cancelled':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#F5F5F5', text: '#666666' };
    }
  };

  const statusColors = getStatusColor();
  const formatPrice = (kopecks: number) => (kopecks / 100).toLocaleString('ru-RU') + ' ₽';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.orderNumber}>Заказ №{order.number}</ThemedText>
        <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
      </View>

      <View style={styles.detailsRow}>
        <ThemedText style={styles.total}>{formatPrice(order.totalKopecks)}</ThemedText>
        <ThemedText style={styles.supplierName}>
          · {order.supplierName}
        </ThemedText>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <ThemedText style={[styles.statusText, { color: statusColors.text }]}>
            {order.status}
          </ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity 
        style={styles.detailsBtn} 
        activeOpacity={0.7}
        onPress={() => router.push(`/(tabs)/orders/${order.id}`)}
      >
        <ThemedText style={styles.detailsBtnText}>Подробнее</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Тень
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#999',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  supplierName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  detailsBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailsBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6500', // Основной брендовый цвет
  },
});
