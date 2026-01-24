import { UserGamesType, GameCurrancy } from '@prisma/client';

export class UserGameRto {
    id: string;
    type: UserGamesType;
    priceAmount: number;
    priceType: GameCurrancy;
    createdAt: Date;
}
