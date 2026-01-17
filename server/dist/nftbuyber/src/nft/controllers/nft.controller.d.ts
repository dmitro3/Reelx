import { NftService } from '../services/nft.service';
import { NftResponseDto } from '../dto/nft-response.dto';
export declare class NftController {
    private readonly nftService;
    private readonly logger;
    constructor(nftService: NftService);
    getNftData(address: string): Promise<NftResponseDto>;
}
