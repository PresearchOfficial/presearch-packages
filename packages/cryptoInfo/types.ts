export type ILinks = {
  homepage: Array<string>;
  blockchain_site: Array<string>;
  official_forum_url: Array<string>;
  chat_url: Array<string>;
  announcement_url: Array<string>;
  twitter_screen_name: string;
  facebook_username: string;
  bitcointalk_thread_identifier: string;
  telegram_channel_identifier: string;
  subreddit_url: string;
  repos_url: {
    github: Array<string>;
    bitbucket: Array<string>;
  };
};

export type IMarketData = {
  max_supply: number;
  total_supply: number;
  last_updated: string;
  market_cap_rank: number;
  price_change_24h: number;
  circulating_supply: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_change_percentage_24h_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_1h_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_24h_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_7d_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_14d_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_30d_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_60d_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_200d_in_currency: {
    [key: string]: number;
  };
  price_change_percentage_1y_in_currency: {
    [key: string]: number;
  };
  market_cap_change_24h_in_currency: {
    [key: string]: number;
  };
  fully_diluted_valuation: {
    [key: string]: number;
  };
  price_change_24h_in_currency: {
    [key: string]: number;
  };
  total_volume: {
    [key: string]: number;
  };
  current_price: {
    [key: string]: number;
  };
  market_cap: {
    [key: string]: number;
  };
  high_24h: {
    [key: string]: number;
  };
  low_24h: {
    [key: string]: number;
  };
};

export type ICoin = {
  id: string;
  name: string;
  symbol: string;
  base: string;
  target: string;
  market: IMarketData;
  last: number;
  volume: number;
  image: {
    small: string;
  };
  converted_last: string;
  converted_volume: number;
  trust_score: string;
  market_data: IMarketData;
  links: ILinks;
  market_cap_rank: number;
  asset_platform_id: boolean;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string;
  token_info_url: null;
  coin_id: string;
  target_coin_id: string;
};
