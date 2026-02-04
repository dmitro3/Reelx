import { useState, useEffect, useRef } from 'react';

interface UseWheelSpinReturn {
    rotation: number;
    isSpinning: boolean;
}

const SPIN_DURATION = 5000; // 5 секунд
const MIN_ROTATIONS = 3; // Минимум 3 полных оборота
const MIN_ROTATION_DEGREES = MIN_ROTATIONS * 360; // 1080°

export const useWheelSpin = (
    externalIsSpinning?: boolean,
    onSpinComplete?: (rotation: number) => void,
    targetIndex?: number | null,
    itemsCount?: number
): UseWheelSpinReturn => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const onSpinCompleteRef = useRef(onSpinComplete);
    const finalRotationRef = useRef<number>(0);

    // Обновляем ref при изменении callback
    useEffect(() => {
        onSpinCompleteRef.current = onSpinComplete;
    }, [onSpinComplete]);

    useEffect(() => {
        if (externalIsSpinning && !isSpinning) {
            console.log('🎡 useWheelSpin: Начало вращения колеса');
            setIsSpinning(true);

            let additionalRotation = 0;

            if (targetIndex !== null && targetIndex !== undefined && itemsCount && itemsCount > 0) {
                const segmentAngle = 360 / itemsCount;
                const targetSegmentCenter = targetIndex * segmentAngle + segmentAngle / 2;
                const targetRotation = 360 - targetSegmentCenter;
                additionalRotation = MIN_ROTATION_DEGREES + targetRotation;
                console.log(`🎯 useWheelSpin: Целевой индекс: ${targetIndex}, дополнительный угол: ${additionalRotation}°`);
            } else {
                additionalRotation = MIN_ROTATION_DEGREES + Math.random() * 360;
                console.log(`🎯 useWheelSpin: Случайный дополнительный угол: ${additionalRotation}°`);
            }

            const startRotation = rotation;
            const finalRotation = startRotation + additionalRotation;
            finalRotationRef.current = finalRotation;

            const startTime = performance.now();

            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

            const animate = (time: number) => {
                const elapsed = time - startTime;
                const t = Math.min(1, elapsed / SPIN_DURATION);
                const eased = easeOutCubic(t);
                const currentRotation = startRotation + additionalRotation * eased;
                setRotation(currentRotation);

                if (t < 1) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    console.log(`⏰ useWheelSpin: Вращение завершено через ${SPIN_DURATION}ms`);
                    setIsSpinning(false);
                    if (onSpinCompleteRef.current) {
                        console.log('📞 useWheelSpin: Вызываем onSpinComplete callback с углом:', finalRotationRef.current);
                        onSpinCompleteRef.current(finalRotationRef.current);
                    } else {
                        console.warn('⚠️ useWheelSpin: onSpinCompleteRef.current is undefined!');
                    }
                }
            };

            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    }, [externalIsSpinning, isSpinning, targetIndex, itemsCount, rotation]);

    // Отдельный эффект для очистки при размонтировании
    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                console.log('🗑️ useWheelSpin: Очистка animationFrame при размонтировании');
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return {
        rotation,
        isSpinning,
    };
};

