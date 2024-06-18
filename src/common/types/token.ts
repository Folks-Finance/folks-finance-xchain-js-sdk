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

type Erc20TokenType = {
  type: TokenType.ERC20;
  address: GenericAddress;
  decimals: number;
};

type CircleTokenType = {
  type: TokenType.CIRCLE;
  address: GenericAddress;
  decimals: number;
};

type NativeTokenType = {
  type: TokenType.NATIVE;
  address: null;
  decimals: number;
};

export type FolksTokenType = Erc20TokenType | CircleTokenType | NativeTokenType;

export type SpokeTokenData = {
  poolId: number;
  spokeAddress: GenericAddress;
  token: FolksTokenType;
} & ITokenData;
