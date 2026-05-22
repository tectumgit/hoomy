import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function FiltersRow() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Кнопка Фильтры */}
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Feather name="sliders" size={16} color="#FF6500" style={{ marginRight: 6 }} />
          <ThemedText style={[styles.filterText, { color: '#FF6500' }]}>Фильтры</ThemedText>
        </TouchableOpacity>

        {/* Сортировка */}
        <TouchableOpacity style={styles.filterButton}>
          <ThemedText style={styles.filterText}>Сортировка</ThemedText>
          <Feather name="chevron-down" size={16} color="#333" style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* Цена */}
        <TouchableOpacity style={styles.filterButton}>
          <ThemedText style={styles.filterText}>Цена</ThemedText>
          <Feather name="chevron-down" size={16} color="#333" style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* Производитель */}
        <TouchableOpacity style={styles.filterButton}>
          <ThemedText style={styles.filterText}>Производитель</ThemedText>
          <Feather name="chevron-down" size={16} color="#333" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* Переключатель вида справа (вне скролла) */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity style={styles.viewToggleButton}>
          <Feather name="grid" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginBottom: 20,
  },
  scrollContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E2D2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#FFF2EB',
    borderColor: '#FFD3B5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  viewToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  viewToggleButton: {
    backgroundColor: '#FAF8F5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E2D2',
  },
});
