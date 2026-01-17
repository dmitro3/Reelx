import { Cell, Address } from 'ton-core';

export interface TonNftData {
  init: boolean;
  index: bigint;
  collection: Address | null;
  owner: Address | null;
  individualContent: Cell | null;
  contentUri?: string; // URI из API v3
}

export interface ParsedContentUrl {
  url: string;
  type: 'ipfs' | 'https' | 'unknown';
}

