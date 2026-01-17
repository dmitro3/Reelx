import { Module } from '@nestjs/common';
import { GetGemsApiClient } from './getgems-api.client';
import { GiftsSyncService } from './gifts-sync.service';
import { NftsSyncService } from './nfts-sync.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GetGemsApiClient, GiftsSyncService, NftsSyncService],
  exports: [GetGemsApiClient, GiftsSyncService, NftsSyncService],
})
export class GetGemsModule {}
