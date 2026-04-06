import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "flat";
  value: number; // percent or ₹ amount
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string; // ISO string
  isActive: boolean;
  isSingleUse: boolean;
  usedByUsers: string[]; // user IDs
  description: string;
}

interface CouponStore {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount" | "usedByUsers">) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleActive: (id: string) => void;
  validateCoupon: (
    code: string,
    orderTotal: number,
    userId: string
  ) => { valid: boolean; coupon?: Coupon; message: string };
  applyCoupon: (code: string, userId: string) => void;
  getDiscount: (coupon: Coupon, orderTotal: number) => number;
}

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    minOrderValue: 2000,
    maxUses: 100,
    usedCount: 14,
    expiryDate: "2026-12-31",
    isActive: true,
    isSingleUse: true,
    usedByUsers: [],
    description: "20% off for new customers",
  },
  {
    id: "c2",
    code: "FLAT500",
    type: "flat",
    value: 500,
    minOrderValue: 5000,
    maxUses: 50,
    usedCount: 8,
    expiryDate: "2026-06-30",
    isActive: true,
    isSingleUse: false,
    usedByUsers: [],
    description: "₹500 off on orders above ₹5000",
  },
  {
    id: "c3",
    code: "SILK30",
    type: "percentage",
    value: 30,
    minOrderValue: 10000,
    maxUses: 30,
    usedCount: 3,
    expiryDate: "2026-05-15",
    isActive: true,
    isSingleUse: true,
    usedByUsers: [],
    description: "30% off on Silk Carpet orders",
  },
  {
    id: "c4",
    code: "FREESHIP",
    type: "flat",
    value: 800,
    minOrderValue: 0,
    maxUses: 200,
    usedCount: 45,
    expiryDate: "2026-03-31",
    isActive: false,
    isSingleUse: false,
    usedByUsers: [],
    description: "Free shipping (₹800 off delivery)",
  },
];

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,

      addCoupon: (coupon) => {
        const newCoupon: Coupon = {
          ...coupon,
          id: `c_${Date.now()}`,
          usedCount: 0,
          usedByUsers: [],
        };
        set(s => ({ coupons: [newCoupon, ...s.coupons] }));
      },

      updateCoupon: (id, updates) =>
        set(s => ({
          coupons: s.coupons.map(c => c.id === id ? { ...c, ...updates } : c),
        })),

      deleteCoupon: (id) =>
        set(s => ({ coupons: s.coupons.filter(c => c.id !== id) })),

      toggleActive: (id) =>
        set(s => ({
          coupons: s.coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c),
        })),

      validateCoupon: (code, orderTotal, userId) => {
        const coupon = get().coupons.find(
          c => c.code.toUpperCase() === code.toUpperCase()
        );
        if (!coupon) return { valid: false, message: "Invalid coupon code" };
        if (!coupon.isActive) return { valid: false, message: "This coupon is inactive" };
        const expiry = new Date(coupon.expiryDate);
        if (expiry < new Date()) return { valid: false, message: "This coupon has expired" };
        if (coupon.usedCount >= coupon.maxUses)
          return { valid: false, message: "Coupon usage limit reached" };
        if (coupon.isSingleUse && coupon.usedByUsers.includes(userId))
          return { valid: false, message: "You have already used this coupon" };
        if (orderTotal < coupon.minOrderValue)
          return {
            valid: false,
            message: `Minimum order value ₹${coupon.minOrderValue.toLocaleString("en-IN")} required`,
          };
        return { valid: true, coupon, message: "Coupon applied successfully!" };
      },

      applyCoupon: (code, userId) => {
        set(s => ({
          coupons: s.coupons.map(c =>
            c.code.toUpperCase() === code.toUpperCase()
              ? {
                  ...c,
                  usedCount: c.usedCount + 1,
                  usedByUsers: [...c.usedByUsers, userId],
                }
              : c
          ),
        }));
      },

      getDiscount: (coupon, orderTotal) => {
        if (coupon.type === "percentage") {
          return Math.round((orderTotal * coupon.value) / 100);
        }
        return Math.min(coupon.value, orderTotal);
      },
    }),
    { name: "carpet-coupons" }
  )
);
