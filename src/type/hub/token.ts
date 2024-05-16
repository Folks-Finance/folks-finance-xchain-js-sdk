import type { LoanType } from "../common/index.js";
import type { GenericAddress, ITokenData } from "../common/index.js";

export interface HubTokenData extends ITokenData {
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress;
  supportedLoanTypes: Set<LoanType>;
}
