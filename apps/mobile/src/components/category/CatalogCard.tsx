import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');
const GAP = 8;
// 3 колонки, паддинги контейнера по бокам 20 (итого 40), 2 разрыва (gap) по 8
const CARD_WIDTH = Math.floor((width - 40 - GAP * 2) / 3);

interface CatalogCardProps {
  id: string;
  name: string;
  iconEmoji: string;
  bgColor: string;
}

export function CatalogCard({ id, name, iconEmoji, bgColor }: CatalogCardProps) {
  const handlePress = () => {
    router.push({ pathname: '/(tabs)/categories/[id]', params: { id: id } });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={handlePress}>
      <ThemedText style={styles.nameText} numberOfLines={3}>
        {name}
      </ThemedText>
      <ThemedText style={styles.emojiDecor}>{iconEmoji}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 12,
    padding: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    lineHeight: 16,
    zIndex: 2,
  },
  emojiDecor: {
    position: 'absolute',
    right: -15,
    bottom: -15,
    fontSize: 70,
    lineHeight: 80,
    zIndex: 1,
  },
});
