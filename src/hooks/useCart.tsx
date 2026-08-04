"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
  key: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; product: Product; size: string; quantity?: number }
  | { type: "REMOVE"; key: string }
  | { type: "UPDATE_QTY"; key: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function makeKey(product: Product, size: string): string {
  return `${product.id}-${size}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const key = makeKey(action.product, action.size);
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            product: action.product,
            size: action.size,
            quantity: action.quantity ?? 1,
            key,
          },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };
    case "UPDATE_QTY":
      if (action.quantity < 1) return state;
      return {
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "khadeeja-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        // ignore
      }
    }
  }, [state.items, isHydrated]);

  const addItem = useCallback(
    (product: Product, size: string, quantity?: number) => {
      dispatch({ type: "ADD", product, size, quantity });
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    dispatch({ type: "REMOVE", key });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", key, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}