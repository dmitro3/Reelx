import { ConfigService } from '@nestjs/config';
import { BuyNftResponse } from '../dto/buy-nft.dto';
export declare class NftPurchaseService {
    private readonly configService;
    private readonly logger;
    private readonly client;
    private readonly mnemonic;
    private readonly maxRetries;
    private readonly retryDelay;
    constructor(configService: ConfigService);
    isFixedPriceSale(saleAddress: string): Promise<boolean>;
    private retryOnRateLimit;
    getSalePrice(saleAddress: string): Promise<bigint | null>;
    buyNft(saleAddress: string, price?: string): Promise<BuyNftResponse>;
}
