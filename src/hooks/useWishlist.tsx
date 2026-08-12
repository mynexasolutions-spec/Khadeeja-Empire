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

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: Product[] };

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD": {
      if (state.items.find((i) => i.id === action.product.id)) {
        return state;
      }
      return {
        items: [...state.items, action.product],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: Product[];
  itemCount: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "khadeeja-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as Product[];
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

  const addItem = useCallback((product: Product) => {
    dispatch({ type: "ADD", product });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const hasItem = useCallback(
    (id: string) => state.items.some((item) => item.id === id),
    [state.items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        itemCount: state.items.length,
        addItem,
        removeItem,
        hasItem,
        clearWishlist,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
