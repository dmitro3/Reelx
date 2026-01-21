export interface MoneyPrice {
  type: 'ton' | 'star';
  price: number;
}

/**
 * Генерирует 8 лотов:
 * - 4 пары, каждая пара суммарно равна переданному amount
 * - в паре: p1 = amount - n, p2 = n, где n — случайное число [0, amount]
 * - всего 8 лотов, из них половина в TON, половина в STARS
 * @param amount - сумма в TON
 * @param tonToStarsRate - курс конвертации TON в STARS (сколько STARS за 1 TON)
 */
export const getMoneyPrices = (amount: number, tonToStarsRate: number): MoneyPrice[] => {
  const lotsPerPair = 2;
  const totalLots = 8;
  const pairCount = totalLots / lotsPerPair; // 4

  const lots: MoneyPrice[] = [];

  for (let i = 0; i < pairCount; i++) {
    const n = Math.random() * amount;
    const first = amount - n;
    const second = n;

    lots.push(
      { type: 'ton', price: Number(first.toFixed(2)) },
      { type: 'ton', price: Number(second.toFixed(2)) },
    );
  }

  // Половину лотов переводим в звезды с конвертацией цены
  // Первые 4 оставляем TON, последние 4 конвертируем в STARS
  return lots.map((lot, index) => {
    if (index >= totalLots / 2) {
      // Конвертируем цену из TON в STARS
      const starsPrice = lot.price * tonToStarsRate;
      return { type: 'star', price: Number(starsPrice.toFixed(2)) };
    }
    return lot;
  });
};

