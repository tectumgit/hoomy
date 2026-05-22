export type NotificationType = 'ORDER' | 'PROMO' | 'SYSTEM' | 'BILLING';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif_6',
    type: 'SYSTEM',
    title: 'Сообщение от поставщика',
    message: 'Фермер Казань: "Мы отправили вам обновленный прайс-лист на овощи." Спешите ознакомиться.',
    timestamp: '5 минут назад',
    isRead: false,
    link: '/chats/sup_1',
  },
  {
    id: 'notif_8',
    type: 'BILLING',
    title: 'Счет на оплату сформирован',
    message: 'Сформирован счет для заказа №1024 (Фермер Казань) на сумму 3 500 ₽. Пожалуйста, оплатите его до 22 мая.',
    timestamp: '1 час назад',
    isRead: false,
    link: '/(tabs)/orders/ord_1',
  },
  {
    id: 'notif_1',
    type: 'ORDER',
    title: 'Заказ подтвержден',
    message: 'Ваш заказ №1024 у поставщика "Фермер Казань" успешно подтвержден и готовится к сборке.',
    timestamp: '2 часа назад',
    isRead: false,
    link: '/(tabs)/orders/ord_1',
  },
  {
    id: 'notif_7',
    type: 'PROMO',
    title: 'Снижен лимит минимального заказа',
    message: 'Поставщик "Мясной опт" временно снизил минимальную сумму заказа до 3 000 ₽! Закажите мясо по выгодной цене.',
    timestamp: '3 часа назад',
    isRead: false,
    link: '/supplier/sup_3',
  },
  {
    id: 'notif_5',
    type: 'SYSTEM',
    title: 'Время плановой закупки',
    message: 'Ваш шаблон "Закупка на неделю" готов. Разместите заказ сегодня до 18:00, чтобы получить доставку в пятницу.',
    timestamp: '5 часов назад',
    isRead: false,
    link: '/weekly-purchase',
  },
  {
    id: 'notif_2',
    type: 'PROMO',
    title: 'Скидка на фермерское молоко',
    message: 'Успейте заказать свежее молоко со скидкой 10% до конца недели у поставщика "Молочная база".',
    timestamp: 'Вчера, 14:30',
    isRead: true,
    link: '/supplier/sup_2',
  },
  {
    id: 'notif_3',
    type: 'SYSTEM',
    title: 'Добро пожаловать в Hoomy!',
    message: 'Рады видеть вас. Теперь вы можете заказывать свежие продукты большими объемами напрямую у локальных фермеров и поставщиков.',
    timestamp: '3 дня назад',
    isRead: true,
  },
  {
    id: 'notif_4',
    type: 'ORDER',
    title: 'Заказ доставлен',
    message: 'Ваш заказ №1025 у поставщика "Молочная база" был успешно доставлен. Спасибо за заказ!',
    timestamp: '4 дня назад',
    isRead: true,
    link: '/(tabs)/orders/ord_2',
  }
];
