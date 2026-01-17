import { ConfigService } from '@nestjs/config';
import { Cell } from 'ton-core';
import { TonNftData, ParsedContentUrl } from '../interfaces/ton-nft-data.interface';
export declare class TonBlockchainAdapter {
    private readonly configService;
    private readonly logger;
    private readonly api;
    private readonly tonApiUrl;
    private readonly apiKey;
    private readonly alternativeApis;
    constructor(configService: ConfigService);
    getNftData(nftAddress: string): Promise<TonNftData | null>;
    parseIndividualContent(cell: Cell | null, contentUri?: string): ParsedContentUrl | null;
    private parseContentUrl;
}
