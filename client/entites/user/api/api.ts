import * as api from '@/shared/lib/api/api';
import { Game } from '../interface/game.interface';

export interface UserGift {
    id: string;
    giftName: string;
    image?: string;
    price?: number;
    isOut: boolean;
    createdAt: string;
}

class UserService {
    async login(initData: string): Promise<{accessToken: string}> {
        const response = await api.$host.post('/auth/login', { initData });
        return response.data;
    }

    async getUserGifts(): Promise<UserGift[]> {
        const response = await api.$authHost.get<UserGift[]>('/users/gifts');
        return response.data;
    }

    async getUserGames(): Promise<Game[]> {
        const response = await api.$authHost.get<Game[]>('/users/games');
        return response.data;
    }
}

export const userService = new UserService();