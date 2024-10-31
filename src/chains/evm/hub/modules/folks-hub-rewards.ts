import { multicall } from "viem/actions";

import { calcAccruedRewards } from "../../../../common/utils/formulae.js";
import { increaseByPercent } from "../../../../common/utils/math-lib.js";
import {
  CLAIM_REWARDS_GAS_LIMIT_SLIPPAGE,
  GAS_LIMIT_ESTIMATE_INCREASE,
  UPDATE_ACCOUNT_POINTS_FOR_REWARDS_GAS_LIMIT_SLIPPAGE,
} from "../../common/constants/contract.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { getHubChain } from "../utils/chain.js";
import { getLoanManagerContract, getRewardsV1Contract } from "../utils/contract.js";

import { getUserLoans } from "./folks-hub-loan.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { NetworkType } from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type {
  PrepareClaimRewardsCall,
  PrepareUpdateAccountsPointsForRewardsCall,
  PrepareUpdateUserPointsInLoans,
} from "../../common/types/module.js";
import type { RewardsV1Abi } from "../constants/abi/rewards-v1-abi.js";
import type { HubChain } from "../types/chain.js";
import type { LoanTypeInfo } from "../types/loan.js";
import type { PoolsPoints, ActiveEpochs, PoolEpoch, UserPoolPoints } from "../types/rewards.js";
import type { HubTokenData } from "../types/token.js";
import type {
  Client,
  ContractFunctionParameters,
  EstimateGasParameters,
  ReadContractReturnType,
  WalletClient,
} from "viem";

function getActivePoolEpochs(activeEpochs: ActiveEpochs): Array<PoolEpoch> {
  const poolEpochs: Array<PoolEpoch> = [];
  for (const { poolId, epochIndex } of Object.values(activeEpochs)) {
    poolEpochs.push({ poolId, epochIndex });
  }
  return poolEpochs;
}

function getHistoricalPoolEpochs(activeEpochs: ActiveEpochs): Array<PoolEpoch> {
  const poolEpochs: Array<PoolEpoch> = [];
  for (const { poolId, epochIndex: activeEpochIndex } of Object.values(activeEpochs)) {
    for (let i = 0; i < activeEpochIndex; i++) {
      poolEpochs.push({ poolId, epochIndex: i });
    }
  }
  return poolEpochs;
}

