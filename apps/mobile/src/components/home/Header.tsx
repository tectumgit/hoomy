import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AddressModal } from './AddressModal';
import { useAddress } from '@/hooks/use-address';
import { useInbox } from '@/hooks/use-inbox';

export function Header() {
  const [isModalVisible, setModalVisible] = useState(false);
  const { selectedAddress } = useAddress();
  const { unreadNotificationsCount, unreadChatsCount } = useInbox();

  const formatAddress = (addressStr?: string) => {
    if (!addressStr) return 'Выберите адрес';
    // Убираем город (все символы до первой запятой и последующие пробелы)
    return addressStr.replace(/^[^,]+,\s*/, '');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topRow}>
          {/* Кликабельный адрес */}
          <TouchableOpacity 
            style={styles.greetingInfo} 
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.locationRow}>
              <ThemedText style={styles.locationText} numberOfLines={1}>
                {formatAddress(selectedAddress?.fullAddress)}
              </ThemedText>
              <Feather name="chevron-down" size={20} color="#333" />
            </View>
          </TouchableOpacity>

          <View style={styles.iconsRow}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/chats')}
              activeOpacity={0.7}
            >
              {unreadChatsCount > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {unreadChatsCount > 9 ? '9+' : unreadChatsCount}
                  </ThemedText>
                </View>
              )}
              <Feather name="message-square" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/notifications')}
              activeOpacity={0.7}
            >
              {unreadNotificationsCount > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </ThemedText>
                </View>
              )}
              <Feather name="bell" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск товаров, поставщиков и категорий"
            placeholderTextColor="#999"
          />
          <TouchableOpacity>
            <Feather name="maximize" size={20} color="#FF6500" />
          </TouchableOpacity>
        </View>
      </View>

      <AddressModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E2D2',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
});
