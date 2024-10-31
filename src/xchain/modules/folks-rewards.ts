import * as dn from "dnum";

import { getActiveEpochs, getUnclaimedRewards } from "../../chains/evm/hub/modules/folks-hub-rewards.js";
import { FolksHubRewards } from "../../chains/evm/hub/modules/index.js";
import { getHubChain, getHubTokensData } from "../../chains/evm/hub/utils/chain.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";
import { assertHubChainSelected, getSignerGenericAddress } from "../../common/utils/chain.js";
import { SECONDS_IN_YEAR, unixTime } from "../../common/utils/math-lib.js";
import { FolksCore } from "../core/folks-core.js";

import type { PrepareUpdateUserPointsInLoans } from "../../chains/evm/common/types/index.js";
import type { LoanTypeInfo } from "../../chains/evm/hub/types/loan.js";
import type { PoolInfo } from "../../chains/evm/hub/types/pool.js";
import type {
  ActiveEpochs,
  ActiveEpochsInfo,
  LastUpdatedPointsForRewards,
  PendingRewards,
  UserPoints,
} from "../../chains/evm/hub/types/rewards.js";
import type { ChainType } from "../../common/types/chain.js";
import type { AccountId, LoanId } from "../../common/types/lending.js";
import type {
  LoanTypeId,
  PrepareClaimRewardsCall,
  PrepareUpdateAccountsPointsForRewardsCall,
} from "../../common/types/module.js";
import type { FolksTokenId } from "../../common/types/token.js";

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

  async lastUpdatedPointsForRewards(
    accountId: AccountId,
    activeEpochs: ActiveEpochs,
  ): Promise<LastUpdatedPointsForRewards> {
    return FolksHubRewards.lastUpdatedPointsForRewards(
      FolksCore.getHubProvider(),
      FolksCore.getSelectedNetwork(),
      accountId,
      activeEpochs,
    );
  },
};

export const util = {
  activeEpochsInfo(poolsInfo: Partial<Record<FolksTokenId, PoolInfo>>, activeEpochs: ActiveEpochs): ActiveEpochsInfo {
    const activeEpochsInfo: ActiveEpochsInfo = {};
    const currTimestamp = BigInt(unixTime());

    for (const [folksTokenId, activeEpoch] of Object.entries(activeEpochs)) {
      // calculations assumes reward rate is constant and consistent
      const remainingTime = activeEpoch.endTimestamp - BigInt(currTimestamp);
      const fullEpochTime = activeEpoch.endTimestamp - activeEpoch.startTimestamp;

      // remaining rewards is proportional to remaining time in epoch
      const remainingRewards = (remainingTime * activeEpoch.totalRewards) / fullEpochTime;

      // apr is total rewards over the total deposit, scaling by epoch length
      const poolInfo = poolsInfo[folksTokenId as FolksTokenId];
      if (!poolInfo) throw new Error(`Unknown folks token id ${folksTokenId}`);
      const rewardsApr = dn.mul(
        dn.div(activeEpoch.totalRewards, poolInfo.depositData.totalAmount, { decimals: 18 }),
        dn.div(SECONDS_IN_YEAR, remainingTime, { decimals: 18 }),
      );

      activeEpochsInfo[folksTokenId as FolksTokenId] = {
        ...activeEpoch,
        remainingRewards,
        rewardsApr,
      };
    }

    return activeEpochsInfo;
  },

  pendingRewards(
    loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
    activeEpochs: ActiveEpochs,
    userPoints: UserPoints,
    lastUpdatedPointsForRewards: LastUpdatedPointsForRewards,
  ): PendingRewards {
    const pendingRewards: PendingRewards = {};

    for (const [folksTokenId, activeEpoch] of Object.entries(activeEpochs)) {
      // calculations assumes reward rate is constant and consistent
      const fullEpochTime = activeEpoch.endTimestamp - activeEpoch.startTimestamp;

      // consider all loan types to calculate total points in given out in epoch for token
      let totalRewardSpeed = dn.from(0, 18);
      for (const loanTypeInfo of Object.values(loanTypesInfo)) {
        const loanPool = loanTypeInfo.pools[folksTokenId as FolksTokenId];
        if (!loanPool) continue;
        totalRewardSpeed = dn.add(totalRewardSpeed, loanPool.reward.collateralSpeed);
      }
      const [totalPointsInEpoch] = dn.mul(totalRewardSpeed, fullEpochTime, { decimals: 0 });

      // consider points earned since last written to rewardsV1 contract
      const userLatestPoints = userPoints.poolsPoints[folksTokenId as FolksTokenId]?.collateral ?? 0n;
      const userLastWrittenPoints = lastUpdatedPointsForRewards[folksTokenId as FolksTokenId]?.lastWrittenPoints ?? 0n;
      const userWrittenEpochPoints =
        lastUpdatedPointsForRewards[folksTokenId as FolksTokenId]?.writtenEpochPoints ?? 0n;
      const userDeltaPoints = userLatestPoints - userLastWrittenPoints + userWrittenEpochPoints;

      // proportional to the percentage of points you already have of the total points (incl for rest of epoch)
      pendingRewards[folksTokenId as FolksTokenId] = (userDeltaPoints * activeEpoch.totalRewards) / totalPointsInEpoch;
    }

    return pendingRewards;
  },
};
