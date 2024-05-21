import type { GenericAddress } from "../../../../common/types/chain.js";
import type { LoanType } from "../../../../common/types/module.js";
import type { ITokenData } from "../../../../common/types/token.js";

export type HubTokenData = {
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress;
  supportedLoanTypes: Set<LoanType>;
} & ITokenData;
