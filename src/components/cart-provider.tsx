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
  audience: "Hombre" | "Mujer" | "Unisex";
  price: number;
  quantity: number;
  size: string;
  catalogReference?: string;
};

type AddCartItem = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: AddCartItem) => void;
  removeItem: (slug: string, size?: string) => void;
  updateQuantity: (slug: string, quantity: number, size?: string) => void;
  updateSize: (slug: string, size: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "girtz-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Si localStorage está corrupto, se inicia un carrito limpio.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((item: AddCartItem) => {
    const size = item.size || "POR CONFIRMAR";
    const quantity = Math.max(1, item.quantity || 1);

    setItems((current) => {
      const index = current.findIndex(
        (entry) => entry.slug === item.slug && entry.size === size,
      );

      if (index === -1) {
        return [...current, { ...item, size, quantity }];
      }

      return current.map((entry, entryIndex) =>
        entryIndex === index
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry,
      );
    });
  }, []);

  const removeItem = useCallback((slug: string, size?: string) => {
    setItems((current) =>
      current.filter(
        (entry) => !(entry.slug === slug && (!size || entry.size === size)),
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (slug: string, quantity: number, size?: string) => {
      if (quantity <= 0) {
        removeItem(slug, size);
        return;
      }

      setItems((current) =>
        current.map((entry) =>
          entry.slug === slug && (!size || entry.size === size)
            ? { ...entry, quantity }
            : entry,
        ),
      );
    },
    [removeItem],
  );

  const updateSize = useCallback((slug: string, size: string) => {
    setItems((current) =>
      current.map((entry) =>
        entry.slug === slug ? { ...entry, size: size || "POR CONFIRMAR" } : entry,
      ),
    );
  }, []);

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
      addItem,
      removeItem,
      updateQuantity,
      updateSize,
      clearCart,
    };
  }, [items, hydrated, addItem, removeItem, updateQuantity, updateSize, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
