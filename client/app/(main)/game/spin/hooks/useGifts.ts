import { useState, useEffect } from 'react';
import { GiftItem } from '@/entites/gifts/interfaces/giftItem.interface';
import { giftsService } from '@/entites/gifts/api/api';
import { CurrencyType } from './useCurrency';

// Оставляем в колесе только уникальные элементы:
// одинаковые по типу, имени и цене объединяются в одну "ячейку"
const deduplicateWheelItems = (items: GiftItem[]): GiftItem[] => {
    const seen = new Set<string>();

    return items.filter((item) => {
        const key = `${item.type}__${item.name}__${item.price}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

export const useGifts = (currency: CurrencyType, amount?: number) => {
    const [wheelItems, setWheelItems] = useState<GiftItem[]>([]);
    const [isLoadingGifts, setIsLoadingGifts] = useState(false);

    useEffect(() => {
        const loadGifts = async () => {
            setIsLoadingGifts(true);
            try {
                const gifts = await giftsService.getGiftsByPrice({
                    amount: amount || 0,
                    type: currency,
                });
                // Объединяем все одинаковые элементы в одну ячейку
                setWheelItems(deduplicateWheelItems(gifts));
            } catch (error) {
                console.error('Ошибка загрузки подарков:', error);
                setWheelItems([]);
            } finally {
                setIsLoadingGifts(false);
            }
        };

        loadGifts();
    }, [currency, amount]);

    return {
        wheelItems,
        isLoadingGifts,
    };
};
