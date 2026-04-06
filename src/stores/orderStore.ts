import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, CartItem, Address } from "@/types";
import { SAMPLE_ORDERS } from "@/constants/data";

interface OrderStore {
  orders: Order[];
  placeOrder: (userId: string, userName: string, items: CartItem[], address: Address, paymentMethod: string) => Order;
  getOrdersByUser: (userId: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: import("@/types").OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [...SAMPLE_ORDERS],

      placeOrder: (userId, userName, items, address, paymentMethod) => {
        const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const order: Order = {
          id: `ORD-${Date.now()}`,
          userId,
          userName,
          items,
          totalAmount: totalAmount + 800,
          status: "confirmed",
          paymentMethod,
          paymentStatus: "paid",
          shippingAddress: address,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedDelivery: deliveryDate.toISOString(),
          trackingNumber: `CS${Date.now()}`,
        };

        set(state => ({ orders: [order, ...state.orders] }));
        return order;
      },

      getOrdersByUser: (userId) => get().orders.filter(o => o.userId === userId),
      getAllOrders: () => get().orders,

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      cancelOrder: (orderId) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === orderId ? { ...o, status: "cancelled", updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
    }),
    { name: "carpet-orders" }
  )
);
