import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
        {/* Кликабельный адрес */}
        <TouchableOpacity 
          style={styles.addressButton} 
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {formatAddress(selectedAddress?.fullAddress)}
          </ThemedText>
          <Feather name="chevron-down" size={16} color="#333" />
        </TouchableOpacity>

        {/* Кликабельный поиск */}
        <TouchableOpacity 
          style={styles.searchContainer}
          activeOpacity={0.8}
          onPress={() => router.push('/search')}
        >
          <Feather name="search" size={16} color="#999" style={styles.searchIcon} />
          <ThemedText style={styles.searchPlaceholder} numberOfLines={1}>
            Поиск...
          </ThemedText>
        </TouchableOpacity>

        {/* Иконки чатов и уведомлений */}
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
            <Feather name="message-square" size={22} color="#333" />
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
            <Feather name="bell" size={22} color="#333" />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 10,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 105,
    gap: 3,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E2D2',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#999',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#FFF',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 11,
  },
});
