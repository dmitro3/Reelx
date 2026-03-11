'use client';

import cls from './upgrate.module.scss';
import { Header } from '@/shared/layout/Header/Header';
import { useUpgratePage } from './hooks';
import {
    UpgradeArena,
    BeforeAfterRow,
    MultipliersRow,
    UpgradeButton,
    TabBar,
    GiftGrid,
} from './components';

export default function UpgratePage() {
    const {
        activeTab,
        setActiveTab,
        selectedMultiplier,
        selectedGifts,
        toggleMultiplier,
        toggleGiftSelection,
        inventoryGifts,
        isLoadingGifts,
        chance,
        bet,
        winning,
        poolGifts,
        isLoadingChance,
        startGame,
        gameResult,
        isPlaying,
    } = useUpgratePage();

    return (
        <div className={cls.page}>
            <Header />
            <div className={cls.bgEllipse} />

            <UpgradeArena chance={chance} isLoadingChance={isLoadingChance} />

            <BeforeAfterRow
                bet={bet}
                winning={winning}
                isLoadingChance={isLoadingChance}
            />

            <div className={cls.bottomSection}>
                <MultipliersRow
                    selectedMultiplier={selectedMultiplier}
                    onToggle={toggleMultiplier}
                />

                <UpgradeButton
                    selectedCount={selectedGifts.length}
                    selectedMultiplier={selectedMultiplier}
                    isReadyToPlay={selectedGifts.length > 0 && !isLoadingChance && chance != null}
                    isPlaying={isPlaying}
                    onPlay={startGame}
                />

                {gameResult && (
                    <div className={cls.emptyState}>
                        <div>
                            {gameResult.result === 'win' ? 'Вы выиграли' : 'Вы проиграли'}
                        </div>
                        <div>
                            {gameResult.gifts.map((g) => (
                                <div key={g.id}>{g.name ?? g.id}</div>
                            ))}
                        </div>
                    </div>
                )}

                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

                <div className={cls.giftGrid}>
                    <GiftGrid
                        activeTab={activeTab}
                        isLoadingGifts={isLoadingGifts}
                        inventoryGifts={inventoryGifts}
                        selectedGifts={selectedGifts}
                        onToggleGift={toggleGiftSelection}
                        poolGifts={poolGifts}
                        isLoadingChance={isLoadingChance}
                    />
                </div>
            </div>
        </div>
    );
}
