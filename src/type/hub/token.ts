import { GenericAddress, ITokenData, LoanType } from "../common";

export interface HubTokenData extends ITokenData {
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress;
  supportedLoanTypes: Set<LoanType>;
}
