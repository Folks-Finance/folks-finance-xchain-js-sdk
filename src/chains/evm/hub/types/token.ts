import type { GenericAddress } from "../../../../common/types/address.js";
import type { LoanType } from "../../../../common/types/module.js";
import type { FolksTokenType, ITokenData } from "../../../../common/types/token.js";

export type HubTokenData = {
  poolId: number;
  poolAddress: GenericAddress;
  token: FolksTokenType;
  supportedLoanTypes: Set<LoanType>;
} & ITokenData;
