import { Module } from '@nestjs/common';
import { GetGemsApiClient } from './getgems-api.client';
import { GiftsSyncService } from './gifts-sync.service';
import { NftsSyncService } from './nfts-sync.service';
import { RedisModule } from '../redis/redis.module';
import { TonApiModule } from '../tonapi/tonapi.module';

@Module({
  imports: [RedisModule, TonApiModule],
  providers: [GetGemsApiClient, GiftsSyncService, NftsSyncService],
  exports: [GetGemsApiClient, GiftsSyncService, NftsSyncService],
})
export class GetGemsModule {}
