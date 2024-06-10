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
  type: TokenType.ERC20 | TokenType.CIRCLE;
  address: GenericAddress;
  decimals: number;
};

type NativeSpokeTokenType = {
  type: TokenType.NATIVE;
  address: null;
  decimals: number;
};

export type SpokeTokenType = Erc20SpokeTokenType | NativeSpokeTokenType;

export type SpokeTokenData = {
  poolId: number;
  spokeAddress: GenericAddress;
  token: SpokeTokenType;
} & ITokenData;
