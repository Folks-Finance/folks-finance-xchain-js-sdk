import type { GenericAddress } from "./chain.js";

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

export type SpokeTokenData = {
  tokenType: TokenType;
  poolId: number;
  spokeAddress: GenericAddress;
  tokenAddress: GenericAddress | null;
  tokenDecimals: number;
} & ITokenData;
