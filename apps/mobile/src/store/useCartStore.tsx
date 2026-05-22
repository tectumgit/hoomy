import React from 'react';
import { create } from 'zustand';
import { mockCartData, MockCartItem } from '@/mocks/mockCartData';
import { Product } from '@hoomy/shared';

// ── Types ───────────────────────────────────────────────────────

/**
 * Extended cart item with product data — better for UI selectors.
 */
export interface CartItem extends MockCartItem {
  product?: Product;
}

interface CartState {
  // Raw state
  items: CartItem[];
  isLoading: boolean;

  // Actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  removeFromCartById: (id: string) => void;
  removeSupplierOrder: (supplierId: string) => void;
  clearCart: () => void;

  // Selectors (computed-like)
  getItemByProductId: (productId: string) => CartItem | undefined;
  getSupplierTotal: (supplierId: string) => number;
  getTotalItems: () => number;
  getGroupedBySupplier: () => Record<string, CartItem[]>;
  isMinOrderMet: (supplierId: string, minOrderAmountKopecks: number) => boolean;
}

// ── Helpers ──────────────────────────────────────────────────────

function createCartId() {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ── Zustand Store ────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
  // ===== State =====
  items: mockCartData.map((item) => ({ ...item })),
  isLoading: false,

  // ===== Actions =====

  addToCart: (item) => {
    const { items } = get();
    const existing = items.find((i) => i.productId === item.productId);

    if (existing) {
      // Already in cart: update quantity
      set({
        items: items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: item.quantity } : i
        ),
      });
    } else {
      // New item: add
      set({
        items: [...items, { ...item, id: createCartId() }],
      });
    }
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      set({ items: items.filter((i) => i.productId !== productId) });
      return;
    }
    set({
      items: items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    });
  },

  removeFromCart: (productId) => {
    set({
      items: get().items.filter((i) => i.productId !== productId),
    });
  },

  removeFromCartById: (id) => {
    set({
      items: get().items.filter((i) => i.id !== id),
    });
  },

  removeSupplierOrder: (supplierId) => {
    set({
      items: get().items.filter((i) => i.supplierId !== supplierId),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  // ===== Selectors =====

  getItemByProductId: (productId) => {
    return get().items.find((i) => i.productId === productId);
  },

  getSupplierTotal: (supplierId) => {
    return get()
      .items.filter((i) => i.supplierId === supplierId)
      .reduce((acc, item) => acc + item.unitPriceKopecks * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getGroupedBySupplier: () => {
    return get().items.reduce((acc, item) => {
      if (!acc[item.supplierId]) acc[item.supplierId] = [];
      acc[item.supplierId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  },

  isMinOrderMet: (supplierId, minOrderAmountKopecks) => {
    const total = get()
      .items.filter((i) => i.supplierId === supplierId)
      .reduce((acc, item) => acc + item.unitPriceKopecks * item.quantity, 0);
    return total >= minOrderAmountKopecks;
  },
}));

// ── React Context (DUMMY PROVIDER for backward compat) ─────────
//    Components still wrapped in <CartProvider> won't break.

export const CartContext = React.createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Zustand is self-contained — no Provider needed.
  // We keep the old API to avoid breaking wrapped trees.
  const state = useCartStore();
  return (
    <CartContext.Provider value={state}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Same hook signature, but now powered by Zustand.
 * All existing `const { items, addToCart, ... } = useCart()` calls
 * continue to work without changes.
 */
export function useCart(): CartState {
  return useCartStore();
}
