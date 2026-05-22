export type MockCartItem = {
  id: string;
  supplierId: string;
  productId: string;
  name: string;
  iconEmoji: string;
  quantity: number;
  unit: string;
  unitPriceKopecks: number;
};

export const mockCartData: MockCartItem[] = [
  // sup_1: Фруктовый двор (Мин заказ: 2000 руб).
  // Сделаем сумму меньше минимума для демонстрации состояния "недобор".
  {
    id: 'cart_1',
    supplierId: 'sup_1',
    productId: 'prod_4',
    name: 'Огурцы',
    iconEmoji: '🥒',
    quantity: 10,
    unit: 'kg',
    unitPriceKopecks: 65000, // 650 руб/кг -> Итог 6500 руб (Мин заказ 2000 руб выполнен)
  },
  
  // sup_2: Молочная ферма (Мин заказ: 1500 руб).
  // Сделаем сумму больше минимума для демонстрации "готово к оформлению".
  {
    id: 'cart_2',
    supplierId: 'sup_2',
    productId: 'prod_7',
    name: 'Молоко 2,5%',
    iconEmoji: '🥛',
    quantity: 2,
    unit: 'pack',
    unitPriceKopecks: 96000, // 960 руб -> 1920 руб (Больше 1500 руб, можно оформить)
  },
  {
    id: 'cart_3',
    supplierId: 'sup_2',
    productId: 'prod_8',
    name: 'Сметана 20%',
    iconEmoji: '🥣',
    quantity: 1,
    unit: 'pack',
    unitPriceKopecks: 78000, // 780 руб -> 780 руб. Общая сумма = 2700 руб.
  }
];
