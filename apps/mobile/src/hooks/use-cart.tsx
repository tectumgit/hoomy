import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCartData, MockCartItem } from '@/mocks/mockCartData';

const STORAGE_KEY = 'hoomy_cart_items';
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

interface CartContextType {
  items: MockCartItem[];
  addToCart: (item: Omit<MockCartItem, 'id'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  removeFromCartById: (id: string) => void;
  removeSupplierOrder: (supplierId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MockCartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Синхронизация с localStorage только после монтирования на клиенте
  useEffect(() => {
    if (isWeb) {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          console.log('[CartProvider] Loaded cart from localStorage, items count:', JSON.parse(stored).length);
          setItems(JSON.parse(stored));
        } else {
          // Если в localStorage пусто, инициализируем дефолтными данными
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCartData));
          setItems([...mockCartData]);
        }
      } catch (e) {
        console.warn('Failed to load cart from localStorage:', e);
        setItems([...mockCartData]);
      }
    } else {
      setItems([...mockCartData]);
    }
    setIsInitialized(true);
  }, []);

  // Сохранение изменений в localStorage (только после инициализации)
  useEffect(() => {
    if (isInitialized && isWeb) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to save cart to localStorage:', e);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (item: Omit<MockCartItem, 'id'>) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.productId === item.productId);
      if (existing) {
        return prevItems.map((i) =>
          i.productId === item.productId ? { ...i, quantity: item.quantity } : i
        );
      } else {
        const id = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        return [...prevItems, { ...item, id }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.productId !== productId));
  };

  const removeFromCartById = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const removeSupplierOrder = (supplierId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.supplierId !== supplierId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeFromCartById,
        removeSupplierOrder,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
