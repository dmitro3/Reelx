import { useState } from 'react';
import { eventBus, MODAL_EVENTS } from '@/features/eventBus/eventBus';
import { useInventoryGifts } from './useInventoryGifts';
import { useChanceData } from './useChanceData';
import { upgrateService, type StartGameResponse } from '@/entites/upgrate/api/api';

export type UpgrateTab = 'inventory' | 'wishlist';

export function useUpgratePage() {
    const [activeTab, setActiveTab] = useState<UpgrateTab>('inventory');
    const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(null);
    const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
    const [gameResult, setGameResult] = useState<StartGameResponse | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
        setGameResult(null);
    };

    const toggleMultiplier = (value: string) => {
        setSelectedMultiplier((prev) => (prev === value ? null : value));
        setGameResult(null);
    };

    const startGame = async () => {
        setIsPlaying(true);
        try {
            const res = await upgrateService.startGame();
            setGameResult(res);
            setActiveTab('wishlist');
        } catch (e) {
            console.error('Ошибка start-game:', e);
            setGameResult(null);
            setIsPlaying(false);
        }
    };

    const handleAnimationComplete = (outcome: 'win' | 'lose') => {
        setIsPlaying(false);
        if (!gameResult || gameResult.result !== outcome || gameResult.gifts.length === 0) {
            return;
        }

        eventBus.emit(MODAL_EVENTS.OPEN_GIFTS_MODAL, {
            items: gameResult.gifts.map((g) => ({
                name: g.name ?? 'Подарок',
                image: g.image,
            })),
            title: outcome === 'win' ? 'Вы выиграли' : 'Вы проиграли',
        });
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
        startGame,
        gameResult,
        isPlaying,
        handleAnimationComplete,
    };
}
