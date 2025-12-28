import { create } from 'zustand';
import { userApi } from '../api/User.api';

interface UserState {
  username: string | null;
  telegramId: string | null;
  photoUrl: string | null;
  accessToken: string | null;
  setUser: (user: {
    username?: string | null;
    telegramId?: string | null;
    photoUrl?: string | null;
  }) => void;
  clearUser: () => void;
  login: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  username: null,
  telegramId: null,
  photoUrl: null,
  accessToken: null,
  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user,
    })),
  clearUser: () =>
    set({
      username: null,
      telegramId: null,
      photoUrl: null,
      accessToken: null,
    }),
  login: async () => {
    try {
      // Получаем initData из Telegram WebApp
      const initData = window?.Telegram?.WebApp?.initData;
      
      if (!initData) {
        throw new Error('Telegram WebApp initData not found');
      }

      // Выполняем логин через API
      const { accessToken } = await userApi.login(initData);

      // Получаем данные пользователя из initData
      const userData = window?.Telegram?.WebApp?.initDataUnsafe?.user;
      
      if (userData) {
        // Парсим initData для получения photo_url
        let photoUrl: string | null = null;
        try {
          const params = new URLSearchParams(initData);
          const userParam = params.get('user');
          if (userParam) {
            const user = JSON.parse(decodeURIComponent(userParam));
            photoUrl = `https://reelx.online/api/users/photo/${user.photo_url}` || null;
          }
        } catch (e) {
          console.warn('Failed to parse photo_url from initData:', e);
        }

        set({
          accessToken,
          username: userData.username || null,
          telegramId: String(userData.id) || null,
          photoUrl,
        });
      } else {
        // Если данных пользователя нет в initDataUnsafe, сохраняем только токен
        set({ accessToken });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
}));

