import { MarketplaceAdapter } from '../adapters/marketplace.adapter';
import { TonBlockchainAdapter } from '../adapters/ton-blockchain.adapter';
import { MetadataAdapter } from '../adapters/metadata.adapter';
import { CacheService } from './cache.service';
import { NftResponseDto } from '../dto/nft-response.dto';
export declare class NftService {
    private readonly marketplaceAdapter;
    private readonly tonBlockchainAdapter;
    private readonly metadataAdapter;
    private readonly cacheService;
    private readonly logger;
    constructor(marketplaceAdapter: MarketplaceAdapter, tonBlockchainAdapter: TonBlockchainAdapter, metadataAdapter: MetadataAdapter, cacheService: CacheService);
    getNftData(nftAddress: string): Promise<NftResponseDto>;
}
