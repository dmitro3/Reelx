import * as api from '@/shared/lib/api/api';

export interface ToyChance {
    id: string;
    chance: number;
    bet: number;
    winning: number;
}

export interface PoolGift {
    name?: string;
    image?: string;
    price?: number;
    pool: 'win' | 'lose';
}

export interface GetChanceResponse {
    userToys: ToyChance[];
    poolGifts: PoolGift[];
}

class UpgrateService {
    async getChance(toyIds: string[], multiplier: number): Promise<GetChanceResponse> {
        const response = await api.$authHost.post<GetChanceResponse>('/upgrate/get-chance', {
            toyIds,
            multiplier,
        });
        return response.data;
    }
}

export const upgrateService = new UpgrateService();
