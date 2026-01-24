export type GameType = 'solo';
export type GameCurrency = 'TON' | 'STARS';

export interface Game {
    id: string;
    type: GameType;
    priceAmount: number;
    priceType: GameCurrency;
    createdAt: string;
}