import type { LoanType } from "../common/index.js";
import type { GenericAddress, ITokenData } from "../common/index.js";

export type HubTokenData = {
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress;
  supportedLoanTypes: Set<LoanType>;
} & ITokenData
