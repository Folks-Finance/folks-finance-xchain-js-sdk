import { FolksHubRewards } from "../../chains/evm/hub/modules/index.js";
import { FolksCore } from "../core/folks-core.js";

import type { LoanTypeInfo } from "../../chains/evm/hub/types/loan.js";
import type { UserRewards } from "../../chains/evm/hub/types/rewards.js";
import type { AccountId, LoanId } from "../../common/types/lending.js";
import type { LoanTypeId } from "../../common/types/module.js";

export const read = {
  async rewards(
    accountId: AccountId,
    loanIds: Array<LoanId>,
    loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
  ): Promise<UserRewards> {
    return FolksHubRewards.getUserRewards(
      FolksCore.getHubProvider(),
      FolksCore.getSelectedNetwork(),
      accountId,
      loanIds,
      loanTypesInfo,
    );
  },
};
