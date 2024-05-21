import type {
  LoanType,
  GenericAddress,
  ITokenData,
} from "../../../../common/types/index.js";

export type HubTokenData = {
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress;
  supportedLoanTypes: Set<LoanType>;
} & ITokenData;
