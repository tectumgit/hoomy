import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrderCard } from '@/components/orders/OrderCard';
import { ThemedText } from '@/components/themed-text';
import { mockOrders } from '@/mocks/ordersData';

type TabType = 'current' | 'history';

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('current');

  const filteredOrders = mockOrders.filter((order) => order.type === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Шапка */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Заказы</ThemedText>
      </View>

      {/* Табы */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
          activeOpacity={0.7}>
          <ThemedText style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
            Текущие
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}>
          <ThemedText style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            История
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Список */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              У вас пока нет заказов в этой категории
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 34,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#FF6500',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
