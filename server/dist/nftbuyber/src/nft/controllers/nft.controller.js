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
var NftController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftController = void 0;
const common_1 = require("@nestjs/common");
const nft_service_1 = require("../services/nft.service");
const ton_core_1 = require("ton-core");
let NftController = NftController_1 = class NftController {
    nftService;
    logger = new common_1.Logger(NftController_1.name);
    constructor(nftService) {
        this.nftService = nftService;
    }
    async getNftData(address) {
        try {
            try {
                ton_core_1.Address.parse(address);
            }
            catch (error) {
                throw new common_1.HttpException(`Invalid TON address format: ${address}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const nftData = await this.nftService.getNftData(address);
            return nftData;
        }
        catch (error) {
            this.logger.error(`Error fetching NFT data for ${address}: ${error.message}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch NFT data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.NftController = NftController;
__decorate([
    (0, common_1.Get)(':address'),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftController.prototype, "getNftData", null);
exports.NftController = NftController = NftController_1 = __decorate([
    (0, common_1.Controller)('nft'),
    __metadata("design:paramtypes", [nft_service_1.NftService])
], NftController);
//# sourceMappingURL=nft.controller.js.map