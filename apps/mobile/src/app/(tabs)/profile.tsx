import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { mockUser } from '@/mocks/userData';

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(mockUser.avatarUrl || null);

  const formatKopecks = (kopecks: number) => (kopecks / 100).toLocaleString('ru-RU') + ' ₽';

  const defaultAddress = mockUser.addresses.find(a => a.isDefault) || mockUser.addresses[0];

  const handleLogout = () => {
    Alert.alert(
      "Выход из аккаунта",
      "Вы уверены, что хотите выйти?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Выйти", style: "destructive", onPress: () => console.log("Выход") }
      ]
    );
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Разрешение требуется", "Для загрузки аватара необходим доступ к галерее.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Профиль</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Карточка пользователя */}
        <View style={styles.userCard}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <ThemedText style={styles.avatarText}>
                {mockUser.firstName.charAt(0)}{mockUser.lastName.charAt(0)}
              </ThemedText>
            )}
            <View style={styles.avatarBadge}>
              <Feather name="camera" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{mockUser.firstName} {mockUser.lastName}</ThemedText>
            <ThemedText style={styles.userPhone}>{mockUser.phone}</ThemedText>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Редактирование', 'Раздел в разработке')}>
            <Feather name="edit-2" size={20} color="#FF6500" />
          </TouchableOpacity>
        </View>

        {/* Блок статистики */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{mockUser.stats.ordersCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Заказов</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statValue}>{formatKopecks(mockUser.stats.savedKopecks)}</ThemedText>
            <ThemedText style={styles.statLabel}>Сэкономлено</ThemedText>
          </View>
        </View>

        {/* Адреса доставки */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Адрес доставки</ThemedText>
          
          {defaultAddress && (
            <TouchableOpacity 
              style={styles.addressCard}
              onPress={() => router.push('/address-map')}
              activeOpacity={0.7}
            >
              <View style={styles.addressIconContainer}>
                <Feather name="map-pin" size={20} color="#FF6500" />
              </View>
              <View style={styles.addressInfo}>
                <ThemedText style={styles.addressTitle}>{defaultAddress.title}</ThemedText>
                <ThemedText style={styles.addressText} numberOfLines={2}>
                  {defaultAddress.fullAddress}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.addAddressBtn}
            onPress={() => router.push('/address-map')}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={20} color="#FF6500" />
            <ThemedText style={styles.addAddressText}>Добавить адрес</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Меню навигации */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Настройки</ThemedText>
          <View style={styles.menuCard}>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/orders')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="clipboard" size={20} color="#333" />
              </View>
              <ThemedText style={styles.menuText}>История заказов</ThemedText>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/chats/sup_support')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="headphones" size={20} color="#333" />
              </View>
              <ThemedText style={styles.menuText}>Служба поддержки</ThemedText>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert('Документы', 'Раздел правовых документов в разработке')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="file-text" size={20} color="#333" />
              </View>
              <ThemedText style={styles.menuText}>Правовые документы</ThemedText>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>

          </View>
        </View>

        {/* Кнопка выхода */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.logoutText}>Выйти из аккаунта</ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF6500',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    color: '#666',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6500',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
    marginRight: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 101, 0, 0.2)',
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6500',
    marginLeft: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 64,
  },
  logoutBtn: {
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});
