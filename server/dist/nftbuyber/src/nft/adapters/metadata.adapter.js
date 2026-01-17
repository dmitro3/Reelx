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
var MetadataAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let MetadataAdapter = MetadataAdapter_1 = class MetadataAdapter {
    logger = new common_1.Logger(MetadataAdapter_1.name);
    http;
    ipfsGateways = [
        'https://ipfs.io/ipfs/',
        'https://gateway.pinata.cloud/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
    ];
    constructor() {
        this.http = axios_1.default.create({
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            },
        });
    }
    async fetchMetadata(contentUrl) {
        try {
            const url = this.normalizeUrl(contentUrl);
            const response = await this.http.get(url);
            return response.data;
        }
        catch (error) {
            this.logger.warn(`Failed to fetch metadata from ${contentUrl}: ${error.message}`);
            return null;
        }
    }
    extractImageUrl(metadata) {
        if (!metadata) {
            return null;
        }
        if (metadata.image) {
            return typeof metadata.image === 'string' ? metadata.image : null;
        }
        if (metadata.image_url) {
            return typeof metadata.image_url === 'string' ? metadata.image_url : null;
        }
        if (metadata.imageUrl) {
            return typeof metadata.imageUrl === 'string' ? metadata.imageUrl : null;
        }
        return null;
    }
    normalizeImageUrl(imageUrl) {
        return this.normalizeUrl(imageUrl);
    }
    normalizeUrl(url) {
        const trimmed = url.trim();
        if (trimmed.startsWith('ipfs://')) {
            const ipfsHash = trimmed.replace('ipfs://', '');
            return `${this.ipfsGateways[0]}${ipfsHash}`;
        }
        if (trimmed.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/) || trimmed.match(/^baf[A-Za-z0-9]{56}$/)) {
            return `${this.ipfsGateways[0]}${trimmed}`;
        }
        return trimmed;
    }
};
exports.MetadataAdapter = MetadataAdapter;
exports.MetadataAdapter = MetadataAdapter = MetadataAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MetadataAdapter);
//# sourceMappingURL=metadata.adapter.js.map