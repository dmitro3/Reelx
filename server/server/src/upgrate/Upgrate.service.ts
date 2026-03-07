import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { RedisService } from '../../libs/infrustructure/redis/redis.service';
import { UserRepository } from '../users/repositorys/user.repository';
import { ToyChanceRto } from './rto/toy-chance.rto';
import { ToyRto } from './rto/toy.rto';
import {
  GetChanceResponseRto,
  PoolGiftRto,
} from './rto/get-chance-response.rto';

const UPGRATE_TTL_SECONDS = 10 * 60; // 10 минут
const MIN_PRICE_REDIS_KEY = 'gifts:min_price_ton';
const MIN_PRICE_TTL_SECONDS = 5 * 60;
const MIN_PRICE_PROBE_STEP = 0.5;
const MAX_ITERATIONS = 10;
const POOL_SIZE = 10;

/** Конвертация цены из ответа NFT (nanoTON или number) в TON */
function priceToTon(price: string | number | undefined): number {
  if (price == null) return 0;
  if (typeof price === 'string') return Number(price) / 1_000_000_000;
  return Number(price);
}

@Injectable()
export class UpgrateService {
  private readonly logger = new Logger(UpgrateService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly nftBuyerUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
  ) {
    this.nftBuyerUrl = this.configService.get<string>(
      'NFT_BUYER_URL',
      'http://localhost:3001',
    );
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getChance(
    userId: string,
    toyIds: string[],
    multiplier: number,
  ): Promise<GetChanceResponseRto> {
    const { userGifts, sumPrices } = await this.getAndValidateUserGifts(
      userId,
      toyIds,
    );

    const minPriceTon = await this.getMinPriceTon();
    const { winGifts, loseGifts, baseAmount } = await this.fetchWinLosePools(
      sumPrices,
      multiplier,
      minPriceTon,
    );

    await this.savePoolsToRedis(userId, winGifts, loseGifts);

    const chance = this.computeChanceFromMultiplier(multiplier);
    const winning = this.computeAverageWinning(winGifts);
    const userToys = this.buildUserToysRto(userGifts, chance, baseAmount, winning);
    const poolGifts = this.buildPoolGiftsRto(winGifts, loseGifts);

    return { userToys, poolGifts };
  }

  private async getAndValidateUserGifts(
    userId: string,
    toyIds: string[],
  ): Promise<{
    userGifts: Awaited<ReturnType<UserRepository['getUserGiftsByIds']>>;
    sumPrices: number;
  }> {
    const userGifts = await this.userRepository.getUserGiftsByIds(
      userId,
      toyIds,
    );
    if (userGifts.length === 0) {
      throw new BadRequestException(
        'No gifts found for the given toyIds or they are already used',
      );
    }
    const sumPrices = userGifts.reduce(
      (sum, g) => sum + (g.price ?? 0),
      0,
    ) as number;
    if (sumPrices <= 0) {
      throw new BadRequestException('Total gift price must be positive');
    }
    return { userGifts, sumPrices };
  }

  private async fetchWinLosePools(
    sumPrices: number,
    multiplier: number,
    minPriceTon: number,
  ): Promise<{
    winGifts: any[];
    loseGifts: any[];
    baseAmount: number;
  }> {
    let baseAmount = sumPrices * multiplier;
    let winGifts: any[] = [];
    let loseGifts: any[] = [];

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      if (baseAmount < minPriceTon) {
        baseAmount = minPriceTon;
      }
      const amountHigh = Math.max(minPriceTon, baseAmount * 1.3);
      const amountLow = Math.max(minPriceTon, baseAmount * 0.7);

      try {
        const [giftsHigh, giftsLow] = await Promise.all([
          this.fetchGiftsByPrice(amountHigh),
          this.fetchGiftsByPrice(amountLow),
        ]);
        winGifts = (giftsHigh ?? []).slice(0, POOL_SIZE);
        loseGifts = (giftsLow ?? []).slice(0, POOL_SIZE);

        if (winGifts.length >= POOL_SIZE && loseGifts.length >= POOL_SIZE) {
          break;
        }
      } catch (err) {
        this.logger.warn(
          `getChance by-price failed at baseAmount=${baseAmount}: ${(err as Error).message}`,
        );
      }
      baseAmount = baseAmount / 2;
    }

    return { winGifts, loseGifts, baseAmount };
  }

