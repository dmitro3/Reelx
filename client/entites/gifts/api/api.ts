import * as api from '@/shared/lib/api/api';
import { GiftItem } from '../interfaces/giftItem.interface';

interface GetGiftsResponse {
    success: boolean;
    amount: number;
    gifts: GiftItem[];
    count: number;
}

class GiftsService {
    async getGiftsByPrice(body?: { amount?: number }): Promise<GiftItem[]> {
        const response = await api.$host.post<GetGiftsResponse>('/gifts/by-price', body || {});
        // Преобразуем price из string (nanoTON) в number (TON)
        return response.data.gifts.map(gift => ({
            ...gift,
            price: Number(gift.price) / 1_000_000_000, // Конвертируем nanoTON в TON
        }));
    }
}

export const giftsService = new GiftsService();