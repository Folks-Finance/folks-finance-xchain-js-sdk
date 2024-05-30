import type { GenericAddress } from "../../../../common/types/address.js";
import type { LoanType } from "../../../../common/types/module.js";
import type { ITokenData, TokenType } from "../../../../common/types/token.js";

export type HubTokenData = {
  tokenType: TokenType;
  poolId: number;
  poolAddress: GenericAddress;
  tokenAddress: GenericAddress | null;
  tokenDecimals: number;
  supportedLoanTypes: Set<LoanType>;
} & ITokenData;
