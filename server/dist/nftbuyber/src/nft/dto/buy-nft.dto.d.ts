export declare class BuyNftDto {
    sale_address: string;
    price?: string;
}
export interface BuyNftResponse {
    success: boolean;
    transaction_hash?: string;
    message?: string;
    error?: string;
}
