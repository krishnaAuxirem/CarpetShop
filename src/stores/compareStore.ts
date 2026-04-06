import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface CompareStore {
  items: Product[];
  addItem: (product: Product) => boolean; // returns false if already 3
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        if (items.length >= 3) return false;
        if (items.find(p => p.id === product.id)) return false;
        set(s => ({ items: [...s.items, product] }));
        return true;
      },
      removeItem: (productId) =>
        set(s => ({ items: s.items.filter(p => p.id !== productId) })),
      clearAll: () => set({ items: [] }),
      isInCompare: (productId) => get().items.some(p => p.id === productId),
    }),
    { name: "carpet-compare" }
  )
);
