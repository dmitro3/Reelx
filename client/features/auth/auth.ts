import { userService } from '@/entites/user/api/api';
import * as jwt from 'jsonwebtoken';
import { useUserStore } from '@/entites/user/model/user';

export class AuthService {
    async login(initData: string): Promise<{ userId: string, username: string, photoUrl: string }> {
        try {
            const {accessToken} = await userService.login(initData);
            const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
            const { userId, username, photoUrl, tonBalance, starsBalance } = decoded || {};

            localStorage.setItem('accessToken', accessToken);

            if (
                typeof userId !== 'string' ||
                typeof username !== 'string' ||
                typeof photoUrl !== 'string'
            ) {
                throw new Error('Login response is missing required user fields');
            }

            useUserStore.getState().setUser({ 
                userId, 
                username, 
                photoUrl, 
                tonBalance: Number(tonBalance || 0), 
                starsBalance: Number(starsBalance || 0) 
            });

            // Загружаем игры пользователя после успешного логина
            this.loadUserGames();

            return { userId, username, photoUrl };
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    async loadUserGames(): Promise<void> {
        try {
            const games = await userService.getUserGames();
            useUserStore.getState().setGames(games);
        } catch (error) {
            console.error('Error loading user games:', error);
        }
    }
}

export const authService = new AuthService();