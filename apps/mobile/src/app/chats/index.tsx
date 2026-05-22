import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { mockSuppliers } from '@/mocks/homeData';
import { useInbox } from '@/hooks/use-inbox';
import { Chat } from '@/mocks/mockChats';

export default function ChatsScreen() {
  const { chats } = useInbox();

  const renderItem = ({ item }: { item: Chat }) => {
    const supplier = mockSuppliers.find(s => s.id === item.supplierId);
    if (!supplier) return null;

    return (
      <TouchableOpacity 
        style={styles.chatRow} 
        activeOpacity={0.7}
        onPress={() => router.push(`/chats/${item.id}`)}
      >
        <View style={styles.avatarContainer}>
          {/* Для заглушки используем первую букву имени */}
          <ThemedText style={styles.avatarText}>{supplier.name.charAt(0)}</ThemedText>
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeaderRow}>
            <ThemedText style={styles.supplierName} numberOfLines={1}>{supplier.name}</ThemedText>
            <ThemedText style={styles.messageDate}>{item.lastMessage.date}</ThemedText>
          </View>
          
          <View style={styles.chatFooterRow}>
            <ThemedText 
              style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]} 
              numberOfLines={2}
            >
              {item.lastMessage.sender === 'user' ? 'Вы: ' : ''}{item.lastMessage.text}
            </ThemedText>
            
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <ThemedText style={styles.unreadText}>{item.unreadCount}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Сообщения</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Список чатов */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    paddingBottom: 40,
  },
  chatRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF0E6', // Светло-оранжевый
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6500',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  supplierName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  messageDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  chatFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    marginRight: 12,
  },
  lastMessageUnread: {
    color: '#333',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FF6500',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 88, // Отступ на ширину аватарки + margin
  },
});
