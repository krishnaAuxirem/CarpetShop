import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, CustomizationOptions } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number, customization?: CustomizationOptions) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity = 1, customization) => {
        const { items } = get();
        const existing = items.find(
          i => i.productId === product.id && i.selectedSize === size && i.selectedColor === color
        );

        const unitPrice = customization
          ? product.price
          : product.price;

        if (existing) {
          set({
            items: items.map(i =>
              i.productId === product.id && i.selectedSize === size && i.selectedColor === color
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { productId: product.id, product, quantity, selectedSize: size, selectedColor: color, customization, unitPrice }],
          });
        }
      },

      removeItem: (productId, size, color) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.productId === productId && i.selectedSize === size && i.selectedColor === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId && i.selectedSize === size && i.selectedColor === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

      isInCart: (productId) => get().items.some(i => i.productId === productId),
    }),
    { name: "carpet-cart" }
  )
);
