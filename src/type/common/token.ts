import { LoanType } from "./module.js";
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

export interface ITokenData {
  folksTokenId: FolksTokenId;
}

export interface SpokeTokenData extends ITokenData {
  tokenType: TokenType;
  spokeAddress: GenericAddress;
  tokenAddress: GenericAddress;
}

export interface ListedToken {
  tokenType: TokenType;
  supportedLoanTypes: Set<LoanType>;
  poolId: number;
  spokeTokenAddress: GenericAddress;
  hubPoolAddress: GenericAddress;
  tokenAddress: {
    spoke: GenericAddress;
    hub: GenericAddress;
  } | null; // null if native gas token
}
