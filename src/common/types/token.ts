import type { GenericAddress } from "./address.js";

export const MainnetFolksTokenId = {
  USDC: "USDC",
  AVAX: "AVAX",
  sAVAX: "sAVAX",
  ETH_eth: "ETH_eth",
  ETH_base: "ETH_base",
  wETH_ava: "wETH_ava",
  wBTC_eth: "wBTC_eth",
  BTCb_ava: "BTCb_ava",
} as const;
type MainnetFolksTokenId = (typeof MainnetFolksTokenId)[keyof typeof MainnetFolksTokenId];

export const TestnetFolksTokenId = {
  USDC: "USDC",
  AVAX: "AVAX",
  ETH_eth_sep: "ETH_eth_sep",
  ETH_base_sep: "ETH_base_sep",
  ETH_arb_sep: "ETH_arb_sep",
  LINK_eth_sep: "LINK_eth_sep",
  BNB: "BNB",
} as const;
type TestnetFolksTokenId = (typeof TestnetFolksTokenId)[keyof typeof TestnetFolksTokenId];

export type FolksTokenId = MainnetFolksTokenId | TestnetFolksTokenId;

export enum TokenType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  CIRCLE = "CIRCLE",
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

type CircleTokenType = {
  type: TokenType.CIRCLE;
  address: GenericAddress;
  decimals: number;
};

type NativeTokenType = {
  type: TokenType.NATIVE;
  decimals: number;
};

export type FolksSpokeTokenType = Erc20SpokeTokenType | CircleTokenType | NativeTokenType;
export type FolksHubTokenType = Erc20HubTokenType | CircleTokenType | NativeTokenType;

export type SpokeTokenData = {
  poolId: number;
  spokeAddress: GenericAddress;
  token: FolksSpokeTokenType;
} & ITokenData;
