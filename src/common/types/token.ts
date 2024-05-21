import type { GenericAddress } from "./chain.js";

export enum FolksTokenId {
  USDC = "USDC",
  ETH = "ETH",
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
  spokeAddress: GenericAddress;
  tokenAddress: GenericAddress;
  tokenDecimals: number;
} & ITokenData;
