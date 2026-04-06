import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedFilter {
  id: string;
  name: string;
  category: string;
  materials: string[];
  priceMin: number;
  priceMax: number;
  createdAt: string;
}

export interface RestockAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  targetPrice: number;      // alert triggers when price drops to/below this
  currentPrice: number;
  createdAt: string;
  triggered: boolean;
}

interface AlertStore {
  savedFilters: SavedFilter[];
  priceAlerts: PriceAlert[];
  restockAlerts: RestockAlert[];

  // Saved Filters
  saveFilter: (filter: Omit<SavedFilter, "id" | "createdAt">) => void;
  removeFilter: (id: string) => void;

  // Price Alerts
  addPriceAlert: (alert: Omit<PriceAlert, "id" | "createdAt" | "triggered">) => void;
  removePriceAlert: (id: string) => void;
  hasAlert: (productId: string) => boolean;
  getAlert: (productId: string) => PriceAlert | undefined;

  // Restock Alerts
  addRestockAlert: (alert: Omit<RestockAlert, "id" | "createdAt">) => void;
  removeRestockAlert: (id: string) => void;
  hasRestockAlert: (productId: string) => boolean;
}

export const useAlertStore = create<AlertStore>()(
  persist(
    (set, get) => ({
      savedFilters: [],
      priceAlerts: [],
      restockAlerts: [],

      saveFilter: (filter) => {
        const newFilter: SavedFilter = {
          ...filter,
          id: `sf_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ savedFilters: [newFilter, ...s.savedFilters] }));
      },

      removeFilter: (id) => {
        set(s => ({ savedFilters: s.savedFilters.filter(f => f.id !== id) }));
      },

      addPriceAlert: (alert) => {
        // prevent duplicates
        if (get().hasAlert(alert.productId)) return;
        const newAlert: PriceAlert = {
          ...alert,
          id: `pa_${Date.now()}`,
          createdAt: new Date().toISOString(),
          triggered: false,
        };
        set(s => ({ priceAlerts: [newAlert, ...s.priceAlerts] }));
      },

      removePriceAlert: (id) => {
        set(s => ({ priceAlerts: s.priceAlerts.filter(a => a.id !== id) }));
      },

      hasAlert: (productId) => {
        return get().priceAlerts.some(a => a.productId === productId);
      },

      getAlert: (productId) => {
        return get().priceAlerts.find(a => a.productId === productId);
      },

      addRestockAlert: (alert) => {
        if (get().hasRestockAlert(alert.productId)) return;
        const newAlert: RestockAlert = {
          ...alert,
          id: `rs_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ restockAlerts: [newAlert, ...s.restockAlerts] }));
      },

      removeRestockAlert: (id) => {
        set(s => ({ restockAlerts: s.restockAlerts.filter(a => a.id !== id) }));
      },

      hasRestockAlert: (productId) => {
        return get().restockAlerts.some(a => a.productId === productId);
      },
    }),
    { name: "carpet-alerts" }
  )
);
