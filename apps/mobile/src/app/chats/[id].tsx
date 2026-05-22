import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { mockSuppliers } from '@/mocks/homeData';
import { ChatMessage } from '@/mocks/mockChats';
import { useInbox } from '@/hooks/use-inbox';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const supplierId = id; // В моках id чата совпадает с supplierId
  
  const { messages: globalMessages, sendMessage, markChatAsRead } = useInbox();

  // При открытии чата сбрасываем непрочитанные сообщения
  useEffect(() => {
    if (supplierId) {
      markChatAsRead(supplierId);
    }
  }, [supplierId]);

  let supplier = mockSuppliers.find(s => s.id === supplierId);
  if (!supplier) {
    supplier = {
      id: supplierId,
      name: `Поставщик #${supplierId}`,
      logoUrl: '🏢',
      coverUrl: '',
      description: 'Оптовый поставщик',
      city: 'Казань',
      districts: [],
      rating: 5,
      reviewsCount: 0,
      minOrderAmountKopecks: 0,
      baseDeliveryFeeKopecks: 0,
      deliveryDays: [],
      deliveryWindows: [],
      categories: [],
      status: 'approved',
    };
  }
  
  const messages = globalMessages[supplierId] || [];
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || !supplierId) return;
    sendMessage(supplierId, inputText.trim());
    setInputText('');
  };


  if (!supplier) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Чат не найден</ThemedText>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Шапка чата */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>{supplier.name}</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Был(а) недавно</ThemedText>
        </View>
        
        <TouchableOpacity style={styles.headerRightBtn}>
          <Feather name="more-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyBadge}>
                <ThemedText style={styles.emptyText}>Здесь пока нет сообщений</ThemedText>
              </View>
            </View>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View 
                  key={msg.id} 
                  style={[styles.messageBubble, isUser ? styles.messageUser : styles.messageSupplier]}
                >
                  <ThemedText style={[styles.messageText, isUser && styles.messageTextUser]}>
                    {msg.text}
                  </ThemedText>
                  <ThemedText style={[styles.messageTime, isUser && styles.messageTimeUser]}>
                    {msg.date}
                  </ThemedText>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Панель ввода */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Feather name="paperclip" size={24} color="#999" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Сообщение..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={20} color={inputText.trim() ? "#FFF" : "#999"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  headerRightBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyBadge: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 13,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6500',
    borderBottomRightRadius: 4,
  },
  messageSupplier: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageTimeUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  attachBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#F5F5F5',
  },
});
