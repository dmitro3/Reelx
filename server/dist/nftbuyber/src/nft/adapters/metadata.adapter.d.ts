import { NftMetadataDto } from '../dto/nft-response.dto';
export declare class MetadataAdapter {
    private readonly logger;
    private readonly http;
    private readonly ipfsGateways;
    constructor();
    fetchMetadata(contentUrl: string): Promise<NftMetadataDto | null>;
    extractImageUrl(metadata: NftMetadataDto | null): string | null;
    normalizeImageUrl(imageUrl: string): string;
    private normalizeUrl;
}
