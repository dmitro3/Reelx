import { Cell, Address } from 'ton-core';
export interface TonNftData {
    init: boolean;
    index: bigint;
    collection: Address | null;
    owner: Address | null;
    individualContent: Cell | null;
    contentUri?: string;
}
export interface ParsedContentUrl {
    url: string;
    type: 'ipfs' | 'https' | 'unknown';
}
