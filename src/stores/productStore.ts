import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Review } from "@/types";
import { PRODUCTS } from "@/constants/data";

interface ProductStore {
  products: Product[];
  reviews: Review[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  getReviewsByProduct: (productId: string) => Review[];
  getProductsBySeller: (sellerId: string) => Product[];
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: "r1", productId: "p1", userId: "u1", userName: "Sunita Agarwal",
    rating: 5, comment: "Absolutely stunning carpet! The quality is extraordinary.", createdAt: "2024-02-15",
  },
  {
    id: "r2", productId: "p1", userId: "u_other", userName: "Vikram M.",
    rating: 4, comment: "Beautiful design, arrived on time. Very happy with the purchase.", createdAt: "2024-02-20",
  },
  {
    id: "r3", productId: "p3", userId: "u1", userName: "Priya K.",
    rating: 5, comment: "The silk carpet is breathtaking. Worth every rupee!", createdAt: "2024-01-30",
  },
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [...PRODUCTS],
      reviews: [...SAMPLE_REVIEWS],

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `p_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (id, data) => {
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, ...data } : p),
        }));
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id),
        }));
      },

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `r_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ reviews: [newReview, ...state.reviews] }));
      },

      getReviewsByProduct: (productId) => get().reviews.filter(r => r.productId === productId),
      getProductsBySeller: (sellerId) => get().products.filter(p => p.sellerId === sellerId),
    }),
    { name: "carpet-products" }
  )
);
