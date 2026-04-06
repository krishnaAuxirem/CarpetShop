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

  // Saved Filters
  saveFilter: (filter: Omit<SavedFilter, "id" | "createdAt">) => void;
  removeFilter: (id: string) => void;

  // Price Alerts
  addPriceAlert: (alert: Omit<PriceAlert, "id" | "createdAt" | "triggered">) => void;
  removePriceAlert: (id: string) => void;
  hasAlert: (productId: string) => boolean;
  getAlert: (productId: string) => PriceAlert | undefined;
}

export const useAlertStore = create<AlertStore>()(
  persist(
    (set, get) => ({
      savedFilters: [],
      priceAlerts: [],

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
    }),
    { name: "carpet-alerts" }
  )
);
