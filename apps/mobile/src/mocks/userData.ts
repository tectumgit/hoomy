export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  stats: {
    ordersCount: number;
    savedKopecks: number;
  };
  addresses: Address[];
}

export const mockUser: User = {
  id: 'usr_1',
  firstName: 'Владимир',
  lastName: 'Жадов',
  phone: '+7 999 123-45-67',
  stats: {
    ordersCount: 12,
    savedKopecks: 350000, // 3500 руб
  },
  addresses: [
    {
      id: 'addr_1',
      title: 'Дом',
      fullAddress: 'Казань, ул. Баумана, д. 19, кв. 42',
      isDefault: true,
    },
    {
      id: 'addr_2',
      title: 'Работа',
      fullAddress: 'Казань, ул. Пушкина, д. 10',
      isDefault: false,
    }
  ]
};
