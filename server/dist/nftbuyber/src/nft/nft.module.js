"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftModule = void 0;
const common_1 = require("@nestjs/common");
const nft_controller_1 = require("./controllers/nft.controller");
const nft_purchase_controller_1 = require("./controllers/nft-purchase.controller");
const nft_service_1 = require("./services/nft.service");
const nft_purchase_service_1 = require("./services/nft-purchase.service");
const cache_service_1 = require("./services/cache.service");
const marketplace_adapter_1 = require("./adapters/marketplace.adapter");
const ton_blockchain_adapter_1 = require("./adapters/ton-blockchain.adapter");
const metadata_adapter_1 = require("./adapters/metadata.adapter");
let NftModule = class NftModule {
};
exports.NftModule = NftModule;
exports.NftModule = NftModule = __decorate([
    (0, common_1.Module)({
        controllers: [nft_controller_1.NftController, nft_purchase_controller_1.NftPurchaseController],
        providers: [
            nft_service_1.NftService,
            nft_purchase_service_1.NftPurchaseService,
            cache_service_1.CacheService,
            marketplace_adapter_1.MarketplaceAdapter,
            ton_blockchain_adapter_1.TonBlockchainAdapter,
            metadata_adapter_1.MetadataAdapter,
        ],
        exports: [nft_service_1.NftService, nft_purchase_service_1.NftPurchaseService],
    })
], NftModule);
//# sourceMappingURL=nft.module.js.map