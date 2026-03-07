'use client';

import Image from 'next/image';
import cls from '../../upgrate.module.scss';
import tonIcon from '@/assets/ton.svg';

interface BeforeAfterRowProps {
    bet: number;
    winning: number;
    isLoadingChance: boolean;
}

export function BeforeAfterRow({ bet, winning, isLoadingChance }: BeforeAfterRowProps) {
    const betStr = isLoadingChance ? '…' : bet.toFixed(2);
    const winningStr = isLoadingChance ? '…' : winning.toFixed(2);

    return (
        <div className={cls.beforeAfterRow}>
            <div className={cls.baSection}>
                <span className={cls.baLabel}>До</span>
                <div className={cls.valueDisplay}>
                    <Image src={tonIcon} alt="TON" width={8} height={8} />
                    <span>{betStr}</span>
                </div>
            </div>
            <div className={cls.baSection}>
                <span className={cls.baLabel}>После</span>
                <div className={cls.valueDisplay}>
                    <Image src={tonIcon} alt="TON" width={8} height={8} />
                    <span>{winningStr}</span>
                </div>
            </div>
        </div>
    );
}
