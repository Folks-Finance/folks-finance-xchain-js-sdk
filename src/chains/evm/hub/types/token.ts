import type { GenericAddress } from "../../../../common/types/address.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { FolksTokenType, ITokenData } from "../../../../common/types/token.js";

export type HubTokenData = {
  poolId: number;
  poolAddress: GenericAddress;
  token: FolksTokenType;
  supportedLoanTypes: Set<LoanTypeId>;
} & ITokenData;
