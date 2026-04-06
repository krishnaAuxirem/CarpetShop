import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReferralEntry {
  id: string;
  referredEmail: string;
  referredName: string;
  date: string;
  pointsEarned: number;
  status: "pending" | "completed";
}

export interface PointsTransaction {
  id: string;
  type: "earned_purchase" | "earned_referral" | "redeemed" | "bonus";
  points: number;
  description: string;
  date: string;
}

interface ReferralStore {
  points: Record<string, number>; // userId -> points
  transactions: Record<string, PointsTransaction[]>; // userId -> []
  referrals: Record<string, ReferralEntry[]>; // userId -> []
  referralCode: Record<string, string>; // userId -> code
  getPoints: (userId: string) => number;
  getTransactions: (userId: string) => PointsTransaction[];
  getReferrals: (userId: string) => ReferralEntry[];
  getReferralCode: (userId: string) => string;
  addPoints: (userId: string, points: number, description: string, type: PointsTransaction["type"]) => void;
  redeemPoints: (userId: string, points: number) => boolean;
  addReferral: (userId: string, referredEmail: string, referredName: string) => void;
  getDiscount: (userId: string, pointsToRedeem: number) => number;
}

const generateCode = (userId: string) =>
  "CARPET" + userId.toUpperCase().slice(-4) + Math.random().toString(36).slice(2, 6).toUpperCase();

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set, get) => ({
      points: { u1: 1250, u2: 500, u3: 200 },
      transactions: {
        u1: [
          { id: "t1", type: "earned_purchase", points: 450, description: "Purchase: Royal Persian Medallion", date: "2024-02-10" },
          { id: "t2", type: "earned_referral", points: 500, description: "Referral: Vikram Malhotra joined", date: "2024-02-15" },
          { id: "t3", type: "earned_purchase", points: 86, description: "Purchase: Dhurrie Cotton Flatweave ×2", date: "2024-03-01" },
          { id: "t4", type: "bonus", points: 214, description: "Welcome bonus", date: "2024-01-15" },
        ],
      },
      referrals: {
        u1: [
          { id: "r1", referredEmail: "vikram@example.com", referredName: "Vikram Malhotra", date: "2024-02-15", pointsEarned: 500, status: "completed" },
        ],
      },
      referralCode: {},

      getPoints: (userId) => get().points[userId] || 0,
      getTransactions: (userId) => get().transactions[userId] || [],
      getReferrals: (userId) => get().referrals[userId] || [],

      getReferralCode: (userId) => {
        const existing = get().referralCode[userId];
        if (existing) return existing;
        const code = generateCode(userId);
        set(s => ({ referralCode: { ...s.referralCode, [userId]: code } }));
        return code;
      },

      addPoints: (userId, points, description, type) => {
        const tx: PointsTransaction = {
          id: `tx_${Date.now()}`,
          type,
          points,
          description,
          date: new Date().toISOString(),
        };
        set(s => ({
          points: { ...s.points, [userId]: (s.points[userId] || 0) + points },
          transactions: {
            ...s.transactions,
            [userId]: [tx, ...(s.transactions[userId] || [])],
          },
        }));
      },

      redeemPoints: (userId, points) => {
        const current = get().points[userId] || 0;
        if (current < points) return false;
        const tx: PointsTransaction = {
          id: `tx_${Date.now()}`,
          type: "redeemed",
          points: -points,
          description: `Redeemed ${points} points for discount`,
          date: new Date().toISOString(),
        };
        set(s => ({
          points: { ...s.points, [userId]: (s.points[userId] || 0) - points },
          transactions: {
            ...s.transactions,
            [userId]: [tx, ...(s.transactions[userId] || [])],
          },
        }));
        return true;
      },

      addReferral: (userId, referredEmail, referredName) => {
        const entry: ReferralEntry = {
          id: `ref_${Date.now()}`,
          referredEmail,
          referredName,
          date: new Date().toISOString(),
          pointsEarned: 500,
          status: "completed",
        };
        set(s => ({
          referrals: {
            ...s.referrals,
            [userId]: [entry, ...(s.referrals[userId] || [])],
          },
        }));
        get().addPoints(userId, 500, `Referral: ${referredName} joined`, "earned_referral");
      },

      // 1 point = ₹0.1 discount
      getDiscount: (_userId, pointsToRedeem) => Math.floor(pointsToRedeem * 0.1),
    }),
    { name: "carpet-referrals" }
  )
);
