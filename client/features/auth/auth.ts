import { userService } from '@/entites/user/api/api';
import * as jwt from 'jsonwebtoken';
import { useUserStore } from '@/entites/user/model/user';

export class AuthService {
    async login(initData: string): Promise<{ userId: string, username: string, photoUrl: string }> {
        try {
        const {accessToken} = await userService.login(initData);
        const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
        const { userId, username, photoUrl } = decoded || {};

        localStorage.setItem('accessToken', accessToken);

        if (
            typeof userId !== 'string' ||
            typeof username !== 'string' ||
            typeof photoUrl !== 'string'
        ) {
            throw new Error('Login response is missing required user fields');
        }

            useUserStore.getInitialState().setUser({ userId, username, photoUrl });
            return { userId, username, photoUrl };
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

export const authService = new AuthService();