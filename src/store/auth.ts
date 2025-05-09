
import { create } from "zustand";
import type { User } from "@/types/user";


type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
