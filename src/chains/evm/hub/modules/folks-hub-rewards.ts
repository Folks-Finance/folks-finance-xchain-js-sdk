import { multicall } from "viem/actions";

import { calcAccruedRewards } from "../../../../common/utils/formulae.js";
import { getHubChain } from "../utils/chain.js";
import { getLoanManagerContract } from "../utils/contract.js";

import { getUserLoans } from "./folks-hub-loan.js";

import type { NetworkType } from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { LoanTypeInfo } from "../types/loan.js";
import type { AccountPoolRewards, UserRewards } from "../types/rewards.js";
import type { Client, ContractFunctionParameters } from "viem";

export async function getUserRewards(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  loanIds: Array<LoanId>,
  loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
): Promise<UserRewards> {
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

  const accountPoolRewards: Array<AccountPoolRewards> = (await multicall(provider, {
    contracts: getUsersPoolRewards,
    allowFailure: false,
  })) as Array<AccountPoolRewards>;

  // initialise with all the rewards which are updated
  const rewards: Partial<Record<FolksTokenId, AccountPoolRewards>> = {};
  for (const [i, accountPoolReward] of accountPoolRewards.entries()) {
    const folksTokenId = folksTokenIds[i];
    rewards[folksTokenId] = accountPoolReward;
  }
  const userRewards: UserRewards = { accountId, rewards };

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
      userRewards.rewards[folksTokenId]!.collateral += accrued;
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
      userRewards.rewards[folksTokenId]!.collateral += accrued;
    }
  }

  return userRewards;
}
