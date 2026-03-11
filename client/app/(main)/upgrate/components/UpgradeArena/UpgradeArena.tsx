'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import cls from '../../upgrate.module.scss';
import upgradeArrows from '@/assets/upgrade-arrows.svg';
import upgradeIcon from '@/assets/upgrade-icon.svg';

const CIRCLE_R = 117;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;
const FULL_DEG = 360;
const BASE_SPIN_SPEED = 720; // градусов в секунду
const EASE_DURATION = 1200; // мс

interface UpgradeArenaProps {
    chance: number | null;
    isLoadingChance: boolean;
    isPlaying: boolean;
    /** 'win' | 'lose' | null — результат последней игры */
    result: 'win' | 'lose' | null;
}

export function UpgradeArena({ chance, isLoadingChance, isPlaying, result }: UpgradeArenaProps) {
    const percent = chance != null ? Math.min(100, Math.max(0, chance * 100)) : 0;
    const percentage = isLoadingChance ? '…' : chance != null ? Math.round(chance * 100) : 0;
    const strokeDashoffset = CIRCUMFERENCE * (1 - percent / 100);

    const [angle, setAngle] = useState(0);
    const rafRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);
    const targetAngleRef = useRef<number | null>(null);
    const easeStartRef = useRef<number | null>(null);
    const startAngleRef = useRef<number>(0);

    // Запускаем базовое вращение, когда начинается игра
    useEffect(() => {
        if (!isPlaying) {
            // Если игра закончилась, а easing ещё идёт, дадим ему доработать сам
            return;
        }

        const step = (timestamp: number) => {
            if (lastTimeRef.current == null) {
                lastTimeRef.current = timestamp;
            }
            const dt = (timestamp - lastTimeRef.current) / 1000; // в секундах
            lastTimeRef.current = timestamp;

            let nextAngle = angle + BASE_SPIN_SPEED * dt;

            // Если есть целевой угол (результат уже известен) — переходим к easing
            if (targetAngleRef.current != null && easeStartRef.current != null) {
                const progress = Math.min(
                    1,
                    (timestamp - easeStartRef.current) / EASE_DURATION,
                );
                const start = startAngleRef.current;
                const end = targetAngleRef.current;
                // простое easeOutQuad
                const eased = 1 - (1 - progress) * (1 - progress);
                nextAngle = start + (end - start) * eased;

                setAngle(nextAngle);

                if (progress >= 1) {
                    // Анимация завершена
                    targetAngleRef.current = null;
                    easeStartRef.current = null;
                    lastTimeRef.current = null;
                    rafRef.current = null;
                    return;
                }
            } else {
                setAngle(nextAngle);
            }

            rafRef.current = requestAnimationFrame(step);
        };

        // Запускаем цикл
        if (rafRef.current == null) {
            rafRef.current = requestAnimationFrame(step);
        }

        return () => {
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastTimeRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    // Когда появляется результат — вычисляем целевой угол, чтобы остановиться
    useEffect(() => {
        if (!isPlaying || !result || chance == null) return;

        const filledAngle = (FULL_DEG * percent) / 100;
        const safeFilled = Math.max(0, Math.min(FULL_DEG, filledAngle));

        // Нормализуем текущий угол в [0, 360)
        const currentAngle =
            ((angle % FULL_DEG) + FULL_DEG) % FULL_DEG;

        let targetLocal: number;
        if (result === 'win') {
            // Попадаем внутрь закрашенного сектора
            if (safeFilled <= 0) {
                // На всякий случай, если шанс 0 — считаем как проигрыш
                targetLocal = Math.random() * FULL_DEG;
            } else {
                const margin = Math.min(10, safeFilled / 4);
                const from = margin;
                const to = safeFilled - margin;
                const span = Math.max(0, to - from);
                targetLocal = from + Math.random() * (span || 1);
            }
        } else {
            // Попадаем в незакрашенную часть
            if (safeFilled >= FULL_DEG) {
                // Шанс 100% — нет незакрашенной области, считаем как выигрыш
                targetLocal = Math.random() * FULL_DEG;
            } else {
                const start = safeFilled;
                const margin = 10;
                const from = start + margin;
                const to = FULL_DEG - margin;
                const span = Math.max(0, to - from);
                targetLocal = from + Math.random() * (span || 1);
            }
        }

        // Хотим сделать ещё пару полных оборотов перед остановкой
        const extraTurns = 3;
        const targetGlobal = angle + (extraTurns * FULL_DEG + (targetLocal - currentAngle));

        startAngleRef.current = angle;
        targetAngleRef.current = targetGlobal;
        easeStartRef.current = performance.now();
        // lastTimeRef сбросим, чтобы easing работал от текущего времени
        lastTimeRef.current = null;
    }, [result, chance, percent, isPlaying, angle]);

    const arrowsRotation = ((angle % FULL_DEG) + FULL_DEG) % FULL_DEG;

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
                style={{ transform: `rotate(${arrowsRotation}deg)` }}
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
