export interface GiftItem {
    address: string;
    name: string;
    collection: {
        address: string;
        name: string;
    };
    price: number;
    image: string;
    ownerAddress: string;
    actualOwnerAddress: string;
}