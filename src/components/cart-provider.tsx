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
  name: string;
  brand: string;
  audience: "Hombre" | "Mujer" | "Unisex";
  price: number;
  quantity: number;
  image?: string;
  imageAlt?: string;
};

type AddCartItem = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddCartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "girtz-cart-v2";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: AddCartItem) => {
    const quantity = Math.max(1, item.quantity || 1);

    setItems((current) => {
      const index = current.findIndex((entry) => entry.slug === item.slug);

      if (index === -1) {
        return [...current, { ...item, quantity }];
      }

      return current.map((entry, entryIndex) =>
        entryIndex === index
          ? {
              ...entry,
              ...item,
              quantity: entry.quantity + quantity,
            }
          : entry,
      );
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => current.filter((entry) => entry.slug !== slug));
  }, []);

  const updateQuantity = useCallback(
    (slug: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(slug);
        return;
      }

      setItems((current) =>
        current.map((entry) =>
          entry.slug === slug ? { ...entry, quantity: Math.min(20, quantity) } : entry,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      items,
      count,
      subtotal,
      hydrated,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items, hydrated, isOpen, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
