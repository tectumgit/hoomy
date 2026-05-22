import { Category, Product, Supplier } from '@hoomy/shared';

// -- Категории --
export const mockCategories: Category[] = [
  { id: 'cat_1', name: 'Овощи\nи зелень', iconEmoji: '🥬' },
  { id: 'cat_2', name: 'Фрукты\nи ягоды', iconEmoji: '🍊' },
  { id: 'cat_3', name: 'Молочные\nпродукты', iconEmoji: '🧀' },
  { id: 'cat_4', name: 'Мясо\nи птица', iconEmoji: '🥩' },
  { id: 'cat_5', name: 'Бакалея\n', iconEmoji: '🍝' },
  { id: 'cat_6', name: 'Для дома\nи бизнеса', iconEmoji: '🧼' },
];

// -- Подкатегории (для "Овощи и зелень") --
export const mockSubCategories = [
  { id: 'sub_all', categoryId: 'cat_1', name: 'Все овощи', iconEmoji: '🥗' },
  { id: 'sub_1', categoryId: 'cat_1', name: 'Картофель', iconEmoji: '🥔' },
  { id: 'sub_2', categoryId: 'cat_1', name: 'Томаты', iconEmoji: '🍅' },
  { id: 'sub_3', categoryId: 'cat_1', name: 'Огурцы', iconEmoji: '🥒' },
  { id: 'sub_4', categoryId: 'cat_1', name: 'Перец', iconEmoji: '🫑' },
  { id: 'sub_5', categoryId: 'cat_1', name: 'Лук и чеснок', iconEmoji: '🧅' },
  { id: 'sub_6', categoryId: 'cat_1', name: 'Зелень', iconEmoji: '🥬' },
];

// -- Поставщики --
export const mockSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Фруктовый двор',
    logoUrl: '🍊',
    coverUrl: '',
    description: 'Свежие фрукты и овощи оптом',
    city: 'Москва',
    districts: [],
    rating: 4.9,
    reviewsCount: 245,
    minOrderAmountKopecks: 300000, // 3000 руб
    baseDeliveryFeeKopecks: 0,
    freeDeliveryFromKopecks: 1500000, // Бесплатная доставка от 15000 руб
    deliveryDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
    deliveryWindows: [],
    categories: ['cat_1', 'cat_2'],
    status: 'approved',
    boostLevel: 2, // 50% буст
    popularityScore: 95,
    distanceKm: 5.4,
  },
  {
    id: 'sup_2',
    name: 'Молочная ферма',
    logoUrl: '🥛',
    coverUrl: '',
    description: 'Молочные продукты • Сыры',
    city: 'Москва',
    districts: [],
    rating: 4.8,
    reviewsCount: 189,
    minOrderAmountKopecks: 150000, // 1500 руб
    baseDeliveryFeeKopecks: 0,
    freeDeliveryFromKopecks: 800000, // 8000 руб
    deliveryDays: ['Пн', 'Ср', 'Пт'],
    deliveryWindows: [],
    categories: ['cat_3'],
    status: 'approved',
    boostLevel: 0, // Без буста
    popularityScore: 82,
    distanceKm: 12.1,
  },
  {
    id: 'sup_3',
    name: 'Мясной опт',
    logoUrl: '🥩',
    coverUrl: '',
    description: 'Мясо • Птица • Колбасы',
    city: 'Москва',
    districts: [],
    rating: 3.2, // Низкий рейтинг для проверки системы безопасности!
    reviewsCount: 312,
    minOrderAmountKopecks: 500000, // 5000 руб
    baseDeliveryFeeKopecks: 0,
    freeDeliveryFromKopecks: 2000000, // 20000 руб
    deliveryDays: ['Вт', 'Чт', 'Сб'],
    deliveryWindows: [],
    categories: ['cat_4'],
    status: 'approved',
    boostLevel: 3, // Максимальный буст, но заниженный качеством
    popularityScore: 78,
    distanceKm: 18.5,
  },
  {
    id: 'sup_4',
    name: 'Бакалея Плюс',
    logoUrl: '🛒',
    coverUrl: '',
    description: 'Бакалея • Крупы • Масла',
    city: 'Москва',
    districts: [],
    rating: 4.6,
    reviewsCount: 156,
    minOrderAmountKopecks: 100000, // 1000 руб
    baseDeliveryFeeKopecks: 0,
    freeDeliveryFromKopecks: 700000, // 7000 руб
    deliveryDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    deliveryWindows: [],
    categories: ['cat_5'],
    status: 'approved',
    boostLevel: 1, // 20% буст
    popularityScore: 64,
    distanceKm: 3.2,
  },
];