export const prepare = {
  async updateUserPointsInLoans(
    provider: Client,
    sender: EvmAddress,
    loanIds: Array<LoanId>,
    hubChain: HubChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareUpdateUserPointsInLoans> {
    const loanManager = getLoanManagerContract(provider, hubChain.loanManagerAddress);

    const gasLimit = await loanManager.estimateGas.updateUserLoansPoolsRewards([loanIds], {
      ...transactionOptions,
      value: undefined,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      loanManagerAddress: hubChain.loanManagerAddress,
    };
  },

  async updateAccountsPointsForRewards(
    provider: Client,
    sender: EvmAddress,
    hubChain: HubChain,
    accountIds: Array<AccountId>,
    activeEpochs: ActiveEpochs,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareUpdateAccountsPointsForRewardsCall> {
    const poolEpochs = getActivePoolEpochs(activeEpochs);
    const rewardsV1 = getRewardsV1Contract(provider, hubChain.rewardsV1Address);

    const gasLimit = await rewardsV1.estimateGas.updateAccountPoints([accountIds, poolEpochs], {
      ...transactionOptions,
      value: undefined,
    });

    return {
      gasLimit: increaseByPercent(gasLimit, UPDATE_ACCOUNT_POINTS_FOR_REWARDS_GAS_LIMIT_SLIPPAGE),
      poolEpochs,
      rewardsV1Address: hubChain.rewardsV1Address,
    };
  },

  async claimRewards(
    provider: Client,
    sender: EvmAddress,
    hubChain: HubChain,
    accountId: AccountId,
    activeEpochs: ActiveEpochs,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareClaimRewardsCall> {
    const poolEpochs = getHistoricalPoolEpochs(activeEpochs);
    const rewardsV1 = getRewardsV1Contract(provider, hubChain.rewardsV1Address);

    const gasLimit = await rewardsV1.estimateGas.claimRewards([accountId, poolEpochs, sender], {
      ...transactionOptions,
      value: undefined,
    });

    return {
      gasLimit: increaseByPercent(gasLimit, CLAIM_REWARDS_GAS_LIMIT_SLIPPAGE),
      poolEpochs,
      receiver: sender,
      rewardsV1Address: hubChain.rewardsV1Address,
    };
  },
};

export const write = {
  async updateUserPointsInLoans(
    provider: Client,
    signer: WalletClient,
    loanIds: Array<LoanId>,
    prepareCall: PrepareUpdateUserPointsInLoans,
  ) {
    const { gasLimit, loanManagerAddress } = prepareCall;

    const loanManager = getLoanManagerContract(provider, loanManagerAddress, signer);

    return await loanManager.write.updateUserLoansPoolsRewards([loanIds], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
    });
  },

  async updateAccountsPointsForRewards(
    provider: Client,
    signer: WalletClient,
    accountIds: Array<AccountId>,
    prepareCall: PrepareUpdateAccountsPointsForRewardsCall,
  ) {
    const { gasLimit, poolEpochs, rewardsV1Address } = prepareCall;

    const rewardsV1 = getRewardsV1Contract(provider, rewardsV1Address, signer);

    return await rewardsV1.write.updateAccountPoints([accountIds, poolEpochs], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
    });
  },

  async claimRewards(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    prepareCall: PrepareClaimRewardsCall,
  ) {
    const { gasLimit, poolEpochs, receiver, rewardsV1Address } = prepareCall;

    const rewardsV1 = getRewardsV1Contract(provider, rewardsV1Address, signer);

    return await rewardsV1.write.claimRewards([accountId, poolEpochs, receiver], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
    });
  },
};

export async function getActiveEpochs(
  provider: Client,
  network: NetworkType,
  tokens: Array<HubTokenData>,
): Promise<ActiveEpochs> {
  const hubChain = getHubChain(network);
  const rewardsV1 = getRewardsV1Contract(provider, hubChain.rewardsV1Address);

  const getActiveEpochs: Array<ContractFunctionParameters> = tokens.map(({ poolId }) => ({
    address: rewardsV1.address,
    abi: rewardsV1.abi,
    functionName: "getActiveEpoch",
    args: [poolId],
  }));

  const maybeActiveEpochs = await multicall(provider, {
    contracts: getActiveEpochs,
    allowFailure: true,
  });

  const activeEpochs: ActiveEpochs = {};
  for (const [index, result] of maybeActiveEpochs.entries()) {
    const { folksTokenId, poolId } = tokens[index];
    if (result.status === "success") {
      const [epochIndex, { start: startTimestamp, end: endTimestamp, totalRewards }] =
        result.result as ReadContractReturnType<typeof RewardsV1Abi, "getActiveEpoch">;
      activeEpochs[folksTokenId] = { poolId, epochIndex, startTimestamp, endTimestamp, totalRewards };
    }
  }
  return activeEpochs;
}

export async function getUnclaimedRewards(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  activeEpochs: ActiveEpochs,
): Promise<bigint> {
  const hubChain = getHubChain(network);
  const rewardsV1 = getRewardsV1Contract(provider, hubChain.rewardsV1Address);

  const poolEpochs = getHistoricalPoolEpochs(activeEpochs);
  return await rewardsV1.read.getUnclaimedRewards([accountId, poolEpochs]);
}

export async function getUserPoolPoints(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  loanIds: Array<LoanId>,
  loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
): Promise<UserPoolPoints> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(provider, hubChain.loanManagerAddress);

  // derive the tokens/pools you are interested in
  const seen = new Map<number, FolksTokenId>();
  const poolIds: Array<number> = [];
  const folksTokenIds: Array<FolksTokenId> = [];
  for (const { pools } of Object.values(loanTypesInfo)) {
    for (const { poolId, folksTokenId } of Object.values(pools)) {
      if (!seen.has(poolId)) {
        poolIds.push(poolId);
        folksTokenIds.push(folksTokenId);
        seen.set(poolId, folksTokenId);
      }
    }
  }

  // fetch the account rewards which are updated
  const getUsersPoolRewards: Array<ContractFunctionParameters> = [];
  for (const poolId of poolIds) {
    getUsersPoolRewards.push({
      address: loanManager.address,
      abi: loanManager.abi,
      functionName: "getUserPoolRewards",
      args: [accountId, poolId],
    });
  }

  const accountPoolRewards: Array<PoolsPoints> = (await multicall(provider, {
    contracts: getUsersPoolRewards,
    allowFailure: false,
  })) as Array<PoolsPoints>;

  // initialise with all the rewards which are updated
  const rewards: Partial<Record<FolksTokenId, PoolsPoints>> = {};
  for (const [i, accountPoolReward] of accountPoolRewards.entries()) {
    const folksTokenId = folksTokenIds[i];
    rewards[folksTokenId] = accountPoolReward;
  }
  const userRewards: UserPoolPoints = { accountId, poolsPoints: rewards };

  // add all the rewards which are not updated
  const userLoans = await getUserLoans(provider, network, loanIds);
  for (const loanId of loanIds) {
    const userLoan = userLoans.get(loanId);
    if (userLoan === undefined) throw Error("Unknown user loan");

    const {
      accountId: userLoanAccountId,
      loanTypeId,
      colPools,
      borPools,
      userLoanCollateral,
      userLoanBorrow,
    } = userLoan;

    const loanTypeInfo = loanTypesInfo[loanTypeId];
    if (!loanTypeInfo) throw new Error(`Unknown loan type id ${loanTypeId}`);
    if (accountId !== userLoanAccountId) throw new Error(`Loan ${loanId} belongs to account ${userLoanAccountId}`);

    for (const [i, poolId] of colPools.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const folksTokenId = seen.get(poolId)!;
      const { balance, rewardIndex } = userLoanCollateral[i];

      const loanPool = loanTypeInfo.pools[folksTokenId];
      if (!loanPool) throw new Error(`Unknown loan pool for token ${folksTokenId}`);
      const { collateralRewardIndex } = loanPool.reward;

      const accrued = calcAccruedRewards(balance, collateralRewardIndex, [rewardIndex, 18]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userRewards.poolsPoints[folksTokenId]!.collateral += accrued;
    }

    for (const [i, poolId] of borPools.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const folksTokenId = seen.get(poolId)!;
      const { amount, rewardIndex } = userLoanBorrow[i];

      const loanPool = loanTypeInfo.pools[folksTokenId];
      if (!loanPool) throw new Error(`Unknown loan pool for token ${folksTokenId}`);
      const { borrowRewardIndex } = loanPool.reward;

      const accrued = calcAccruedRewards(amount, borrowRewardIndex, [rewardIndex, 18]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userRewards.poolsPoints[folksTokenId]!.collateral += accrued;
    }
  }

  return userRewards;
}
