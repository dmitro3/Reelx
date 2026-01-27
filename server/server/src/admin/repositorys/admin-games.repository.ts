import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/infrustructure/prisma/prisma.service';

@Injectable()
export class AdminGamesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    from?: Date;
    to?: Date;
    type?: 'solo' | 'pvp' | 'upgrade';
  }) {
    const where: any = {};

    if (filters?.from || filters?.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }

    return this.prisma.games.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats(filters?: {
    from?: Date;
    to?: Date;
    type?: 'solo' | 'pvp' | 'upgrade';
  }) {
    const where: any = {};

    if (filters?.from || filters?.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }

    const games = await this.prisma.games.findMany({ where });

    const totalGames = games.length;
    const soloGames = games.filter(g => g.type === 'PRIVATE').length;
    const pvpGames = games.filter(g => g.type === 'PUBLIC').length;
    const upgradeGames = 0; // Нет такого типа в схеме

    const totalRake = games.reduce((sum, game) => sum + game.bet, 0);
    const totalTurnover = totalRake;
    const totalRTP = 0; // Нужно будет рассчитать на основе выигрышей

    return {
      totalGames,
      soloGames,
      pvpGames,
      upgradeGames,
      totalRake,
      totalRTP,
      totalTurnover,
    };
  }
}
