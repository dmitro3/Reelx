import { useState, useCallback, useEffect } from 'react';
import { calculateTotalPrice } from '../helpers/calculateTotalPrice';
import { validateRolls } from '../helpers/validateRolls';

interface SpinGameConfig {
    defaultRolls?: number;
    pricePerRoll?: number;
    minRolls?: number;
    maxRolls?: number;
    giftCount?: number;
    rollStep?: number;
}

interface SpinGameResult {
    selectedItem: {
        name: string;
        price?: number;
        image?: string;
    };
    rolls: number;
    totalPrice: number;
}

interface UseSpinGameReturn {
    rolls: number;
    pricePerRoll: number;
    totalPrice: number;
    giftCount: number;
    isSpinning: boolean;
    canPlay: boolean;
    handleIncreaseRolls: () => void;
    handleDecreaseRolls: () => void;
    handlePlay: () => void;
    onSpinComplete: (selectedItem: { name: string; price?: number; image?: string }) => void;
    setGiftCount: (count: number) => void;
}

export const useSpinGame = (
    config: SpinGameConfig = {},
    onGameComplete?: (result: SpinGameResult) => void
): UseSpinGameReturn => {
    const {
        defaultRolls = 1,
        pricePerRoll = 5,
        minRolls = 1,
        maxRolls,
        giftCount: initialGiftCount = 5,
        rollStep = 1,
    } = config;

    const [rolls, setRolls] = useState(defaultRolls);
    const [isSpinning, setIsSpinning] = useState(false);
    const [giftCount, setGiftCount] = useState(initialGiftCount);

    const totalPrice = calculateTotalPrice(rolls, pricePerRoll);
    const canPlay = !isSpinning && validateRolls(rolls, minRolls, maxRolls);

    // Сбрасываем rolls при изменении rollStep (смена валюты)
    useEffect(() => {
        setRolls(defaultRolls);
    }, [rollStep, defaultRolls]);

    // Логируем изменения isSpinning
    useEffect(() => {
        console.log('🎰 useSpinGame: isSpinning изменилось на', isSpinning);
    }, [isSpinning]);

    const handleIncreaseRolls = useCallback(() => {
        if (isSpinning) return;
        setRolls(prev => {
            const newRolls = prev + rollStep;
            if (maxRolls !== undefined && newRolls > maxRolls) {
                return prev;
            }
            return newRolls;
        });
    }, [isSpinning, maxRolls, rollStep]);

    const handleDecreaseRolls = useCallback(() => {
        if (isSpinning) return;
        setRolls(prev => {
            const newRolls = prev - rollStep;
            if (newRolls < minRolls) {
                return prev;
            }
            return newRolls;
        });
    }, [isSpinning, minRolls, rollStep]);

    const handlePlay = useCallback(() => {
        if (!canPlay) return;
        console.log('🎮 handlePlay: Начало игры, устанавливаем isSpinning = true');
        setIsSpinning(true);
    }, [canPlay]);

    const onSpinComplete = useCallback((selectedItem: { name: string; price?: number; image?: string }) => {
        console.log('✅ onSpinComplete: Завершение спина, устанавливаем isSpinning = false', selectedItem);
        setIsSpinning(false);
        
        const result: SpinGameResult = {
            selectedItem,
            rolls,
            totalPrice,
        };

        if (onGameComplete) {
            onGameComplete(result);
        }
    }, [rolls, totalPrice, onGameComplete]);

    return {
        rolls,
        pricePerRoll,
        totalPrice,
        giftCount,
        isSpinning,
        canPlay,
        handleIncreaseRolls,
        handleDecreaseRolls,
        handlePlay,
        onSpinComplete,
        setGiftCount,
    };
};

