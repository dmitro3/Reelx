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
                />

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
