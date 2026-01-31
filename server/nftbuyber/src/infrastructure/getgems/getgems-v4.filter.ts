import { TonApiSale, TonApiNftItem } from '../tonapi/tonapi-response.interface';
import { GetGemsNftListing } from './interfaces/getgems-response.interface';

const GETGEMS_MARKETPLACE = 'getgems';
/** Префикс адреса контракта продажи GetGems v4 (nft_sale_getgems_v4) */
const GETGEMS_V4_ADDRESS_PREFIX = '0:210';

/**
 * Проверяет, что контракт продажи — только nft_sale_getgems_v4.
 * Принимаем к обработке, если:
 * - sale.marketplace содержит "getgems" (без учёта регистра), ИЛИ
 * - sale.address начинается с 0:210... (известный префикс GetGems v4).
 */
export function isGetGemsV4Sale(sale: TonApiSale | null | undefined): boolean {
  if (!sale) {
    return false;
  }
  const marketplace = (sale.marketplace ?? sale.market ?? '').toString().toLowerCase();
  if (marketplace.includes(GETGEMS_MARKETPLACE)) {
    return true;
  }
  const address = (sale.address ?? '').toString();
  if (address.startsWith(GETGEMS_V4_ADDRESS_PREFIX)) {
    return true;
  }
  return false;
}

/**
 * Проверка для формата GetGems API (NftOnSale.sale): type или contractType.
 */
export function isGetGemsV4SaleFromGetGemsApi(sale: {
  type?: string;
  contractType?: string;
  contractAddress?: string | null;
} | null | undefined): boolean {
  if (!sale) {
    return false;
  }
  const type = (sale.type ?? sale.contractType ?? '').toLowerCase();
  if (type.includes('getgems') || type === 'nft_sale_getgems_v4') {
    return true;
  }
  const addr = (sale.contractAddress ?? '').toString();
  if (addr.startsWith(GETGEMS_V4_ADDRESS_PREFIX)) {
    return true;
  }
  return false;
}

/**
 * Преобразует элемент TonApi (с полем sale, прошедший фильтр getgems_v4) в GetGemsNftListing.
 */
export function tonApiNftToGetGemsListing(item: TonApiNftItem): GetGemsNftListing | null {
  const sale = item.sale;
  if (!sale || !isGetGemsV4Sale(sale)) {
    return null;
  }
  const saleAddress = sale.address ?? '';
  const ownerAddress = item.owner?.address ?? '';
  const priceAmount = sale.price?.amount ?? '0';
  const image =
    item.metadata?.image ??
    item.previews?.[0]?.url ??
    '';
  return {
    nftAddress: item.address,
    saleContractAddress: saleAddress,
    ownerAddress,
    marketplace: 'getgems_v4',
    price: { amount: priceAmount, token: 'TON' },
    collection: item.collection
      ? { name: item.collection.name ?? '', address: item.collection.address ?? '' }
      : undefined,
    metadata: item.metadata
      ? {
          name: item.metadata.name ?? '',
          image: image,
          description: item.metadata.description,
        }
      : undefined,
    lastUpdated: new Date(),
  };
}
