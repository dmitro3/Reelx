import { nftService, WithdrawNftResponse, BuyNftResponse } from '@/entites/nft/api/api';

class NftWithdrawService {
    async withdrawNft(giftId: string, walletAddress: string): Promise<WithdrawNftResponse> {
        try {
            const response = await nftService.withdrawNft(giftId, walletAddress);
            return response;
        } catch (error) {
            console.error('Error withdrawing NFT:', error);
            throw error;
        }
    }

    async buyNft(nftId: string): Promise<BuyNftResponse> {
        try {
            const response = await nftService.buyNft(nftId);
            return response;
        } catch (error) {
            console.error('Error selling NFT to system:', error);
            throw error;
        }
    }
}

export const nftWithdrawService = new NftWithdrawService();
