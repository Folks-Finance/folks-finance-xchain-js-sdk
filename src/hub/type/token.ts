import type { LoanType } from "../../common/type/index.js";
import type { GenericAddress, ITokenData } from "../../common/type/index.js";

export type HubTokenData = {
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress;
  supportedLoanTypes: Set<LoanType>;
} & ITokenData;
