import type { GenericAddress } from "./address.js";
import type { AdapterType } from "./message.js";

export const MAINNET_FOLKS_TOKEN_ID = {
  USDC: "USDC",
  AVAX: "AVAX",
  sAVAX: "sAVAX",
  ETH_eth: "ETH_eth",
  ETH_base: "ETH_base",
  wETH_ava: "wETH_ava",
  wBTC_eth: "wBTC_eth",
  BTCb_ava: "BTCb_ava",
  cbBTC_base: "cbBTC_base",
  BNB: "BNB",
  ETHB_bsc: "ETHB_bsc",
  BTCB_bsc: "BTCB_bsc",
  ETH_arb: "ETH_arb",
  ARB: "ARB",
  SolvBTC: "SolvBTC",
} as const;
export type MainnetFolksTokenId = (typeof MAINNET_FOLKS_TOKEN_ID)[keyof typeof MAINNET_FOLKS_TOKEN_ID];

export const TESTNET_FOLKS_TOKEN_ID = {
  USDC: "USDC",
  AVAX: "AVAX",
  ETH_eth_sep: "ETH_eth_sep",
  ETH_base_sep: "ETH_base_sep",
  ETH_arb_sep: "ETH_arb_sep",
  LINK_eth_sep: "LINK_eth_sep",
  BNB: "BNB",
} as const;
export type TestnetFolksTokenId = (typeof TESTNET_FOLKS_TOKEN_ID)[keyof typeof TESTNET_FOLKS_TOKEN_ID];

export type FolksTokenId = MainnetFolksTokenId | TestnetFolksTokenId;

export enum TokenType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  CROSS_CHAIN = "CROSS_CHAIN",
}

export type ITokenData = {
  folksTokenId: FolksTokenId;
};

type Erc20SpokeTokenType = {
  type: TokenType.ERC20;
  address: GenericAddress;
  decimals: number;
};

type Erc20HubTokenType = {
  type: TokenType.ERC20;
  decimals: number;
};

export type CrossChainTokenType = {
  type: TokenType.CROSS_CHAIN;
  adapters: Array<AdapterType>;
  address: GenericAddress;
  decimals: number;
};

type NativeTokenType = {
  type: TokenType.NATIVE;
  decimals: number;
};

export type FolksSpokeTokenType = Erc20SpokeTokenType | CrossChainTokenType | NativeTokenType;
export type FolksHubTokenType = Erc20HubTokenType | CrossChainTokenType | NativeTokenType;

export type SpokeTokenData = {
  poolId: number;
  spokeAddress: GenericAddress;
  token: FolksSpokeTokenType;
} & ITokenData;
