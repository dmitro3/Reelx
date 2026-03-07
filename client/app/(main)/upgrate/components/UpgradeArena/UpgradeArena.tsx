'use client';

import Image from 'next/image';
import cls from '../../upgrate.module.scss';
import upgradeArrows from '@/assets/upgrade-arrows.svg';
import upgradeIcon from '@/assets/upgrade-icon.svg';

const CIRCLE_R = 117;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

interface UpgradeArenaProps {
    chance: number | null;
    isLoadingChance: boolean;
}

export function UpgradeArena({ chance, isLoadingChance }: UpgradeArenaProps) {
    const percent = chance != null ? Math.min(100, Math.max(0, chance * 100)) : 0;
    const percentage = isLoadingChance ? '…' : chance != null ? Math.round(chance * 100) : 0;
    const strokeDashoffset = CIRCUMFERENCE * (1 - percent / 100);

    return (
        <div className={cls.arenaWrapper}>
            <div className={cls.glow} />
            <svg
                className={cls.circleProgress}
                viewBox={`0 0 ${240} ${240}`}
                width={240}
                height={240}
            >
                <circle
                    className={cls.circleTrack}
                    cx={120}
                    cy={120}
                    r={CIRCLE_R}
                    fill="none"
                    strokeWidth={STROKE_WIDTH}
                />
                <circle
                    className={cls.circleFill}
                    cx={120}
                    cy={120}
                    r={CIRCLE_R}
                    fill="none"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(90 120 120)"
                />
            </svg>
            <Image
                src={upgradeArrows}
                alt=""
                width={240}
                height={240}
                className={cls.arenaArrows}
                priority
            />
            <div className={cls.percentageBlock}>
                <span className={cls.percentage}>{percentage}%</span>
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
    );
}
