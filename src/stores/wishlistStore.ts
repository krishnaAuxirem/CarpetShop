import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem, Product } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isWishlisted(product.id)) {
          set(state => ({
            items: [...state.items, {
              productId: product.id,
              product,
              addedAt: new Date().toISOString(),
            }],
          }));
        }
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(i => i.productId !== productId),
        }));
      },

      isWishlisted: (productId) => get().items.some(i => i.productId === productId),

      toggleWishlist: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "carpet-wishlist" }
  )
);
