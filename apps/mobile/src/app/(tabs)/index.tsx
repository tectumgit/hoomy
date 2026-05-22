import { router } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Banners } from '@/components/home/Banners';
import { CategoryItem } from '@/components/home/CategoryItem';
import { Header } from '@/components/home/Header';
import { ProductCard } from '@/components/home/ProductCard';
import { SectionTitle } from '@/components/home/SectionTitle';
import { SupplierSection } from '@/components/home/SupplierSection';
import { ThemedView } from '@/components/themed-view';

import { mockCategories, MockProduct } from '@/mocks/homeData';
import { useSuppliers, usePopularProducts } from '@/hooks/use-api';

export default function HomeScreen() {
  const { data: suppliers, loading: suppliersLoading } = useSuppliers();
  const { data: popular, loading: popularLoading } = usePopularProducts();

  const isLoading = suppliersLoading || popularLoading;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6500" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Header />

            <SectionTitle 
              title="Популярное у поставщиков" 
              actionText="Смотреть все" 
              onActionPress={() => router.push('/discounts')} 
            />
            <FlatList
              data={popular as MockProduct[]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ProductCard product={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />

            <SectionTitle 
              title="Категории" 
              actionText="Все категории" 
              onActionPress={() => router.push('/(tabs)/categories')} 
            />
            <FlatList
              data={mockCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CategoryItem category={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />

            <Banners />

            <SectionTitle title="Поставщики и лучшие предложения" />
            {suppliers.map((supplier) => (
              <SupplierSection
                key={supplier.id}
                supplier={supplier}
              />
            ))}

            {/* Отступ снизу для таб-бара */}
            <View style={{ height: 40 }} />

          </ScrollView>
        )}
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
  scrollContent: {
    paddingBottom: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

