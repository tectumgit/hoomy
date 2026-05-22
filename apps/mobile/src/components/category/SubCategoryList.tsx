import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export interface SubCategory {
  id: string;
  name: string;
  iconEmoji: string;
}

interface SubCategoryListProps {
  items: SubCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function SubCategoryList({ items, activeId, onSelect }: SubCategoryListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = item.id === activeId;
          return (
            <TouchableOpacity
              style={[styles.itemContainer, isActive && styles.itemContainerActive]}
              onPress={() => onSelect(item.id)}
            >
              <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                <ThemedText style={styles.emojiText}>{item.iconEmoji}</ThemedText>
              </View>
              <ThemedText style={styles.nameText} numberOfLines={2}>
                {item.name}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
  },
  itemContainerActive: {
    backgroundColor: '#F3F6EB',
    borderWidth: 1,
    borderColor: '#E4EDCD',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBoxActive: {
    backgroundColor: '#fff',
  },
  emojiText: {
    fontSize: 28,
    lineHeight: 34,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 14,
  },
});