// -- Товары --
// Добавим поле для эмодзи-заглушки (временно расширяем тип Product или просто используем imageUrl)
export type MockProduct = Product & { mockEmoji?: string; supplierName?: string };

export const mockProducts: MockProduct[] = [
  // Фруктовый двор
  {
    id: 'prod_1',
    supplierId: 'sup_1',
    categoryId: 'cat_2',
    name: 'Апельсины',
    imageUrl: '',
    mockEmoji: '🍊',
    description: '',
    priceKopecks: 195000, // 1950 руб
    discountPriceKopecks: 145000, // 1450 руб (Скидка)
    unit: 'kg',
    minQuantity: 25,
    orderStep: 5,
    stockQuantity: 1000,
    status: 'active',
    supplierName: 'Фруктовый двор',
  },
  {
    id: 'prod_2',
    supplierId: 'sup_1',
    categoryId: 'cat_2',
    name: 'Яблоки',
    imageUrl: '',
    mockEmoji: '🍎',
    description: '',
    priceKopecks: 189000, // 1890 руб
    unit: 'kg',
    minQuantity: 25,
    orderStep: 5,
    stockQuantity: 500,
    status: 'active',
    supplierName: 'Фруктовый двор',
  },
  {
    id: 'prod_3',
    supplierId: 'sup_1',
    categoryId: 'cat_2',
    name: 'Бананы',
    imageUrl: '',
    mockEmoji: '🍌',
    description: '',
    priceKopecks: 175000, // 1750 руб
    unit: 'kg',
    minQuantity: 18,
    orderStep: 1,
    stockQuantity: 200,
    status: 'active',
    supplierName: 'Фруктовый двор',
  },
  {
    id: 'prod_4',
    supplierId: 'sup_1',
    categoryId: 'cat_1',
    name: 'Огурцы',
    imageUrl: '',
    mockEmoji: '🥒',
    description: '',
    priceKopecks: 65000, // 650 руб
    unit: 'kg',
    minQuantity: 10,
    orderStep: 5,
    stockQuantity: 300,
    status: 'active',
    supplierName: 'Фруктовый двор',
  },
  {
    id: 'prod_5',
    supplierId: 'sup_1',
    categoryId: 'cat_1',
    name: 'Томаты',
    imageUrl: '',
    mockEmoji: '🍅',
    description: '',
    priceKopecks: 72000, // 720 руб
    unit: 'kg',
    minQuantity: 10,
    orderStep: 5,
    stockQuantity: 300,
    status: 'active',
    supplierName: 'Фруктовый двор',
  },
  {
    id: 'prod_6',
    supplierId: 'sup_1',
    categoryId: 'cat_2',
    name: 'Авокадо',
    imageUrl: '',
    mockEmoji: '🥑',
    description: '',
    priceKopecks: 125000, // 1250 руб
    unit: 'kg',
    minQuantity: 5,
    orderStep: 1,
    stockQuantity: 100,
    status: 'active',
    supplierName: 'Фруктовый двор',
  },

  // Молочная ферма
  {
    id: 'prod_7',
    supplierId: 'sup_2',
    categoryId: 'cat_3',
    name: 'Молоко 2,5%',
    imageUrl: '',
    mockEmoji: '🥛',
    description: '12 шт × 1 л',
    priceKopecks: 96000, // 960 руб
    discountPriceKopecks: 78000, // 780 руб (Скидка)
    unit: 'pack', // Используем 'pack' как ящик/упаковку
    minQuantity: 1,
    orderStep: 1,
    stockQuantity: 50,
    status: 'active',
    supplierName: 'Молочная ферма',
  },
  {
    id: 'prod_8',
    supplierId: 'sup_2',
    categoryId: 'cat_3',
    name: 'Сметана 20%',
    imageUrl: '',
    mockEmoji: '🥣',
    description: '8 шт × 400 г',
    priceKopecks: 78000, // 780 руб
    unit: 'pack',
    minQuantity: 1,
    orderStep: 1,
    stockQuantity: 40,
    status: 'active',
    supplierName: 'Молочная ферма',
  },
  {
    id: 'prod_9',
    supplierId: 'sup_2',
    categoryId: 'cat_3',
    name: 'Сыр Гауда',
    imageUrl: '',
    mockEmoji: '🧀',
    description: '',
    priceKopecks: 95000, // 950 руб
    unit: 'kg',
    minQuantity: 1,
    orderStep: 1,
    stockQuantity: 100,
    status: 'active',
    supplierName: 'Молочная ферма',
  },
  {
    id: 'prod_10',
    supplierId: 'sup_2',
    categoryId: 'cat_3',
    name: 'Творог 5%',
    imageUrl: '',
    mockEmoji: '🥡',
    description: '',
    priceKopecks: 125000, // 1250 руб
    unit: 'kg',
    minQuantity: 5,
    orderStep: 1,
    stockQuantity: 60,
    status: 'active',
    supplierName: 'Молочная ферма',
  },

  // Мясной опт
  {
    id: 'prod_11',
    supplierId: 'sup_3',
    categoryId: 'cat_4',
    name: 'Филе куриное',
    imageUrl: '',
    mockEmoji: '🍗',
    description: '',
    priceKopecks: 245000, // 2450 руб
    discountPriceKopecks: 195000, // 1950 руб (Скидка)
    unit: 'kg',
    minQuantity: 10,
    orderStep: 5,
    stockQuantity: 500,
    status: 'active',
    supplierName: 'Мясной опт',
  },
  {
    id: 'prod_12',
    supplierId: 'sup_3',
    categoryId: 'cat_4',
    name: 'Говядина',
    imageUrl: '',
    mockEmoji: '🥩',
    description: '',
    priceKopecks: 550000, // 5500 руб
    unit: 'kg',
    minQuantity: 10,
    orderStep: 5,
    stockQuantity: 200,
    status: 'active',
    supplierName: 'Мясной опт',
  },
  {
    id: 'prod_13',
    supplierId: 'sup_3',
    categoryId: 'cat_4',
    name: 'Свинина',
    imageUrl: '',
    mockEmoji: '🥓',
    description: '',
    priceKopecks: 420000, // 4200 руб
    unit: 'kg',
    minQuantity: 10,
    orderStep: 5,
    stockQuantity: 300,
    status: 'active',
    supplierName: 'Мясной опт',
  },

  // Бакалея Плюс
  {
    id: 'prod_14',
    supplierId: 'sup_4',
    categoryId: 'cat_5',
    name: 'Гречневая крупа',
    imageUrl: '',
    mockEmoji: '🌾',
    description: '',
    priceKopecks: 78000, // 780 руб
    unit: 'kg',
    minQuantity: 10,
    orderStep: 5,
    stockQuantity: 1000,
    status: 'active',
    supplierName: 'Бакалея Плюс',
  },
  {
    id: 'prod_15',
    supplierId: 'sup_4',
    categoryId: 'cat_5',
    name: 'Масло подсолн.',
    imageUrl: '',
    mockEmoji: '🍾',
    description: '',
    priceKopecks: 115000, // 1150 руб
    unit: 'l',
    minQuantity: 5,
    orderStep: 5,
    stockQuantity: 500,
    status: 'active',
    supplierName: 'Бакалея Плюс',
  },
];

