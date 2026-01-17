import { ConfigService } from '@nestjs/config';
import { MarketplaceNftResponse } from '../interfaces/marketplace-response.interface';
export declare class MarketplaceAdapter {
    private readonly configService;
    private readonly logger;
    private readonly api;
    private readonly baseUrl;
    private readonly apiKey;
    constructor(configService: ConfigService);
    getNftData(nftAddress: string): Promise<MarketplaceNftResponse | null>;
}
