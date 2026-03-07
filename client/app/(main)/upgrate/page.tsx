'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import cls from './upgrate.module.scss';
import tonIcon from '@/assets/ton.svg';
import upgradeArrows from '@/assets/upgrade-arrows.svg';
import upgradeIcon from '@/assets/upgrade-icon.svg';
import { useUserStore } from '@/entites/user/model/user';
import { userService, UserGift } from '@/entites/user/api/api';
import { GiftImageOrLottie } from '@/shared/ui/GiftImageOrLottie/GiftImageOrLottie';
import { Header } from '@/shared/layout/Header/Header';

const MULTIPLIERS = ['x1.5', 'x2', 'x3', 'x5', 'x10', 'x20'] as const;

const FALLBACK_COLORS = ['#005F70', '#927DD5', '#4F7BDA', '#5B4FC6', '#20A275'];

export default function UpgratePage() {
    const [activeTab, setActiveTab] = useState<'inventory' | 'wishlist'>('inventory');
    const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(null);
    const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
    const [inventoryGifts, setInventoryGifts] = useState<UserGift[]>([]);
    const [isLoadingGifts, setIsLoadingGifts] = useState(true);
    const [chance, setChance] = useState<number | null>(null);
    const { user } = useUserStore();

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

    return (
        <div className={cls.page}>
            <Header />
            <div className={cls.bgEllipse} />

            {/* Upgrade Arena */}
            <div className={cls.arenaWrapper}>
                <div className={cls.glow} />
                <div className={cls.circle} />
                <Image
                    src={upgradeArrows}
                    alt=""
                    width={240}
                    height={240}
                    className={cls.arenaArrows}
                    priority
                />
                <div className={cls.percentageBlock}>
                    <span className={cls.percentage}>{chance != null ? Math.round(chance * 100) : 0}%</span>
                    <span className={cls.chanceLabel}>Шанс на улучшение</span>
                </div>
                <Image
                    src={upgradeIcon}
                    alt="Upgrade"
                    width={44}
                    height={44}
                    className={cls.upgradeIconCenter}
                />
            </div>

            {/* Before / After row */}
            <div className={cls.beforeAfterRow}>
                <div className={cls.baSection}>
                    <span className={cls.baLabel}>До</span>
                    <div className={cls.valueDisplay}>
                        <Image src={tonIcon} alt="TON" width={8} height={8} />
                        <span>0.00</span>
                    </div>
                </div>
                <div className={cls.baSection}>
                    <span className={cls.baLabel}>После</span>
                    <div className={cls.valueDisplay}>
                        <Image src={tonIcon} alt="TON" width={8} height={8} />
                        <span>0.00</span>
                    </div>
                </div>
            </div>

            {/* Bottom content */}
            <div className={cls.bottomSection}>
                {/* Multiplier buttons */}
                <div className={cls.multipliersRow}>
                    {MULTIPLIERS.map(m => (
                        <button
                            key={m}
                            className={`${cls.multiplierBtn} ${selectedMultiplier === m ? cls.multiplierBtnActive : ''}`}
                            onClick={() => setSelectedMultiplier(prev => prev === m ? null : m)}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Upgrade action button */}
                <div className={cls.upgradeButton}>
                    <span>Выберите подарки для апгрейда </span>
                </div>

                {/* Tab bar */}
                <div className={cls.tabBar}>
                    <button
                        className={`${cls.tab} ${activeTab === 'inventory' ? cls.tabActive : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Инвентарь
                    </button>
                    <button
                        className={`${cls.tab} ${activeTab === 'wishlist' ? cls.tabActive : ''}`}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        Желаемые
                    </button>
                </div>

                {/* Gift grid — подарки из инвентаря (как в профиле) */}
                <div className={cls.giftGrid}>
                    {isLoadingGifts ? (
                        <div className={cls.emptyState}>Загрузка...</div>
                    ) : inventoryGifts.length === 0 ? (
                        <div className={cls.emptyState}>Нет подарков в инвентаре</div>
                    ) : (
                        inventoryGifts.map((gift, index) => (
                            <div
                                key={gift.id}
                                className={`${cls.giftItem} ${selectedGifts.includes(gift.id) ? cls.giftItemSelected : ''}`}
                                onClick={() =>
                                    setSelectedGifts((prev) =>
                                        prev.includes(gift.id)
                                            ? prev.filter((id) => id !== gift.id)
                                            : [...prev, gift.id]
                                    )
                                }
                            >
                                <div
                                    className={cls.giftImageBox}
                                    style={{ background: FALLBACK_COLORS[index % FALLBACK_COLORS.length] }}
                                >
                                    <GiftImageOrLottie
                                        image={gift.image || '/NFT.png'}
                                        lottieUrl={gift.lottieUrl}
                                        alt={gift.giftName}
                                        fillContainer
                                        className={cls.giftImageMedia}
                                        imageClassName={cls.giftImageImg}
                                    />
                                </div>
                                <span className={cls.giftName}>
                                    {gift.giftName.includes('#') ? gift.giftName.split('#')[0] : gift.giftName}
                                </span>
                                <div className={cls.giftPrice}>
                                    <Image src={tonIcon} alt="TON" width={10} height={10} />
                                    <span>{(gift.price ?? 0).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
