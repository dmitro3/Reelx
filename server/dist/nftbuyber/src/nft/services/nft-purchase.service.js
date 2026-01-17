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
var NftPurchaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftPurchaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ton_1 = require("@ton/ton");
const ton_crypto_1 = require("ton-crypto");
const ton_core_1 = require("ton-core");
let NftPurchaseService = NftPurchaseService_1 = class NftPurchaseService {
    configService;
    logger = new common_1.Logger(NftPurchaseService_1.name);
    client;
    mnemonic;
    maxRetries = 3;
    retryDelay = 2000;
    constructor(configService) {
        this.configService = configService;
        try {
            const tonCenterUrl = this.configService.get('TONCENTER_URL') || 'https://toncenter.com/api/v2/jsonRPC';
            const tonCenterApiKey = this.configService.get('TONCENTER_API_KEY');
            if (!tonCenterApiKey) {
                this.logger.warn('TONCENTER_API_KEY not found in environment variables');
            }
            this.client = new ton_1.TonClient({
                endpoint: tonCenterUrl,
                apiKey: tonCenterApiKey,
            });
            const mnemonicString = this.configService.get('WALLET_MNEMONIC');
            if (mnemonicString) {
                this.mnemonic = mnemonicString.split(' ').filter(word => word.trim().length > 0);
                if (this.mnemonic.length !== 24) {
                    this.logger.error(`Invalid mnemonic: expected 24 words, got ${this.mnemonic.length}`);
                    this.mnemonic = [];
                }
                else {
                    this.logger.debug('Wallet mnemonic loaded successfully');
                }
            }
            else {
                this.logger.warn('WALLET_MNEMONIC not found in environment variables');
                this.mnemonic = [];
            }
        }
        catch (error) {
            this.logger.error(`Failed to initialize NftPurchaseService: ${error.message}`);
            this.logger.error('Please install dependencies: npm install --legacy-peer-deps');
            this.mnemonic = [];
            this.client = null;
        }
    }
    async isFixedPriceSale(saleAddress) {
        try {
            const expectedOwner = ton_core_1.Address.parse(saleAddress);
            let nftAddress;
            let isComplete = false;
            try {
                const saleData = await this.client.runMethod(expectedOwner, 'get_sale_data');
                isComplete = saleData.stack.readNumber() !== 0;
                saleData.stack.readNumber();
                saleData.stack.readAddress();
                nftAddress = saleData.stack.readAddress();
                if (isComplete) {
                    this.logger.warn(`Sale contract is marked as complete. NFT may not be available.`);
                }
            }
            catch (error) {
                this.logger.warn(`Failed to get NFT address from sale contract: ${error.message}`);
                return false;
            }
            let nftData;
            try {
                nftData = await this.client.runMethod(nftAddress, 'get_nft_data');
            }
            catch (error) {
                this.logger.warn(`Failed to get NFT data: ${error.message}`);
                return false;
            }
            nftData.stack.readNumber();
            nftData.stack.readNumber();
            nftData.stack.readAddress();
            const actualOwner = nftData.stack.readAddress();
            const expectedOwnerStr = expectedOwner.toString({ urlSafe: true, bounceable: false });
            const actualOwnerStr = actualOwner.toString({ urlSafe: true, bounceable: false });
            if (actualOwnerStr !== expectedOwnerStr) {
                const expectedOwnerStrBounceable = expectedOwner.toString({ urlSafe: true, bounceable: true });
                const actualOwnerStrBounceable = actualOwner.toString({ urlSafe: true, bounceable: true });
                if (actualOwnerStrBounceable !== expectedOwnerStrBounceable) {
                    this.logger.warn(`NFT owner mismatch. Expected: ${expectedOwnerStr}, Actual: ${actualOwnerStr}`);
                    return false;
                }
            }
            try {
                const ownerState = await this.client.getContractState(actualOwner);
                if (ownerState.state !== 'active') {
                    this.logger.warn(`NFT owner (sale contract) state: ${ownerState.state} (expected: active)`);
                    return false;
                }
            }
            catch (error) {
                this.logger.warn(`Failed to check contract state: ${error.message}`);
            }
            this.logger.debug('Fixed-price sale confirmed (NFT is the source of truth)');
            return true;
        }
        catch (error) {
            this.logger.warn(`Failed to verify fixed-price sale: ${error.message}`);
            return false;
        }
    }
    async retryOnRateLimit(operation, operationName, retries = this.maxRetries) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                const isRateLimit = error?.status === 429 ||
                    error?.response?.status === 429 ||
                    error?.message?.includes('429') ||
                    error?.message?.includes('rate limit') ||
                    error?.message?.includes('Too Many Requests');
                if (isRateLimit && attempt < retries) {
                    const delay = this.retryDelay * Math.pow(2, attempt);
                    this.logger.warn(`${operationName} rate limited (429). Retry ${attempt + 1}/${retries} after ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw error;
            }
        }
        throw new Error(`Failed after ${retries} retries`);
    }
    async getSalePrice(saleAddress) {
        try {
            const saleAddr = ton_core_1.Address.parse(saleAddress);
            const saleData = await this.retryOnRateLimit(() => this.client.runMethod(saleAddr, 'get_sale_data'), 'get_sale_data');
            saleData.stack.readNumber();
            saleData.stack.readNumber();
            saleData.stack.readAddress();
            saleData.stack.readAddress();
            const fullPrice = saleData.stack.readBigNumber();
            return fullPrice;
        }
        catch (error) {
            const isRateLimit = error?.status === 429 ||
                error?.response?.status === 429 ||
                error?.message?.includes('429');
            if (isRateLimit) {
                this.logger.error(`Rate limit (429) when getting price. Please wait before retrying.`);
            }
            else {
                this.logger.warn(`Failed to get price from sale contract: ${error.message}`);
            }
            return null;
        }
    }
    async buyNft(saleAddress, price) {
        try {
            if (!this.client) {
                return {
                    success: false,
                    error: 'TON client not initialized. Please install dependencies: npm install --legacy-peer-deps',
                };
            }
            if (!this.mnemonic || this.mnemonic.length !== 24) {
                return {
                    success: false,
                    error: 'Wallet mnemonic not configured. Set WALLET_MNEMONIC in environment variables.',
                };
            }
            try {
                ton_core_1.Address.parse(saleAddress);
            }
            catch (error) {
                return {
                    success: false,
                    error: `Invalid sale address format: ${saleAddress}`,
                };
            }
            const isFixedPrice = await this.isFixedPriceSale(saleAddress);
            if (!isFixedPrice) {
                this.logger.warn('Fixed-price sale verification failed, but proceeding with purchase anyway');
            }
            let priceInNano;
            if (price) {
                priceInNano = BigInt(price);
            }
            else {
                const salePrice = await this.getSalePrice(saleAddress);
                if (!salePrice) {
                    return {
                        success: false,
                        error: 'Failed to get price from sale contract. Please specify price manually or wait if rate limited.',
                    };
                }
                priceInNano = salePrice;
            }
            const keyPair = await (0, ton_crypto_1.mnemonicToWalletKey)(this.mnemonic);
            const wallet = ton_1.WalletContractV4.create({
                workchain: 0,
                publicKey: keyPair.publicKey,
            });
            const walletContract = this.client.open(wallet);
            const seqno = await this.retryOnRateLimit(() => walletContract.getSeqno(), 'getSeqno');
            this.logger.log(`Buying NFT on-chain…`);
            this.logger.log(`Sale: ${saleAddress}`);
            this.logger.log(`Price: ${priceInNano.toString()} nanotons`);
            await this.retryOnRateLimit(() => walletContract.sendTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [
                    (0, ton_1.internal)({
                        to: saleAddress,
                        value: priceInNano,
                        bounce: true,
                        body: null,
                    }),
                ],
            }), 'sendTransfer');
            this.logger.log('Transaction sent successfully');
            return {
                success: true,
                message: 'Transaction sent successfully. Check the blockchain for confirmation.',
            };
        }
        catch (error) {
            const isRateLimit = error?.status === 429 ||
                error?.response?.status === 429 ||
                error?.message?.includes('429') ||
                error?.message?.includes('rate limit') ||
                error?.message?.includes('Too Many Requests');
            if (isRateLimit) {
                this.logger.error(`Rate limit (429) when buying NFT. Please wait and try again.`);
                return {
                    success: false,
                    error: 'Rate limit exceeded (429). Please wait a few seconds and try again. Too many requests to TON API.',
                };
            }
            this.logger.error(`Failed to buy NFT: ${error.message}`);
            return {
                success: false,
                error: error.message || 'Unknown error occurred',
            };
        }
    }
};
exports.NftPurchaseService = NftPurchaseService;
exports.NftPurchaseService = NftPurchaseService = NftPurchaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NftPurchaseService);
//# sourceMappingURL=nft-purchase.service.js.map