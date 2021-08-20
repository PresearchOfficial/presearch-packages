export interface IAssetContract {
  name: string;
  owner: number;
  symbol: string;
  address: string;
  schema_name: string;
  created_data: string;
  asset_contract_type: string;
}

export interface ICollection {
  slug: string;
  name: string;
  chat_url: string;
  featured: boolean;
  image_url: string;
  description: string;
  created_date: string;
  payout_address: string;
  large_image_url: string;
  twitter_username: string;
  default_to_fiat: boolean;
  banner_image_url: string;
  featured_image_url: string;
}

export interface IOwner {
  user: { username: string };
  profile_img_url: string;
  address: string;
  config: string;
}

export interface ITrait {
  trait_type: string;
  value: string;
  display_type: string;
  max_value: string | number;
  trait_count: number;
  order: string;
}

export interface IAsset {
  id: number;
  name: string;
  owner: IOwner;
  token_id: string;
  image_url: string;
  last_sale: string;
  permalink: string;
  description: string;
  is_presale: boolean;
  transfer_fee: string;
  listing_date: string;
  external_link: string;
  traits: Array<ITrait>;
  collection: ICollection;
  image_preview_url: string;
  image_thumbnail_url: string;
  asset_contract: IAssetContract;
  transfer_fee_payment_token: string;
}
