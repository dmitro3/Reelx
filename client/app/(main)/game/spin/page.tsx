'use client'
import { useCallback, useState, useEffect } from 'react';
import { Bets } from './components/Bets/Bets';
import { Wheel } from './components/Wheel/Wheel';
import { useSpinGame } from './hooks/useSpinGame';
import { GiftsModal } from '@/shared/layout/GiftsModal/GiftsModal';
import { WinModal } from '@/shared/layout/WinModal/WinModal';
import { eventBus, MODAL_EVENTS } from '@/features/eventBus/eventBus';
import cls from './spin.module.scss';
import { GiftItem } from '@/entites/gifts/interfaces/giftItem.interface';
import { giftsService } from '@/entites/gifts/api/api';

export type CurrencyType = 'stars' | 'ton';

export default function SpinPage() {
    const [currency, setCurrency] = useState<CurrencyType>('stars');
    const [wheelItems, setWheelItems] = useState<GiftItem[]>([]);
    const [isLoadingGifts, setIsLoadingGifts] = useState(false);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'stars' ? 'ton' : 'stars');
    };

    // Загружаем подарки при монтировании и при смене валюты
    useEffect(() => {
        const loadGifts = async () => {
            setIsLoadingGifts(true);
            try {
                // Если валюта TON, загружаем все подарки (без фильтра по цене)
                // Если валюта stars, можно загрузить подарки с определенной ценой
                const gifts = await giftsService.getGiftsByPrice();
                setWheelItems(gifts);
            } catch (error) {
                console.error('Ошибка загрузки подарков:', error);
                setWheelItems([]);
            } finally {
                setIsLoadingGifts(false);
            }
        };

        loadGifts();
    }, [currency]);

    const handleGameComplete = useCallback((result: {
        selectedItem: { name: string; price?: number; image?: string };
        rolls: number;
        totalPrice: number;
    }) => {
        console.log('Игра завершена:', result);
        
        // Открываем модальное окно с результатом
        eventBus.emit(MODAL_EVENTS.OPEN_WIN_MODAL, result);
        
        // Здесь можно добавить логику обработки результата игры
        // Например, отправка на сервер, обновление баланса и т.д.
    }, []);

    const {
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
    } = useSpinGame(
        {
            defaultRolls: currency === 'stars' ? 5 : 1,
            pricePerRoll: 5,
            minRolls: currency === 'stars' ? 5 : 1,
            giftCount: 1,
            rollStep: currency === 'stars' ? 5 : 1,
        },
        handleGameComplete
    );

    return (
        <div className={cls.spinPage}>
            <div className={cls.spinContainer}>
                <Wheel 
                    items={wheelItems}
                    isSpinning={isSpinning}
                    onSpinComplete={onSpinComplete}
                />
                <Bets
                    rolls={rolls}
                    pricePerRoll={pricePerRoll}
                    totalPrice={totalPrice}
                    giftCount={giftCount}
                    isSpinning={isSpinning}
                    canPlay={canPlay}
                    wheelItems={wheelItems}
                    currency={currency}
                    onToggleCurrency={toggleCurrency}
                    onIncreaseRolls={handleIncreaseRolls}
                    onDecreaseRolls={handleDecreaseRolls}
                    onPlay={handlePlay}
                />
            </div>
            <GiftsModal />
            <WinModal />
        </div>
    )
}