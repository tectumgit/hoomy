import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const { width, height } = Dimensions.get('window');

export default function AddressMapScreen() {
  return (
    <View style={styles.container}>
      {/* Псевдо-карта: фон с сеткой и формами, имитирующими дома/улицы */}
      <View style={styles.mapBackground}>
        {/* Имитация дорог */}
        <View style={[styles.road, { top: 200, height: 10, width: width, transform: [{ rotate: '-10deg' }] }]} />
        <View style={[styles.road, { top: 0, left: 150, width: 12, height: height, transform: [{ rotate: '5deg' }] }]} />
        
        {/* Имитация зданий */}
        <View style={[styles.building, { top: 100, left: 50, width: 80, height: 60 }]} />
        <View style={[styles.building, { top: 300, left: 200, width: 100, height: 120 }]} />
        <View style={[styles.building, { top: 500, left: 40, width: 150, height: 50 }]} />
        <View style={[styles.building, { top: 150, left: 250, width: 70, height: 70 }]} />

        {/* Имитация зеленых зон */}
        <View style={[styles.park, { top: 50, left: 200, width: 150, height: 100, borderRadius: 50 }]} />
        <View style={[styles.park, { top: 600, left: 150, width: 200, height: 120, borderRadius: 60 }]} />
      </View>

      {/* Верхние элементы наложения */}
      <View style={styles.topOverlay}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} activeOpacity={0.8}>
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.addressDisplay}>
          <ThemedText style={styles.addressTitle} numberOfLines={2}>
            Пролетарская улица, 21,{'\n'}подъезд 2
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
          <Feather name="search" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Центральный маркер локации (находится строго по центру) */}
      <View style={styles.centerMarker} pointerEvents="none">
        <View style={styles.markerCircle}>
          <View style={styles.markerInnerDot} />
        </View>
        <View style={styles.markerShadow} />
      </View>

      {/* Кнопки справа (масштаб) */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7}>
          <Feather name="plus" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity style={styles.zoomButton} activeOpacity={0.7}>
          <Feather name="minus" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Кнопка геолокации */}
      <TouchableOpacity style={styles.geoButton} activeOpacity={0.8}>
        <Feather name="navigation" size={20} color="#333" />
      </TouchableOpacity>

      {/* Нижняя панель с кнопкой Готово */}
      <View style={styles.bottomOverlay}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={() => router.back()}>
          <ThemedText style={styles.primaryBtnText}>Готово</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4ED', // Цвет фона карты
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  building: {
    position: 'absolute',
    backgroundColor: '#EBEAE3',
    borderWidth: 1,
    borderColor: '#E2E1D9',
  },
  park: {
    position: 'absolute',
    backgroundColor: '#E5ECD8', // Зеленая зона
  },
  topOverlay: {
    position: 'absolute',
    top: 50, // Отступ от безопасной зоны
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addressDisplay: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
    paddingTop: 8,
  },
  addressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -48 }], // Центрирование
    alignItems: 'center',
    zIndex: 5,
  },
  markerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  markerInnerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  markerShadow: {
    width: 6,
    height: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    marginTop: -2,
    zIndex: -1,
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    top: '40%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  zoomButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 8,
  },
  geoButton: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  primaryBtn: {
    backgroundColor: '#FF6500', // Наш брендовый оранжевый
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF6500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
