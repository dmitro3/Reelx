import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/entites/user/model/user';
import { userService, UserGift } from '@/entites/user/api/api';

export function useInventoryGifts() {
    const { user } = useUserStore();
    const [inventoryGifts, setInventoryGifts] = useState<UserGift[]>([]);
    const [isLoadingGifts, setIsLoadingGifts] = useState(true);

    const loadGifts = useCallback(async () => {
        if (!user) {
            setInventoryGifts([]);
            setIsLoadingGifts(false);
            return;
        }
        try {
            setIsLoadingGifts(true);
            const gifts = await userService.getUserGifts();
            setInventoryGifts(gifts.filter((g) => !g.isOut));
        } catch (e) {
            console.error('Ошибка загрузки подарков:', e);
            setInventoryGifts([]);
        } finally {
            setIsLoadingGifts(false);
        }
    }, [user?.userId]);

    useEffect(() => {
        loadGifts();
    }, [loadGifts]);

    return { inventoryGifts, isLoadingGifts, loadGifts };
}
