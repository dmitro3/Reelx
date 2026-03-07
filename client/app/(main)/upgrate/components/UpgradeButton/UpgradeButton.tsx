'use client';

import cls from '../../upgrate.module.scss';

interface UpgradeButtonProps {
    selectedCount: number;
    selectedMultiplier: string | null;
}

export function UpgradeButton({ selectedCount, selectedMultiplier }: UpgradeButtonProps) {
    const text =
        selectedCount === 0
            ? 'Выберите подарки для апгрейда'
            : `Выбрано подарков: ${selectedCount}${selectedMultiplier ? `, ставка ${selectedMultiplier}` : ' (ставка x1)'}`;

    return (
        <div className={cls.upgradeButton}>
            <span>{text}</span>
        </div>
    );
}
