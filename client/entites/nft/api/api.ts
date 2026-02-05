import * as api from '@/shared/lib/api/api';

export interface WithdrawNftDto {
    giftId: string;
    walletAddress: string;
}

export interface WithdrawNftResponse {
    success: boolean;
    transactionHash?: string;
    message?: string;
    error?: string;
}

export interface BuyNftResponse {
    success: boolean;
    refundAmount: number;
    giftName: string;
}

class NftService {
    async withdrawNft(giftId: string, walletAddress: string): Promise<WithdrawNftResponse> {
        const response = await api.$authHost.post<WithdrawNftResponse>('/gifts/withdraw-nft', {
            giftId,
            walletAddress,
        });
        return response.data;
    }

    async buyNft(nftId: string): Promise<BuyNftResponse> {
        const response = await api.$authHost.post<BuyNftResponse>('/gifts/buy-nft', { nftId });
        return response.data;
    }
}

export const nftService = new NftService();
