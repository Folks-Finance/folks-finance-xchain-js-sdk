import type { LoanType } from "./module.js";
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
} & ITokenData;

export type ListedToken = {
  tokenType: TokenType;
  supportedLoanTypes: Set<LoanType>;
  poolId: number;
  spokeTokenAddress: GenericAddress;
  hubPoolAddress: GenericAddress;
  tokenAddress: {
    spoke: GenericAddress;
    hub: GenericAddress;
  } | null; // null if native gas token
};
