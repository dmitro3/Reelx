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
var TonBlockchainAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonBlockchainAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ton_core_1 = require("ton-core");
const axios_1 = require("axios");
let TonBlockchainAdapter = TonBlockchainAdapter_1 = class TonBlockchainAdapter {
    configService;
    logger = new common_1.Logger(TonBlockchainAdapter_1.name);
    api;
    tonApiUrl;
    apiKey;
    alternativeApis = [
        'https://testnet.toncenter.com/api/v3',
        'https://tonapi.io/v3',
    ];
    constructor(configService) {
        this.configService = configService;
        this.tonApiUrl = this.configService.get('TON_API_URL') || 'https://toncenter.com/api/v3';
        this.apiKey = this.configService.get('TON_API_KEY');
        const headers = {
            'Accept': 'application/json',
        };
        if (this.apiKey) {
            this.logger.debug('TON API key loaded');
            headers['X-API-Key'] = this.apiKey;
        }
        else {
            this.logger.warn('TON API key not found in environment variables');
        }
        this.logger.debug(`Using TON API URL: ${this.tonApiUrl}`);
        this.api = axios_1.default.create({
            baseURL: this.tonApiUrl,
            timeout: 15000,
            headers,
        });
    }
    async getNftData(nftAddress) {
        try {
            const address = ton_core_1.Address.parse(nftAddress);
            const params = {
                address: nftAddress,
                include_on_sale: false,
                limit: 1,
                offset: 0,
            };
            if (this.apiKey) {
                params.api_key = this.apiKey;
            }
            const queryString = new URLSearchParams({
                address: nftAddress,
                include_on_sale: 'false',
                limit: '1',
                offset: '0',
            }).toString();
            const fullUrl = `${this.tonApiUrl}/nft/items?${queryString}`;
            this.logger.debug(`TON API request: GET ${fullUrl}`);
            const headers = {
                'Accept': 'application/json',
            };
            if (this.apiKey) {
                headers['X-API-Key'] = this.apiKey;
            }
            const response = await axios_1.default.get(fullUrl, {
                headers,
                timeout: 15000,
            });
            if (!response.data || !response.data.nft_items || response.data.nft_items.length === 0) {
                this.logger.warn(`No NFT items found for address ${nftAddress}`);
                return null;
            }
            const nftItem = response.data.nft_items[0];
            const init = nftItem.init === true;
            const index = BigInt(nftItem.index || '0');
            let collectionAddress = null;
            if (nftItem.collection_address) {
                try {
                    const collectionRaw = nftItem.collection_address;
                    const collectionEntry = response.data.address_book?.[collectionRaw];
                    if (collectionEntry?.user_friendly) {
                        collectionAddress = ton_core_1.Address.parse(collectionEntry.user_friendly);
                    }
                    else if (collectionRaw) {
                        try {
                            collectionAddress = ton_core_1.Address.parse(collectionRaw);
                        }
                        catch (parseError) {
                            this.logger.debug(`Failed to parse collection address ${collectionRaw} directly: ${parseError.message}`);
                        }
                    }
                }
                catch (e) {
                    this.logger.warn(`Failed to parse collection address: ${e.message}`);
                }
            }
            let ownerAddress = null;
            if (nftItem.owner_address) {
                try {
                    const ownerRaw = nftItem.owner_address;
                    const ownerEntry = response.data.address_book?.[ownerRaw];
                    if (ownerEntry?.user_friendly) {
                        ownerAddress = ton_core_1.Address.parse(ownerEntry.user_friendly);
                    }
                    else if (ownerRaw) {
                        try {
                            ownerAddress = ton_core_1.Address.parse(ownerRaw);
                        }
                        catch (parseError) {
                            this.logger.debug(`Failed to parse owner address ${ownerRaw} directly: ${parseError.message}`);
                        }
                    }
                }
                catch (e) {
                    this.logger.warn(`Failed to parse owner address: ${e.message}`);
                }
            }
            let individualContent = null;
            const contentUri = nftItem.content?.uri || null;
            if (contentUri) {
                try {
                    individualContent = ton_core_1.Cell.fromBase64('te6cckEBAQEAAgAAAA==');
                }
                catch (e) {
                    this.logger.debug(`Failed to create placeholder cell: ${e.message}`);
                }
            }
            return {
                init,
                index,
                collection: collectionAddress,
                owner: ownerAddress,
                individualContent,
                contentUri: contentUri || undefined,
            };
        }
        catch (error) {
            this.logger.warn(`Failed to fetch TON blockchain data for NFT ${nftAddress}: ${error.message}`);
            if (error.response) {
                this.logger.debug(`TON API response status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
            }
            return null;
        }
    }
    parseIndividualContent(cell, contentUri) {
        if (contentUri) {
            return this.parseContentUrl(contentUri);
        }
        if (!cell) {
            return null;
        }
        try {
            const slice = cell.beginParse();
            try {
                const firstByte = slice.loadUint(8);
                if (firstByte === 0x01) {
                    if (slice.remainingRefs > 0) {
                        const ref = slice.loadRef();
                        const data = ref.beginParse().loadStringTail();
                        return this.parseContentUrl(data);
                    }
                }
                else if (firstByte === 0x00) {
                    if (slice.remainingRefs > 0) {
                        const ref = slice.loadRef();
                        const refSlice = ref.beginParse();
                        const data = refSlice.loadStringTail();
                        return this.parseContentUrl(data);
                    }
                }
            }
            catch (e) {
                this.logger.debug(`Standard parsing failed, trying alternative methods`);
            }
            try {
                const newSlice = cell.beginParse();
                const data = newSlice.loadStringTail();
                return this.parseContentUrl(data);
            }
            catch (e) {
                if (cell.refs.length > 0) {
                    for (const ref of cell.refs) {
                        try {
                            const refSlice = ref.beginParse();
                            const data = refSlice.loadStringTail();
                            return this.parseContentUrl(data);
                        }
                        catch (e2) {
                            continue;
                        }
                    }
                }
            }
        }
        catch (error) {
            this.logger.warn(`Failed to parse individual content: ${error.message}`);
        }
        return null;
    }
    parseContentUrl(data) {
        const trimmed = data.trim();
        if (trimmed.startsWith('ipfs://')) {
            return {
                url: trimmed,
                type: 'ipfs',
            };
        }
        else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return {
                url: trimmed,
                type: 'https',
            };
        }
        return {
            url: trimmed,
            type: 'unknown',
        };
    }
};
exports.TonBlockchainAdapter = TonBlockchainAdapter;
exports.TonBlockchainAdapter = TonBlockchainAdapter = TonBlockchainAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TonBlockchainAdapter);
//# sourceMappingURL=ton-blockchain.adapter.js.map