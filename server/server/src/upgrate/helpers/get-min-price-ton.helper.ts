import type { LoggerService } from '@nestjs/common';
import type { AxiosInstance } from 'axios';

import type { RedisService } from '../../../libs/infrustructure/redis/redis.service';

export type GetMinPriceTonDeps = {
  redisService: RedisService;
  axiosInstance: AxiosInstance;
  logger: LoggerService;
  nftBuyerUrl: string;
  redisKey: string;
  ttlSeconds: number;
  probeStep: number;
  maxAmountTon: number;
  fallbackTon: number;
};

export async function getMinPriceTon(deps: GetMinPriceTonDeps): Promise<number> {
  const cached = await deps.redisService.get(deps.redisKey);
  if (cached != null) {
    const value = parseFloat(cached);
    if (!Number.isNaN(value)) return value;
  }

  const url = `${deps.nftBuyerUrl}/api/nft/gifts/by-price`;
  let amountTon = deps.probeStep;

  while (amountTon <= deps.maxAmountTon) {
    try {
      const response = await deps.axiosInstance.post(url, { amount: amountTon });
      const gifts: any[] = response.data?.gifts ?? [];
      if (Array.isArray(gifts) && gifts.length > 0) {
        await deps.redisService.set(
          deps.redisKey,
          String(amountTon),
          deps.ttlSeconds,
        );
        return amountTon;
      }
    } catch (err) {
      deps.logger.warn(
        `Upgrate min price probe at ${amountTon} failed: ${(err as Error).message}`,
      );
    }
    amountTon += deps.probeStep;
  }

  await deps.redisService.set(
    deps.redisKey,
    String(deps.fallbackTon),
    deps.ttlSeconds,
  );
  return deps.fallbackTon;
}

