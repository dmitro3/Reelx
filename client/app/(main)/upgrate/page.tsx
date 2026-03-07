'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import cls from './upgrate.module.scss';
import tonIcon from '@/assets/ton.svg';
import upgradeArrows from '@/assets/upgrade-arrows.svg';
import upgradeIcon from '@/assets/upgrade-icon.svg';
import { useUserStore } from '@/entites/user/model/user';
import { userService, UserGift } from '@/entites/user/api/api';
import { upgrateService, GetChanceResponse } from '@/entites/upgrate/api/api';
import { GiftImageOrLottie } from '@/shared/ui/GiftImageOrLottie/GiftImageOrLottie';
import { Header } from '@/shared/layout/Header/Header';

const MULTIPLIERS = ['x1.5', 'x2', 'x3', 'x5', 'x10', 'x20'] as const;
const MULTIPLIER_VALUES: Record<string, number> = {
    'x1.5': 1.5, 'x2': 2, 'x3': 3, 'x5': 5, 'x10': 10, 'x20': 20,
};

const FALLBACK_COLORS = ['#005F70', '#927DD5', '#4F7BDA', '#5B4FC6', '#20A275'];

export default function UpgratePage() {
    const [activeTab, setActiveTab] = useState<'inventory' | 'wishlist'>('inventory');
    const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(null);
    const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
    const [inventoryGifts, setInventoryGifts] = useState<UserGift[]>([]);
    const [isLoadingGifts, setIsLoadingGifts] = useState(true);
    const [chanceData, setChanceData] = useState<GetChanceResponse | null>(null);
    const [isLoadingChance, setIsLoadingChance] = useState(false);
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

    // Запрос get-chance при изменении выбранных подарков или множителя
    useEffect(() => {
        if (selectedGifts.length === 0 || !selectedMultiplier) {
            setChanceData(null);
            return;
        }
        const multiplierNum = MULTIPLIER_VALUES[selectedMultiplier];
        if (!multiplierNum) return;

        let cancelled = false;
        setIsLoadingChance(true);
        setChanceData(null);

        upgrateService
            .getChance(selectedGifts, multiplierNum)
            .then((data) => {
                if (!cancelled) setChanceData(data);
            })
            .catch((e) => {
                if (!cancelled) {
                    console.error('Ошибка get-chance:', e);
                    setChanceData(null);
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingChance(false);
            });

        return () => {
            cancelled = true;
        };
    }, [selectedGifts, selectedMultiplier]);

    const chance = chanceData?.userToys?.[0]?.chance ?? null;
    const bet = chanceData?.userToys?.[0]?.bet ?? 0;
    const winning = chanceData?.userToys?.[0]?.winning ?? 0;
    const poolGifts = chanceData?.poolGifts ?? [];

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
                    <span className={cls.percentage}>
                        {isLoadingChance ? '…' : chance != null ? Math.round(chance * 100) : 0}%
                    </span>
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

            {/* Before / After row — ставка и возможный выигрыш с сервера */}
            <div className={cls.beforeAfterRow}>
                <div className={cls.baSection}>
                    <span className={cls.baLabel}>До</span>
                    <div className={cls.valueDisplay}>
                        <Image src={tonIcon} alt="TON" width={8} height={8} />
                        <span>{isLoadingChance ? '…' : bet.toFixed(2)}</span>
                    </div>
                </div>
                <div className={cls.baSection}>
                    <span className={cls.baLabel}>После</span>
                    <div className={cls.valueDisplay}>
                        <Image src={tonIcon} alt="TON" width={8} height={8} />
                        <span>{isLoadingChance ? '…' : winning.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Подарки, которые можно выиграть (из ответа сервера) */}
            {poolGifts.filter((g) => g.pool === 'win').length > 0 && (
                <div className={cls.poolSection}>
                    <span className={cls.poolSectionTitle}>Можно выиграть</span>
                    <div className={cls.poolRow}>
                        {poolGifts
                            .filter((g) => g.pool === 'win')
                            .slice(0, 10)
                            .map((g, i) => (
                                <div key={`win-${i}`} className={cls.poolCard}>
                                    <div className={cls.poolCardImage}>
                                        {g.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={g.image}
                                                alt={g.name ?? ''}
                                                className={cls.poolCardImg}
                                            />
                                        ) : (
                                            <span className={cls.poolCardPlaceholder}>🎁</span>
                                        )}
                                    </div>
                                    <span className={cls.poolCardName}>{g.name ?? 'Gift'}</span>
                                    {g.price != null && (
                                        <span className={cls.poolCardPrice}>{g.price.toFixed(2)} TON</span>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}

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
                    <span>
                        {selectedGifts.length === 0 || !selectedMultiplier
                            ? 'Выберите подарки и ставку (X) для апгрейда'
                            : `Выбрано подарков: ${selectedGifts.length}, ставка ${selectedMultiplier}`}
                    </span>
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
