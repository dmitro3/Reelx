import { Module } from '@nestjs/common';
import { NftController } from './controllers/nft.controller';
import { NftPurchaseController } from './controllers/nft-purchase.controller';
import { NftService } from './services/nft.service';
import { NftPurchaseService } from './services/nft-purchase.service';
import { CacheService } from './services/cache.service';
import { MarketplaceAdapter } from './adapters/marketplace.adapter';
import { TonBlockchainAdapter } from './adapters/ton-blockchain.adapter';
import { MetadataAdapter } from './adapters/metadata.adapter';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [NftController, NftPurchaseController],
  providers: [
    NftService,
    NftPurchaseService,
    CacheService,
    MarketplaceAdapter,
    TonBlockchainAdapter,
    MetadataAdapter,
  ],
  exports: [NftService, NftPurchaseService],
})
export class NftModule {}

