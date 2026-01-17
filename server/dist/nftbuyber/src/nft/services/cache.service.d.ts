import { NftResponseDto } from '../dto/nft-response.dto';
export declare class CacheService {
    private readonly logger;
    private readonly cache;
    private readonly defaultTtl;
    get(key: string): NftResponseDto | null;
    set(key: string, data: NftResponseDto, ttl?: number): void;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    cleanup(): void;
}