// Популярные товары для верхней карусели
export const popularProducts = [
  mockProducts[0], // Апельсины
  mockProducts[6], // Молоко
  mockProducts[10], // Филе куриное
  mockProducts[13], // Гречневая крупа
  mockProducts[14], // Масло
];

// -- Группированный каталог для экрана "Категории" --
export const mockCatalogGroups = [
  {
    title: 'Овощи, фрукты, орехи',
    items: [
      { id: 'cat_1', name: 'Самый сезон', iconEmoji: '🍒', bgColor: '#E6F4D2' },
      { id: 'cat_1', name: 'Овощи, зелень, грибы', iconEmoji: '🍅', bgColor: '#E6F4D2' },
      { id: 'cat_1', name: 'Фрукты, ягоды', iconEmoji: '🍓', bgColor: '#E6F4D2' },
      { id: 'cat_1', name: 'Орехи, сухофрукты', iconEmoji: '🥜', bgColor: '#E6F4D2' },
    ]
  },
  {
    title: 'Молочная продукция и яйцо',
    items: [
      { id: 'cat_1', name: 'Молоко, сметана', iconEmoji: '🥛', bgColor: '#CFE6FF' },
      { id: 'cat_1', name: 'Кефир, творог', iconEmoji: '🧀', bgColor: '#CFE6FF' },
      { id: 'cat_1', name: 'Сыр', iconEmoji: '🍕', bgColor: '#CFE6FF' },
      { id: 'cat_1', name: 'Яйцо, масло', iconEmoji: '🥚', bgColor: '#CFE6FF' },
      { id: 'cat_1', name: 'Майонез', iconEmoji: '🍯', bgColor: '#CFE6FF' },
      { id: 'cat_1', name: 'Йогурты, десерты', iconEmoji: '🧁', bgColor: '#CFE6FF' },
    ]
  }
];
