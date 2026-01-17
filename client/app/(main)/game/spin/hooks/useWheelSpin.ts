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
    onSpinComplete?: (rotation: number) => void
): UseWheelSpinReturn => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onSpinCompleteRef = useRef(onSpinComplete);

    // Обновляем ref при изменении callback
    useEffect(() => {
        onSpinCompleteRef.current = onSpinComplete;
    }, [onSpinComplete]);

    useEffect(() => {
        if (externalIsSpinning && !isSpinning) {
            console.log('🎡 useWheelSpin: Начало вращения колеса');
            setIsSpinning(true);
            
            // Минимум 3 полных оборота (1080°) + случайный угол до 360°
            const randomRotation = MIN_ROTATION_DEGREES + Math.random() * 360;
            let finalRotation = 0;
            
            setRotation(prev => {
                finalRotation = prev + randomRotation;
                console.log(`🎯 useWheelSpin: Новый угол вращения: ${finalRotation}°`);
                return finalRotation;
            });
            
            // Очищаем предыдущий timeout если есть
            if (timeoutRef.current) {
                console.log('🧹 useWheelSpin: Очищаем предыдущий timeout');
                clearTimeout(timeoutRef.current);
            }
            
            // Вызываем callback после завершения анимации
            console.log(`⏱️ useWheelSpin: Устанавливаем timeout на ${SPIN_DURATION}ms`);
            timeoutRef.current = setTimeout(() => {
                console.log(`⏰ useWheelSpin: Вращение завершено через ${SPIN_DURATION}ms`);
                setIsSpinning(false);
                if (onSpinCompleteRef.current) {
                    console.log('📞 useWheelSpin: Вызываем onSpinComplete callback с углом:', finalRotation);
                    onSpinCompleteRef.current(finalRotation);
                } else {
                    console.warn('⚠️ useWheelSpin: onSpinCompleteRef.current is undefined!');
                }
            }, SPIN_DURATION);
        }
    }, [externalIsSpinning, isSpinning]);

    // Отдельный эффект для очистки при размонтировании
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                console.log('🗑️ useWheelSpin: Очистка timeout при размонтировании');
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        rotation,
        isSpinning,
    };
};

