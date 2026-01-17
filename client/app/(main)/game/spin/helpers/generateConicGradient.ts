import { wheelColors } from '../config/wheelColors';

/**
 * Генерирует строку conic-gradient для колеса фортуны
 * @param itemsCount - количество элементов в колесе
 * @returns строка для CSS свойства background
 */
export const generateConicGradient = (itemsCount: number): string => {
    const segmentAngle = 360 / itemsCount;
    
    const gradientParts = Array.from({ length: itemsCount }, (_, index) => {
        const colorIndex = index % wheelColors.length;
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        return `${wheelColors[colorIndex]} ${startAngle}deg ${endAngle}deg`;
    });
    
    return `conic-gradient(${gradientParts.join(',')})`;
};

