import React, { createContext, useContext, useState } from 'react';
import { mockChats as initialChats, mockMessages as initialMessages, Chat, ChatMessage } from '@/mocks/mockChats';
import { mockNotifications as initialNotifications, AppNotification } from '@/mocks/mockNotifications';

interface InboxContextType {
  chats: Chat[];
  messages: Record<string, ChatMessage[]>;
  notifications: AppNotification[];
  unreadChatsCount: number;
  unreadNotificationsCount: number;
  markChatAsRead: (chatId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initialMessages);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Считаем непрочитанные чаты
  const unreadChatsCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Считаем непрочитанные уведомления
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Пометить чат прочитанным
  const markChatAsRead = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  // Отправить новое сообщение в чат
  const sendMessage = (chatId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      text: text.trim(),
      sender: 'user',
      date: 'Только что',
    };

    // Добавляем сообщение в историю
    setMessages(prevMsgs => ({
      ...prevMsgs,
      [chatId]: [...(prevMsgs[chatId] || []), newMessage],
    }));

    // Обновляем последнее сообщение в списке чатов
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: newMessage,
            }
          : chat
      )
    );
  };

  // Пометить одно уведомление прочитанным
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Пометить все уведомления прочитанными
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <InboxContext.Provider
      value={{
        chats,
        messages,
        notifications,
        unreadChatsCount,
        unreadNotificationsCount,
        markChatAsRead,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
}
