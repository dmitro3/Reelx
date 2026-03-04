'use client';

import { useState } from 'react';
import Image from 'next/image';
import cls from './upgrate.module.scss';
import tonIcon from '@/assets/ton.svg';
import starIcon from '@/assets/star.svg';
import upgradeArrows from '@/assets/upgrade-arrows.svg';
import upgradeIcon from '@/assets/upgrade-icon.svg';
import { useUserStore } from '@/entites/user/model/user';

const MULTIPLIERS = ['x1.5', 'x2', 'x3', 'x5', 'x10', 'x20'];

const MOCK_GIFTS = [
    { id: 1, name: 'Gift Name', price: 5.20, bgColor: '#005F70' },
    { id: 2, name: 'Gift Name', price: 8.25, bgColor: '#927DD5' },
    { id: 3, name: 'Gift Name', price: 10.15, bgColor: '#4F7BDA' },
    { id: 4, name: 'Gift Name', price: 4.35, bgColor: '#5B4FC6' },
    { id: 5, name: 'Gift Name', price: 1.50, bgColor: '#20A275' },
];

export default function UpgratePage() {
    const [activeTab, setActiveTab] = useState<'inventory' | 'wishlist'>('inventory');
    const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(null);
    const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
    const { user } = useUserStore();

    const chance = 0;
    const tonBalance = user?.tonBalance ?? 250;
    const starsBalance = user?.starsBalance ?? 60;

    return (
        <div className={cls.page}>
            <div className={cls.bgEllipse} />

            {/* Header */}
            <header className={cls.header}>
                <div className={cls.balances}>
                    <div className={cls.balanceItem}>
                        <Image src={tonIcon} alt="TON" width={20} height={20} />
                        <span>{tonBalance.toFixed(2)}</span>
                    </div>
                    <div className={cls.balanceItem}>
                        <Image src={starIcon} alt="Stars" width={17} height={16} />
                        <span>{starsBalance}</span>
                    </div>
                </div>
                <div className={cls.levelBadge}>
                    <span className={cls.levelNum}>5</span>
                    <span className={cls.levelText}>LVL</span>
                </div>
            </header>

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
                    <span className={cls.percentage}>{chance}%</span>
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

                {/* Gift grid */}
                <div className={cls.giftGrid}>
                    {MOCK_GIFTS.map(gift => (
                        <div
                            key={gift.id}
                            className={`${cls.giftItem} ${selectedGifts.includes(gift.id) ? cls.giftItemSelected : ''}`}
                            onClick={() =>
                                setSelectedGifts(prev =>
                                    prev.includes(gift.id)
                                        ? prev.filter(id => id !== gift.id)
                                        : [...prev, gift.id]
                                )
                            }
                        >
                            <div className={cls.giftImageBox} style={{ background: gift.bgColor }} />
                            <span className={cls.giftName}>{gift.name}</span>
                            <div className={cls.giftPrice}>
                                <Image src={tonIcon} alt="TON" width={10} height={10} />
                                <span>{gift.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
