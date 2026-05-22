import { mockSuppliers } from './homeData';

export type MessageSender = 'user' | 'supplier';

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  sender: MessageSender;
  date: string; // ISO string или просто время
}

export interface Chat {
  id: string; // Обычно равен supplierId для простоты моков
  supplierId: string;
  unreadCount: number;
  lastMessage: ChatMessage;
}

// Заглушки сообщений
export const mockMessages: Record<string, ChatMessage[]> = {
  'sup_1': [
    {
      id: 'm1',
      chatId: 'sup_1',
      text: 'Здравствуйте! Подскажите, картофель свежего урожая?',
      sender: 'user',
      date: '10:15',
    },
    {
      id: 'm2',
      chatId: 'sup_1',
      text: 'Добрый день! Да, вчера привезли с фермы. Очень хороший, советую.',
      sender: 'supplier',
      date: '10:20',
    },
    {
      id: 'm3',
      chatId: 'sup_1',
      text: 'Отлично, добавлю в заказ.',
      sender: 'user',
      date: '10:22',
    },
    {
      id: 'm4',
      chatId: 'sup_1',
      text: 'Будем рады вашему заказу! Если что, пишите.',
      sender: 'supplier',
      date: '10:25',
    },
  ],
  'sup_2': [
    {
      id: 'm5',
      chatId: 'sup_2',
      text: 'Здравствуйте. Молоко пастеризованное?',
      sender: 'user',
      date: 'Вчера',
    },
    {
      id: 'm6',
      chatId: 'sup_2',
      text: 'Да, конечно. Срок годности 5 суток.',
      sender: 'supplier',
      date: 'Вчера',
    },
  ],
  'sup_3': [
    {
      id: 'm7',
      chatId: 'sup_3',
      text: 'А у вас есть трюфели в наличии?',
      sender: 'user',
      date: 'Среда',
    },
  ]
};

// Заглушки чатов (id чата = supplierId)
export const mockChats: Chat[] = [
  {
    id: 'sup_1',
    supplierId: 'sup_1', // Фруктовый двор
    unreadCount: 1,
    lastMessage: mockMessages['sup_1'][mockMessages['sup_1'].length - 1],
  },
  {
    id: 'sup_2',
    supplierId: 'sup_2', // Молочная база
    unreadCount: 0,
    lastMessage: mockMessages['sup_2'][mockMessages['sup_2'].length - 1],
  },
  {
    id: 'sup_3',
    supplierId: 'sup_3', // Грибной дом
    unreadCount: 0,
    lastMessage: mockMessages['sup_3'][mockMessages['sup_3'].length - 1],
  },
];
