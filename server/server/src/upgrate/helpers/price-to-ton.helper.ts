/** Конвертация цены из ответа NFT (nanoTON или number) в TON */
export function priceToTon(price: string | number | undefined): number {
  if (price == null) return 0;
  if (typeof price === 'string') return Number(price) / 1_000_000_000;
  return Number(price);
}

