import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { DEMO_USERS } from "@/constants/data";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[];
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (data: Omit<User, "id" | "createdAt" | "isActive"> & { password: string }) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const DEMO_PASSWORDS: Record<string, string> = {
  "user@demo.com": "123456",
  "seller@demo.com": "123456",
  "admin@demo.com": "123456",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [...DEMO_USERS],

      login: (email, password) => {
        const { registeredUsers } = get();
        const allUsers = [...DEMO_USERS, ...registeredUsers.filter(u => !DEMO_USERS.find(d => d.email === u.email))];
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          return { success: false, message: "No account found with this email. Please register first." };
        }

        const storedPasswords = JSON.parse(localStorage.getItem("carpet-passwords") || "{}");
        const allPasswords = { ...DEMO_PASSWORDS, ...storedPasswords };
        
        if (allPasswords[email.toLowerCase()] !== password) {
          return { success: false, message: "Invalid password. Please try again." };
        }

        if (!user.isActive) {
          return { success: false, message: "Your account has been deactivated. Contact support." };
        }

        set({ user, isAuthenticated: true });
        return { success: true, message: "Login successful!" };
      },

      register: (data) => {
        const { registeredUsers } = get();
        const allUsers = [...DEMO_USERS, ...registeredUsers];
        
        if (allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return { success: false, message: "An account with this email already exists. Please login." };
        }

        const { password, ...userData } = data;
        const newUser: User = {
          ...userData,
          id: `u_${Date.now()}`,
          createdAt: new Date().toISOString(),
          isActive: true,
          role: "customer",
        };

        const storedPasswords = JSON.parse(localStorage.getItem("carpet-passwords") || "{}");
        storedPasswords[data.email.toLowerCase()] = password;
        localStorage.setItem("carpet-passwords", JSON.stringify(storedPasswords));

        set(state => ({ registeredUsers: [...state.registeredUsers, newUser] }));
        return { success: true, message: "Registration successful! Please login." };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set(state => ({
          user: state.user ? { ...state.user, ...data } : null,
          registeredUsers: state.registeredUsers.map(u =>
            u.id === state.user?.id ? { ...u, ...data } : u
          ),
        }));
      },
    }),
    { name: "carpet-auth" }
  )
);
