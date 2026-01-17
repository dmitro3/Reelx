import { NftPurchaseService } from '../services/nft-purchase.service';
import { BuyNftDto, BuyNftResponse } from '../dto/buy-nft.dto';
export declare class NftPurchaseController {
    private readonly nftPurchaseService;
    private readonly logger;
    constructor(nftPurchaseService: NftPurchaseService);
    buyNft(buyDto: BuyNftDto): Promise<BuyNftResponse>;
}
