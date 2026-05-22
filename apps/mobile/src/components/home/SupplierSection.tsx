import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Supplier } from '@hoomy/shared';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/use-api';
import { MockProduct } from '@/mocks/homeData';

interface SupplierSectionProps {
  supplier: Supplier;
}

export function SupplierSection({ supplier }: SupplierSectionProps) {
  const router = useRouter();
  const { data: products, loading } = useProducts(supplier.id);

  const minOrderRubles = (supplier.minOrderAmountKopecks / 100).toLocaleString('ru-RU');
  const freeDeliveryFromRubles = supplier.freeDeliveryFromKopecks 
    ? (supplier.freeDeliveryFromKopecks / 100).toLocaleString('ru-RU')
    : null;

  return (
    <View style={styles.container}>
      {/* Шапка поставщика */}
      <TouchableOpacity 
        style={styles.header}
        activeOpacity={0.8}
        onPress={() => router.push(`/supplier/${supplier.id}`)}
      >
        <View style={styles.avatarContainer}>
          <ThemedText style={styles.avatarEmoji}>{supplier.logoUrl}</ThemedText>
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.name}>{supplier.name}</ThemedText>
            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => router.push(`/supplier/${supplier.id}`)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.actionText}>Смотреть все</ThemedText>
              <Feather name="chevron-right" size={16} color="#FF6500" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color="#FF6500" />
            <ThemedText style={styles.ratingText}>{supplier.rating}</ThemedText>
            <ThemedText style={styles.reviewsText}>({supplier.reviewsCount} отзывов)</ThemedText>
          </View>
          
          <ThemedText style={styles.categoriesText}>{supplier.description}</ThemedText>
 
          <View style={styles.deliveryRow}>
            <Feather name="truck" size={12} color="#FF6500" />
            <ThemedText style={styles.deliveryText}>
              {freeDeliveryFromRubles ? `Бесплатная доставка от ${freeDeliveryFromRubles} ₽` : 'Доставка платная'}
            </ThemedText>
            <ThemedText style={styles.minOrderText}>Мин. заказ {minOrderRubles} ₽</ThemedText>
          </View>
        </View>
      </TouchableOpacity>

      {/* Список товаров поставщика */}
      {loading ? (
        <ActivityIndicator size="small" color="#FF6500" style={{ marginVertical: 20 }} />
      ) : (
        <FlatList
          data={products as MockProduct[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#E8E2D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E8E2D2',
  },
  avatarEmoji: {
    fontSize: 30,
    lineHeight: 36,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#FF6500',
    fontWeight: '600',
    marginRight: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
    marginRight: 6,
  },
  reviewsText: {
    fontSize: 12,
    color: '#888',
  },
  categoriesText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 11,
    color: '#FF6500',
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 12,
  },
  minOrderText: {
    fontSize: 11,
    color: '#888',
  },
  listContent: {
    paddingHorizontal: 20,
  },
});
