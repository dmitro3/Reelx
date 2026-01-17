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
var MarketplaceAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let MarketplaceAdapter = MarketplaceAdapter_1 = class MarketplaceAdapter {
    configService;
    logger = new common_1.Logger(MarketplaceAdapter_1.name);
    api;
    baseUrl = 'https://api.marketapp.ws/v1';
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('MARKETPLACE_API_KEY');
        const headers = {};
        if (this.apiKey) {
            this.logger.debug('Marketplace API key loaded');
            headers['Authorization'] = `${this.apiKey}`;
            headers['X-API-Key'] = this.apiKey;
        }
        else {
            this.logger.warn('Marketplace API key not found in environment variables');
        }
        this.api = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers,
        });
    }
    async getNftData(nftAddress) {
        try {
            let response;
            try {
                response = await this.api.get(`/nfts/${nftAddress}/`, {
                    headers: this.apiKey ? {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'X-API-Key': this.apiKey,
                    } : {},
                });
                return response.data;
            }
            catch (e) {
                if (e.response?.status === 404) {
                    try {
                        response = await this.api.get(`/nfts/${nftAddress}`, {
                            headers: this.apiKey ? {
                                'Authorization': `Bearer ${this.apiKey}`,
                                'X-API-Key': this.apiKey,
                            } : {},
                        });
                        if (response.data) {
                            this.logger.debug(`Marketplace API response (no slash) for ${nftAddress}: ${JSON.stringify(response.data)}`);
                        }
                        return response.data;
                    }
                    catch (e2) {
                        if (e2.response?.status === 401 && this.apiKey) {
                            try {
                                response = await this.api.get(`/nfts/${nftAddress}`, {
                                    headers: {
                                        'X-API-Key': this.apiKey,
                                    },
                                });
                                if (response.data) {
                                    this.logger.debug(`Marketplace API response (X-API-Key only) for ${nftAddress}: ${JSON.stringify(response.data)}`);
                                }
                                return response.data;
                            }
                            catch (e3) {
                                throw e3;
                            }
                        }
                        throw e2;
                    }
                }
                else if (e.response?.status === 401 && this.apiKey) {
                    try {
                        response = await this.api.get(`/nfts/${nftAddress}/`, {
                            headers: {
                                'X-API-Key': this.apiKey,
                            },
                        });
                        if (response.data) {
                            this.logger.debug(`Marketplace API response (X-API-Key, slash) for ${nftAddress}: ${JSON.stringify(response.data)}`);
                        }
                        return response.data;
                    }
                    catch (e3) {
                        throw e;
                    }
                }
                else {
                    throw e;
                }
            }
        }
        catch (error) {
            if (error.response?.status === 401) {
                this.logger.warn(`Marketplace API authentication failed for NFT ${nftAddress}. Status: ${error.response.status}, API Key present: ${!!this.apiKey}`);
                if (error.response.data) {
                    this.logger.debug(`Marketplace API error response: ${JSON.stringify(error.response.data)}`);
                }
            }
            else {
                this.logger.warn(`Failed to fetch marketplace data for NFT ${nftAddress}: ${error.message}`);
                if (error.response) {
                    this.logger.debug(`Marketplace API response status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
                }
            }
            return null;
        }
    }
};
exports.MarketplaceAdapter = MarketplaceAdapter;
exports.MarketplaceAdapter = MarketplaceAdapter = MarketplaceAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MarketplaceAdapter);
//# sourceMappingURL=marketplace.adapter.js.map