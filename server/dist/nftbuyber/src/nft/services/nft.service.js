"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NftService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
const common_1 = require("@nestjs/common");
const marketplace_adapter_1 = require("../adapters/marketplace.adapter");
const ton_blockchain_adapter_1 = require("../adapters/ton-blockchain.adapter");
const metadata_adapter_1 = require("../adapters/metadata.adapter");
const cache_service_1 = require("./cache.service");
let NftService = NftService_1 = class NftService {
    marketplaceAdapter;
    tonBlockchainAdapter;
    metadataAdapter;
    cacheService;
    logger = new common_1.Logger(NftService_1.name);
    constructor(marketplaceAdapter, tonBlockchainAdapter, metadataAdapter, cacheService) {
        this.marketplaceAdapter = marketplaceAdapter;
        this.tonBlockchainAdapter = tonBlockchainAdapter;
        this.metadataAdapter = metadataAdapter;
        this.cacheService = cacheService;
        setInterval(() => {
            this.cacheService.cleanup();
        }, 10 * 60 * 1000);
    }
    async getNftData(nftAddress) {
        const cached = this.cacheService.get(nftAddress);
        if (cached) {
            this.logger.debug(`Returning cached data for NFT ${nftAddress}`);
            return cached;
        }
        const sources = {
            marketplace: false,
            onchain: false,
            metadata: false,
        };
        let name = '';
        let collection = { address: '', name: '' };
        let status = 'not_for_sale';
        let price = '0';
        let attributes = [];
        let imageUrl = '';
        let rawImageUrl = '';
        let metadata = {};
        const [marketplaceResult, tonResult] = await Promise.allSettled([
            this.marketplaceAdapter.getNftData(nftAddress),
            this.tonBlockchainAdapter.getNftData(nftAddress),
        ]);
        if (marketplaceResult.status === 'fulfilled' && marketplaceResult.value) {
            const marketplaceData = marketplaceResult.value;
            sources.marketplace = true;
            this.logger.debug(`Marketplace data received: ${JSON.stringify(marketplaceData)}`);
            if (marketplaceData.name) {
                name = marketplaceData.name;
            }
            if (marketplaceData.collection) {
                collection = {
                    address: marketplaceData.collection.address,
                    name: marketplaceData.collection.name || '',
                };
            }
            else if (marketplaceData.collection_address) {
                collection.address = marketplaceData.collection_address;
            }
            if (marketplaceData.status) {
                status = marketplaceData.status;
            }
            if (marketplaceData.status_details?.price) {
                price = String(marketplaceData.status_details.price);
            }
            else if (marketplaceData.price) {
                price = String(marketplaceData.price);
            }
            else if (marketplaceData.price_in_nano) {
                price = String(marketplaceData.price_in_nano);
            }
            else if (marketplaceData.amount) {
                price = String(marketplaceData.amount);
            }
            else if (marketplaceData.ton_price) {
                price = String(marketplaceData.ton_price);
            }
            else {
                this.logger.warn(`Price not found in marketplace data for ${nftAddress}. Available fields: ${Object.keys(marketplaceData).join(', ')}`);
            }
            if (marketplaceData.attributes) {
                attributes = marketplaceData.attributes.map(attr => ({
                    trait_type: attr.trait_type,
                    value: attr.value,
                }));
            }
        }
        else if (marketplaceResult.status === 'rejected') {
            this.logger.warn(`Marketplace data unavailable for ${nftAddress}: ${marketplaceResult.reason?.message || marketplaceResult.reason}`);
        }
        let tonData = null;
        if (tonResult.status === 'fulfilled' && tonResult.value) {
            tonData = tonResult.value;
        }
        else if (tonResult.status === 'rejected') {
            this.logger.warn(`Onchain data unavailable for ${nftAddress}: ${tonResult.reason?.message || tonResult.reason}`);
        }
        if (tonData && tonData.init) {
            sources.onchain = true;
            if (!collection.address && tonData.collection) {
                collection.address = tonData.collection.toString();
            }
            const contentUrl = this.tonBlockchainAdapter.parseIndividualContent(tonData.individualContent, tonData.contentUri);
            if (contentUrl && (contentUrl.type === 'ipfs' || contentUrl.type === 'https')) {
                rawImageUrl = contentUrl.url;
                try {
                    const fetchedMetadata = await this.metadataAdapter.fetchMetadata(contentUrl.url);
                    if (fetchedMetadata) {
                        sources.metadata = true;
                        metadata = fetchedMetadata;
                        if (!name && fetchedMetadata.name) {
                            name = fetchedMetadata.name;
                        }
                        if (attributes.length === 0 && fetchedMetadata.attributes) {
                            attributes = fetchedMetadata.attributes.map(attr => ({
                                trait_type: attr.trait_type || '',
                                value: attr.value || '',
                            }));
                        }
                        const extractedImage = this.metadataAdapter.extractImageUrl(fetchedMetadata);
                        if (extractedImage) {
                            imageUrl = this.metadataAdapter.normalizeImageUrl(extractedImage);
                            rawImageUrl = extractedImage;
                        }
                    }
                }
                catch (error) {
                    this.logger.warn(`Metadata unavailable for ${nftAddress}: ${error.message}`);
                }
            }
        }
        if (!name) {
            name = nftAddress;
        }
        const response = {
            address: nftAddress,
            name,
            collection,
            status,
            price,
            attributes,
            media: {
                image: imageUrl || '',
                raw_image: rawImageUrl || '',
            },
            metadata,
            sources,
        };
        if (sources.marketplace || sources.onchain || sources.metadata) {
            this.cacheService.set(nftAddress, response);
        }
        return response;
    }
};
exports.NftService = NftService;
exports.NftService = NftService = NftService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [marketplace_adapter_1.MarketplaceAdapter,
        ton_blockchain_adapter_1.TonBlockchainAdapter,
        metadata_adapter_1.MetadataAdapter,
        cache_service_1.CacheService])
], NftService);
//# sourceMappingURL=nft.service.js.map