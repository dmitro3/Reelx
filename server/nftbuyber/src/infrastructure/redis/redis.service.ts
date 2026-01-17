import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    
    this.client = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.client.on('error', (error) => {
      this.logger.error(`Redis connection error: ${error.message}`);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error.message}`);
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error.message}`);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}: ${error.message}`);
      throw error;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}: ${error.message}`);
      throw error;
    }
  }

  // Методы для работы с Sorted Set (ZSET)
  async zadd(key: string, score: number, member: string): Promise<void> {
    try {
      await this.client.zadd(key, score, member);
    } catch (error) {
      this.logger.error(`Error adding to sorted set ${key}: ${error.message}`);
      throw error;
    }
  }

  async zrangeByScore(key: string, min: number, max: number, withScores = false): Promise<string[]> {
    try {
      if (withScores) {
        return await this.client.zrangebyscore(key, min, max, 'WITHSCORES');
      }
      return await this.client.zrangebyscore(key, min, max);
    } catch (error) {
      this.logger.error(`Error getting range from sorted set ${key}: ${error.message}`);
      throw error;
    }
  }

  async zrange(key: string, start: number, stop: number, withScores = false): Promise<string[]> {
    try {
      if (withScores) {
        return await this.client.zrange(key, start, stop, 'WITHSCORES');
      }
      return await this.client.zrange(key, start, stop);
    } catch (error) {
      this.logger.error(`Error getting range from sorted set ${key}: ${error.message}`);
      throw error;
    }
  }

  async zrem(key: string, member: string): Promise<void> {
    try {
      await this.client.zrem(key, member);
    } catch (error) {
      this.logger.error(`Error removing from sorted set ${key}: ${error.message}`);
      throw error;
    }
  }

  async zcard(key: string): Promise<number> {
    try {
      return await this.client.zcard(key);
    } catch (error) {
      this.logger.error(`Error getting cardinality of sorted set ${key}: ${error.message}`);
      throw error;
    }
  }

  async zremrangeByScore(key: string, min: number, max: number): Promise<void> {
    try {
      await this.client.zremrangebyscore(key, min, max);
    } catch (error) {
      this.logger.error(`Error removing range from sorted set ${key}: ${error.message}`);
      throw error;
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }
}
