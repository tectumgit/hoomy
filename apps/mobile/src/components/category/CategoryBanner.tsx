import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export function CategoryBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>Выгодные наборы овощей</ThemedText>
          <ThemedText style={styles.subtitle}>Оптовые цены от проверенных поставщиков</ThemedText>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>Смотреть наборы</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.emojiDecor}>🥗</ThemedText>
      </View>

      <View style={styles.pagination}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  banner: {
    backgroundColor: '#FFF2EB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6500',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    paddingRight: 20,
  },
  button: {
    backgroundColor: '#FF6500',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emojiDecor: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    fontSize: 80,
    lineHeight: 90,
    opacity: 0.9,
    zIndex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8E2D2',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF6500',
  },
});
