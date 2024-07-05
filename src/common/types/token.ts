import type { GenericAddress } from "./address.js";

export enum FolksTokenId {
  USDC = "USDC",
  AVAX = "AVAX",
  ETH_eth_sep = "ETH_eth_sep",
  ETH_base_sep = "ETH_base_sep",
  LINK_eth_sep = "LINK_eth_sep",
}

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
