import type { NftBuyerGift } from '../types/nft-buyer-gift.type';
import { priceToTon } from './price-to-ton.helper';

export function computeAverageWinning(winGifts: NftBuyerGift[]): number {
  if (winGifts.length === 0) return 0;
  return winGifts.reduce((s, g) => s + priceToTon(g?.price), 0) / winGifts.length;
}

