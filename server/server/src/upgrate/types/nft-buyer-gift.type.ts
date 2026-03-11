export type NftBuyerGift = {
  id?: string;
  name?: string;
  image?: string;
  /** Может приходить как nanoTON строкой или как number */
  price?: string | number;
};

export function toNftBuyerGift(raw: unknown): NftBuyerGift | null {
  if (raw == null || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const id = typeof obj.id === 'string' ? obj.id : undefined;
  const name = typeof obj.name === 'string' ? obj.name : undefined;
  const image = typeof obj.image === 'string' ? obj.image : undefined;

  const price =
    typeof obj.price === 'string' || typeof obj.price === 'number'
      ? obj.price
      : undefined;

  // если вообще нет полезных полей — считаем мусором
  if (id == null && name == null && image == null && price == null) return null;

  return { id, name, image, price };
}

