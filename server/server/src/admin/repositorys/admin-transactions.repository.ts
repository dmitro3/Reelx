import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/infrustructure/prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class AdminTransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    userId?: string;
    type?: 'stars' | 'ton';
    from?: Date;
    to?: Date;
    minAmount?: number;
    maxAmount?: number;
  }) {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.type) {
      where.type = filters.type.toUpperCase() as TransactionType;
    }

    if (filters?.from || filters?.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = filters.from;
      if (filters.to) where.createdAt.lte = filters.to;
    }

    if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) where.amount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.amount.lte = filters.maxAmount;
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
