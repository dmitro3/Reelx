/**
 * Ответы TonApi.io (v2) для проверки sale и фильтрации nft_sale_getgems_v4.
 * Документация: https://docs.tonconsole.com/tonapi/rest-api/nft
 */

export interface TonApiSale {
  address?: string;
  marketplace?: string;
  market?: string;
  price?: { amount?: string; token?: string };
  [key: string]: unknown;
}

export interface TonApiNftItem {
  address: string;
  owner?: { address: string };
  collection?: { address: string; name?: string };
  metadata?: { name?: string; image?: string; description?: string };
  previews?: Array<{ url: string }>;
  sale?: TonApiSale;
  [key: string]: unknown;
}

/** GET /v2/nfts/{address} — детали одного NFT */
export interface TonApiNftDetailsResponse extends TonApiNftItem {}

/** GET /v2/accounts/{address}/nfts — список NFT аккаунта */
export interface TonApiAccountNftsResponse {
  nft_items?: TonApiNftItem[];
  [key: string]: unknown;
}
