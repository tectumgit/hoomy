import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View, Animated } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAddress } from '@/hooks/use-address';

type AddressModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddressModal({ visible, onClose }: AddressModalProps) {
  const { addresses, selectedAddress, selectAddress } = useAddress();
  
  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      // Сброс анимаций перед открытием
      fadeAnim.setValue(0);
      slideAnim.setValue(500);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Полупрозрачная подложка с анимацией прозрачности */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropPressable} activeOpacity={1} onPress={handleClose} />
        </Animated.View>

        {/* Контент модального окна со слайд-анимацией снизу вверх */}
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Декоративная ручка (pull indicator) */}
          <View style={styles.pullIndicator} />

          {/* Шапка модалки */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerLeft} 
              activeOpacity={0.7}
              onPress={() => {
                handleClose();
                setTimeout(() => router.push('/address-map'), 250);
              }}
            >
              <View style={styles.locationPinContainer}>
                <View style={styles.locationPinInner} />
                <View style={styles.locationPinStick} />
              </View>
              <ThemedText style={styles.headerTitle}>Куда доставить?</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => {
                handleClose();
                setTimeout(() => router.push('/address-map'), 250);
              }}
            >
              <Feather name="arrow-right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Список адресов */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {addresses.map((item) => {
              const isSelected = selectedAddress?.id === item.id;
              const iconName = item.title === 'Дом' ? 'home' : item.title === 'Работа' ? 'briefcase' : 'bookmark';
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.addressItem, isSelected && styles.addressItemActive]}
                  activeOpacity={0.7}
                  onPress={() => {
                    selectAddress(item.id);
                    handleClose();
                  }}
                >
                  <View style={styles.iconContainer}>
                    <Feather 
                      name={iconName} 
                      size={24} 
                      color={isSelected ? '#FF6500' : '#333'} 
                    />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <ThemedText 
                      style={[styles.addressTitle, isSelected && styles.addressTitleActive]} 
                      numberOfLines={1}
                    >
                      {item.title}
                    </ThemedText>
                    <ThemedText 
                      style={[styles.addressSubtitle, isSelected && styles.addressSubtitleActive]} 
                      numberOfLines={1}
                    >
                      {item.fullAddress}
                    </ThemedText>
                  </View>
                  {isSelected && (
                    <Feather name="check" size={20} color="#FF6500" style={{ marginLeft: 8 }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingTop: 12,
  },
  pullIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPinContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  locationPinInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  locationPinStick: {
    position: 'absolute',
    bottom: -8,
    width: 2,
    height: 8,
    backgroundColor: '#FF6500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  addressSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  addressItemActive: {
    borderBottomColor: '#FFF2EB',
  },
  addressTitleActive: {
    color: '#FF6500',
    fontWeight: 'bold',
  },
  addressSubtitleActive: {
    color: '#FF8A3D',
  },
});
