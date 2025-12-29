import { create } from 'zustand';
import { User } from '../interface/user.interface';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    updateBalance: (amount: number, type: 'stars' | 'ton') => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    updateBalance: (amount: number, type: 'stars' | 'ton') =>
        set((state) => {
            if (!state.user) return {};
            if (type === 'stars') {
                return { user: { ...state.user, starsBalance: (state.user.starsBalance ?? 0) + amount } };
            } else if (type === 'ton') {
                return { user: { ...state.user, tonBalance: (state.user.tonBalance ?? 0) + amount } };
            }
            return {};
        }),
}));