import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatalogCard } from '@/components/category/CatalogCard';
import { ThemedText } from '@/components/themed-text';
import { mockCatalogGroups } from '@/mocks/homeData';

export default function CategoriesIndexScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Шапка Поиска */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.searchContainer}
          activeOpacity={0.8}
          onPress={() => router.push('/search')}
        >
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <ThemedText style={styles.searchPlaceholder}>
            Поиск по товарам, поставщикам...
          </ThemedText>
          <Feather name="maximize" size={20} color="#666" style={styles.scanIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {mockCatalogGroups.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} style={styles.groupContainer}>
            <ThemedText style={styles.groupTitle}>{group.title}</ThemedText>
            <View style={styles.grid}>
              {group.items.map((item, itemIndex) => (
                <CatalogCard
                  key={`${item.id}-${itemIndex}`}
                  id={item.id}
                  name={item.name}
                  iconEmoji={item.iconEmoji}
                  bgColor={item.bgColor}
                />
              ))}
            </View>
          </View>
        ))}
        {/* Отступ снизу */}
        <View style={{ height: 40 }} />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#999',
  },
  scanIcon: {
    marginLeft: 10,
  },
  scrollContent: {
    paddingTop: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    rowGap: 16,
  },
});
