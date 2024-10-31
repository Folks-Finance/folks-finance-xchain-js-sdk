import { getActiveEpochs, getUnclaimedRewards } from "../../chains/evm/hub/modules/folks-hub-rewards.js";
import { FolksHubRewards } from "../../chains/evm/hub/modules/index.js";
import { getHubChain, getHubTokensData } from "../../chains/evm/hub/utils/chain.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";
import { assertHubChainSelected, getSignerGenericAddress } from "../../common/utils/chain.js";
import { FolksCore } from "../core/folks-core.js";

import type { PrepareUpdateUserPointsInLoans } from "../../chains/evm/common/types/index.js";
import type { LoanTypeInfo } from "../../chains/evm/hub/types/loan.js";
import type { ActiveEpochs, UserPoints } from "../../chains/evm/hub/types/rewards.js";
import type { ChainType } from "../../common/types/chain.js";
import type { AccountId, LoanId } from "../../common/types/lending.js";
import type {
  LoanTypeId,
  PrepareClaimRewardsCall,
  PrepareUpdateAccountsPointsForRewardsCall,
} from "../../common/types/module.js";

export const prepare = {
  async updateUserPointsInLoans(loanIds: Array<LoanId>): Promise<PrepareUpdateUserPointsInLoans> {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    return await FolksHubRewards.prepare.updateUserPointsInLoans(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      convertFromGenericAddress(userAddress, folksChain.chainType),
      loanIds,
      hubChain,
    );
  },

  async updateAccountsPointsForRewards(
    accountIds: Array<AccountId>,
    activeEpochs: ActiveEpochs,
  ): Promise<PrepareUpdateAccountsPointsForRewardsCall> {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    return await FolksHubRewards.prepare.updateAccountsPointsForRewards(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      convertFromGenericAddress(userAddress, folksChain.chainType),
      hubChain,
      accountIds,
      activeEpochs,
    );
  },

  async claimRewards(accountId: AccountId, activeEpochs: ActiveEpochs): Promise<PrepareClaimRewardsCall> {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    return await FolksHubRewards.prepare.claimRewards(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      convertFromGenericAddress(userAddress, folksChain.chainType),
      hubChain,
      accountId,
      activeEpochs,
    );
  },
};

export const write = {
  async updateUserPointsInLoans(loanIds: Array<LoanId>, prepareCall: PrepareUpdateUserPointsInLoans) {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubRewards.write.updateUserPointsInLoans(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      FolksCore.getSigner<ChainType.EVM>(),
      loanIds,
      prepareCall,
    );
  },

  async updateAccountsPointsForRewards(
    accountIds: Array<AccountId>,
    prepareCall: PrepareUpdateAccountsPointsForRewardsCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubRewards.write.updateAccountsPointsForRewards(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      FolksCore.getSigner<ChainType.EVM>(),
      accountIds,
      prepareCall,
    );
  },

  async claimRewards(accountId: AccountId, prepareCall: PrepareClaimRewardsCall) {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubRewards.write.claimRewards(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      FolksCore.getSigner<ChainType.EVM>(),
      accountId,
      prepareCall,
    );
  },
};

export const read = {
  activeEpochs(): Promise<ActiveEpochs> {
    const network = FolksCore.getSelectedNetwork();
    const tokensData = Object.values(getHubTokensData(network));
    return getActiveEpochs(FolksCore.getHubProvider(), FolksCore.getSelectedNetwork(), tokensData);
  },

  unclaimedRewards(accountId: AccountId, activeEpochs: ActiveEpochs): Promise<bigint> {
    return getUnclaimedRewards(FolksCore.getHubProvider(), FolksCore.getSelectedNetwork(), accountId, activeEpochs);
  },

  async userPoints(
    accountId: AccountId,
    loanIds: Array<LoanId>,
    loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
  ): Promise<UserPoints> {
    return FolksHubRewards.getUserPoints(
      FolksCore.getHubProvider(),
      FolksCore.getSelectedNetwork(),
      accountId,
      loanIds,
      loanTypesInfo,
    );
  },
};
