import type { ToyChanceRto } from '../rto/toy-chance.rto';

export type UserGiftForToyChance = { id: string };

export function buildUserToysRto(
  userGifts: UserGiftForToyChance[],
  chance: number,
  bet: number,
  winning: number,
): ToyChanceRto[] {
  return userGifts.map((g) => ({
    id: g.id,
    chance,
    bet,
    winning,
  }));
}

