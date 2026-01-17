export interface MarketplaceCollection {
  address: string;
  name: string;
}

export interface MarketplaceAttribute {
  trait_type: string;
  value: string | number;
}

export interface MarketplaceStatusDetails {
  price?: string;
}

export interface MarketplaceNftResponse {
  address: string;
  name: string;
  collection?: MarketplaceCollection;
  collection_address?: string;
  real_owner?: string;
  status?: 'for_sale' | 'not_for_sale';
  status_details?: MarketplaceStatusDetails;
  price?: string;
  attributes?: MarketplaceAttribute[];
}

