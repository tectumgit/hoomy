export interface MockOrder {
  id: string;
  number: string;
  status: string;
  statusCode: 'assembly' | 'delivering' | 'delivered' | 'cancelled';
  totalKopecks: number;
  supplierId: string;
  supplierName: string;
  date: string;
  deliveryTime: string;
  type: 'current' | 'history';
  address: string;
  paymentStatus: 'Оплачен' | 'Ожидает оплаты' | 'Ошибка оплаты';
  paymentMethod: string;
  totalWeightKg: number;
  vatKopecks: number;
  driverName?: string;
  driverPhone?: string;
  items: Array<{
    id: string;
    name: string;
    iconEmoji: string;
    quantity: number;
    unit: string;
    unitPriceKopecks: number;
  }>;
}

export const mockOrders: MockOrder[] = [
  {
    id: 'ord_1',
    number: '1024',
    status: 'В сборке',
    statusCode: 'assembly',
    totalKopecks: 350000, // 3 500 руб
    supplierId: 'sup_1',
    supplierName: 'Фермер Казань',
    date: '20 мая',
    deliveryTime: '10:00 - 18:00',
    type: 'current',
    address: 'г. Казань, ул. Баумана, д. 12, ресторан "Волга"',
    paymentStatus: 'Оплачен',
    paymentMethod: 'Безналичный расчет (по счету)',
    totalWeightKg: 25,
    vatKopecks: 58333, // НДС 20%
    driverName: 'Алексей Иванов',
    driverPhone: '+7 (999) 123-45-67',
    items: [
      { id: 'item_1', name: 'Картофель отборный', iconEmoji: '🥔', quantity: 10, unit: 'кг', unitPriceKopecks: 12000 },
      { id: 'item_2', name: 'Яйца фермерские C0', iconEmoji: '🥚', quantity: 30, unit: 'шт', unitPriceKopecks: 7600 },
    ],
  },
  {
    id: 'ord_2',
    number: '1025',
    status: 'В пути',
    statusCode: 'delivering',
    totalKopecks: 320000, // 3 200 руб
    supplierId: 'sup_2',
    supplierName: 'Молочная база',
    date: '22 мая',
    deliveryTime: '12:00 - 16:00',
    type: 'current',
    address: 'г. Казань, ул. Пушкина, д. 24, кофейня "Сливки"',
    paymentStatus: 'Оплачен',
    paymentMethod: 'Банковская карта (B2B)',
    totalWeightKg: 10,
    vatKopecks: 53333,
    driverName: 'Михаил Петров',
    driverPhone: '+7 (905) 987-65-43',
    items: [
      { id: 'item_3', name: 'Молоко пастеризованное 3.2%', iconEmoji: '🥛', quantity: 20, unit: 'л', unitPriceKopecks: 9000 },
      { id: 'item_4', name: 'Творог пластовой 5%', iconEmoji: '🧀', quantity: 2, unit: 'кг', unitPriceKopecks: 70000 },
    ],
  },
  {
    id: 'ord_3',
    number: '980',
    status: 'Доставлен',
    statusCode: 'delivered',
    totalKopecks: 1250000, // 12 500 руб
    supplierId: 'sup_3',
    supplierName: 'Мясной опт',
    date: '10 мая',
    deliveryTime: '09:00 - 15:00',
    type: 'history',
    address: 'г. Казань, ул. Сибгата Хакима, д. 5, кафе "Гриль-Хаус"',
    paymentStatus: 'Оплачен',
    paymentMethod: 'Безналичный расчет (по счету)',
    totalWeightKg: 20,
    vatKopecks: 208333,
    driverName: 'Сергей Смирнов',
    driverPhone: '+7 (917) 555-44-33',
    items: [
      { id: 'item_5', name: 'Куриное филе охлажденное', iconEmoji: '🍗', quantity: 25, unit: 'кг', unitPriceKopecks: 50000 },
    ],
  },
  {
    id: 'ord_4',
    number: '915',
    status: 'Отменен',
    statusCode: 'cancelled',
    totalKopecks: 150000, // 1 500 руб
    supplierId: 'sup_4',
    supplierName: 'Бакалея Плюс',
    date: '2 апреля',
    deliveryTime: '14:00 - 20:00',
    type: 'history',
    address: 'г. Казань, ул. Баумана, д. 12, ресторан "Волга"',
    paymentStatus: 'Ожидает оплаты',
    paymentMethod: 'Безналичный расчет (по счету)',
    totalWeightKg: 15,
    vatKopecks: 25000,
    items: [
      { id: 'item_6', name: 'Гречневая крупа ядрица', iconEmoji: '🌾', quantity: 15, unit: 'кг', unitPriceKopecks: 10000 },
    ],
  },
];
