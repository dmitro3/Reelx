import { useState } from 'react';
import { useInventoryGifts } from './useInventoryGifts';
import { useChanceData } from './useChanceData';

export type UpgrateTab = 'inventory' | 'wishlist';

export function useUpgratePage() {
    const [activeTab, setActiveTab] = useState<UpgrateTab>('inventory');
    const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(null);
    const [selectedGifts, setSelectedGifts] = useState<string[]>([]);

    const { inventoryGifts, isLoadingGifts, loadGifts } = useInventoryGifts();
    const { chance, bet, winning, poolGifts, isLoadingChance } = useChanceData(
        selectedGifts,
        selectedMultiplier,
    );

    const toggleGiftSelection = (giftId: string) => {
        setSelectedGifts((prev) =>
            prev.includes(giftId)
                ? prev.filter((id) => id !== giftId)
                : [...prev, giftId],
        );
    };

    const toggleMultiplier = (value: string) => {
        setSelectedMultiplier((prev) => (prev === value ? null : value));
    };

    return {
        activeTab,
        setActiveTab,
        selectedMultiplier,
        selectedGifts,
        toggleMultiplier,
        toggleGiftSelection,
        inventoryGifts,
        isLoadingGifts,
        loadGifts,
        chance,
        bet,
        winning,
        poolGifts,
        isLoadingChance,
    };
}
