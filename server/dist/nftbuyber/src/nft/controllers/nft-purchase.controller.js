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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NftPurchaseController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftPurchaseController = void 0;
const common_1 = require("@nestjs/common");
const nft_purchase_service_1 = require("../services/nft-purchase.service");
const buy_nft_dto_1 = require("../dto/buy-nft.dto");
const ton_core_1 = require("ton-core");
let NftPurchaseController = NftPurchaseController_1 = class NftPurchaseController {
    nftPurchaseService;
    logger = new common_1.Logger(NftPurchaseController_1.name);
    constructor(nftPurchaseService) {
        this.nftPurchaseService = nftPurchaseService;
    }
    async buyNft(buyDto) {
        try {
            try {
                ton_core_1.Address.parse(buyDto.sale_address);
            }
            catch (error) {
                throw new common_1.HttpException(`Invalid sale contract address format: ${buyDto.sale_address}`, common_1.HttpStatus.BAD_REQUEST);
            }
            if (buyDto.price) {
                try {
                    const priceBigInt = BigInt(buyDto.price);
                    if (priceBigInt <= 0n) {
                        throw new common_1.HttpException('Price must be greater than 0', common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                catch (error) {
                    if (error instanceof common_1.HttpException) {
                        throw error;
                    }
                    throw new common_1.HttpException(`Invalid price format: ${buyDto.price}`, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const result = await this.nftPurchaseService.buyNft(buyDto.sale_address, buyDto.price);
            if (!result.success) {
                throw new common_1.HttpException(result.error || 'Failed to buy NFT', common_1.HttpStatus.BAD_REQUEST);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error buying NFT: ${error.message}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to buy NFT', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.NftPurchaseController = NftPurchaseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [buy_nft_dto_1.BuyNftDto]),
    __metadata("design:returntype", Promise)
], NftPurchaseController.prototype, "buyNft", null);
exports.NftPurchaseController = NftPurchaseController = NftPurchaseController_1 = __decorate([
    (0, common_1.Controller)('nft/purchase'),
    __metadata("design:paramtypes", [nft_purchase_service_1.NftPurchaseService])
], NftPurchaseController);
//# sourceMappingURL=nft-purchase.controller.js.map