  private async savePoolsToRedis(
    userId: string,
    winGifts: any[],
    loseGifts: any[],
  ): Promise<void> {
    const winKey = `upgrate:win:${userId}`;
    const loseKey = `upgrate:lose:${userId}`;
    await this.redisService.set(
      winKey,
      JSON.stringify(winGifts),
      UPGRATE_TTL_SECONDS,
    );
    await this.redisService.set(
      loseKey,
      JSON.stringify(loseGifts),
      UPGRATE_TTL_SECONDS,
    );
    this.logger.debug(
      `Saved upgrate pools for user ${userId}: win=${winGifts.length}, lose=${loseGifts.length}`,
    );
  }

  private computeChanceFromMultiplier(multiplier: number): number {
    const chanceRaw = 0.5 / multiplier;
    return Math.min(0.99, Math.max(0.01, chanceRaw));
  }

  private computeAverageWinning(winGifts: any[]): number {
    if (winGifts.length === 0) return 0;
    return (
      winGifts.reduce((s, g) => s + priceToTon(g?.price), 0) / winGifts.length
    );
  }

  private buildUserToysRto(
    userGifts: Awaited<ReturnType<UserRepository['getUserGiftsByIds']>>,
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

  private buildPoolGiftsRto(
    winGifts: any[],
    loseGifts: any[],
  ): PoolGiftRto[] {
    return [
      ...winGifts.map((g: any) => ({
        name: g?.name ?? 'Gift',
        image: g?.image,
        price: priceToTon(g?.price),
        pool: 'win' as const,
      })),
      ...loseGifts.map((g: any) => ({
        name: g?.name ?? 'Gift',
        image: g?.image,
        price: priceToTon(g?.price),
        pool: 'lose' as const,
      })),
    ];
  }

  async startGame(): Promise<ToyRto[]> {
    return [
      { id: '1', name: 'Toy 1', image: '/images/toy1.png' },
      { id: '2', name: 'Toy 2', image: '/images/toy2.png' },
    ];
  }

  private async fetchGiftsByPrice(amountTon: number): Promise<any[]> {
    const url = `${this.nftBuyerUrl}/api/nft/gifts/by-price`;
    const response = await this.axiosInstance.post(url, {
      amount: amountTon,
    });
    const gifts = response.data?.gifts ?? [];
    return Array.isArray(gifts) ? gifts : [];
  }

  private async getMinPriceTon(): Promise<number> {
    const cached = await this.redisService.get(MIN_PRICE_REDIS_KEY);
    if (cached != null) {
      const value = parseFloat(cached);
      if (!Number.isNaN(value)) return value;
    }

    const url = `${this.nftBuyerUrl}/api/nft/gifts/by-price`;
    let amountTon = MIN_PRICE_PROBE_STEP;

    while (amountTon <= 100) {
      try {
        const response = await this.axiosInstance.post(url, {
          amount: amountTon,
        });
        const gifts: any[] = response.data?.gifts ?? [];
        if (Array.isArray(gifts) && gifts.length > 0) {
          await this.redisService.set(
            MIN_PRICE_REDIS_KEY,
            String(amountTon),
            MIN_PRICE_TTL_SECONDS,
          );
          return amountTon;
        }
      } catch (err) {
        this.logger.warn(
          `Upgrate min price probe at ${amountTon} failed: ${(err as Error).message}`,
        );
      }
      amountTon += MIN_PRICE_PROBE_STEP;
    }

    const fallback = 1;
    await this.redisService.set(
      MIN_PRICE_REDIS_KEY,
      String(fallback),
      MIN_PRICE_TTL_SECONDS,
    );
    return fallback;
  }
}
