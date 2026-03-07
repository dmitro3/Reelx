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

/** Эндпоинт: UpgrateController POST get-chance */
const GET_CHANCE_URL = '/upgrate/get-chance';

class UpgrateService {
    async getChance(toyIds: string[], multiplier: number): Promise<GetChanceResponse> {
        const response = await api.$authHost.post<GetChanceResponse>(GET_CHANCE_URL, {
            toyIds,
            multiplier,
        });
        return response.data;
    }
}

export const upgrateService = new UpgrateService();
