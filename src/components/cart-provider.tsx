"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  variantId: string;
  size: string;
  name: string;
  brand: string;
  audience: "Hombre" | "Mujer" | "Unisex";
  price: number;
  image?: string;
  quantity: number;
  maxQuantity: number;
};

type AddCartItem = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: AddCartItem) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "girtz-cart-v3";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restoredItems: CartItem[] = [];

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) restoredItems = parsed;
      }
    } catch {
      // Si localStorage está corrupto, se inicia un carrito limpio.
    }

    const frame = window.requestAnimationFrame(() => {
      setItems(restoredItems);
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((item: AddCartItem) => {
    const maxQuantity = Math.max(1, item.maxQuantity || 1);
    const quantity = Math.min(maxQuantity, Math.max(1, item.quantity || 1));

    setItems((current) => {
      const index = current.findIndex(
        (entry) => entry.slug === item.slug && entry.size === item.size,
      );

      if (index === -1) return [...current, { ...item, maxQuantity, quantity }];

      return current.map((entry, entryIndex) =>
        entryIndex === index
          ? { ...entry, quantity: Math.min(entry.maxQuantity, entry.quantity + quantity) }
          : entry,
      );
    });
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((current) => current.filter((entry) => !(entry.slug === slug && entry.size === size)));
  }, []);

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(slug, size);
      return;
    }
    setItems((current) => current.map((entry) =>
      entry.slug === slug && entry.size === size
        ? { ...entry, quantity: Math.min(entry.maxQuantity, quantity) }
        : entry,
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    hydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }), [items, hydrated, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
