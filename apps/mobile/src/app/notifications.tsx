import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppNotification, NotificationType } from '@/mocks/mockNotifications';
import { useInbox } from '@/hooks/use-inbox';

export default function NotificationsScreen() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useInbox();

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleNotificationPress = (notification: AppNotification) => {
    // Маркируем как прочитанное
    markNotificationAsRead(notification.id);

    // Если есть ссылка, переходим по ней
    if (notification.link) {
      console.log('Navigate to:', notification.link);
      router.push(notification.link as any);
    }
  };


  const getIconData = (type: NotificationType) => {
    switch (type) {
      case 'ORDER':
        return { icon: 'package' as const, color: '#4A7D00', bg: '#E6F4D2' };
      case 'PROMO':
        return { icon: 'percent' as const, color: '#FF6500', bg: '#FFF0E6' };
      case 'BILLING':
        return { icon: 'credit-card' as const, color: '#10B981', bg: '#ECFDF5' };
      case 'SYSTEM':
      default:
        return { icon: 'info' as const, color: '#007AFF', bg: '#E5F1FF' };
    }
  };

  const getLinkText = (link: string, type: NotificationType) => {
    if (link.startsWith('/(tabs)/orders/') || link.startsWith('/orders/')) return 'Перейти к заказу';
    if (link.startsWith('/chats/')) return 'Открыть чат';
    if (link.startsWith('/supplier/')) return 'К поставщику';
    if (link === '/weekly-purchase') return 'Открыть шаблон';
    return 'Подробнее';
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const { icon, color, bg } = getIconData(item.type);

    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !item.isRead && styles.notificationCardUnread]}
        activeOpacity={0.7}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <Feather name={icon} size={20} color={color} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
          </View>
          <ThemedText style={styles.message} numberOfLines={3}>
            {item.message}
          </ThemedText>
          {item.link && (
            <View style={styles.actionLinkRow}>
              <ThemedText style={styles.actionLinkLabel}>
                {getLinkText(item.link, item.type)}
              </ThemedText>
              <Feather name="arrow-right" size={14} color="#FF6500" />
            </View>
          )}
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Уведомления</ThemedText>
        <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.readAllButton}>
          <Feather name="check-circle" size={22} color="#FF6500" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color="#CCC" />
            <ThemedText style={styles.emptyTitle}>Нет уведомлений</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Здесь будут появляться статусы заказов и важные новости
            </ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  readAllButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notificationCardUnread: {
    borderColor: '#FFE0CC',
    backgroundColor: '#FFFCFA',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  actionLinkLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6500',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

