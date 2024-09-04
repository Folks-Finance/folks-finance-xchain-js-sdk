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
import type { AccountPoolRewards, AccountRewards, UserRewards } from "../types/rewards.js";
import type { Client, ContractFunctionParameters } from "viem";

const emptyAccountRewards = (folksTokenIds: Array<FolksTokenId>): AccountRewards => {
  const accountRewards: AccountRewards = {};
  for (const folksTokenId of folksTokenIds) {
    accountRewards[folksTokenId] = { collateral: 0n, borrow: 0n, interestPaid: 0n };
  }
  return accountRewards;
};

const addToAccountRewards = (existing: AccountPoolRewards, add: AccountPoolRewards) => {
  existing.collateral += add.collateral;
  existing.borrow += add.borrow;
  existing.interestPaid += add.interestPaid;
};

export async function getUserRewards(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  referredAccountIds: Array<AccountId>,
  allLoanIds: Array<LoanId>,
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

  // fetch the accounts rewards which are updated
  const getUsersPoolRewards: Array<ContractFunctionParameters> = [];
  for (const aId of [accountId, ...referredAccountIds]) {
    for (const pId of poolIds) {
      getUsersPoolRewards.push({
        address: loanManager.address,
        abi: loanManager.abi,
        functionName: "getUserPoolRewards",
        args: [aId, pId],
      });
    }
  }

  const accountsPoolRewards: Array<AccountPoolRewards> = (await multicall(provider, {
    contracts: getUsersPoolRewards,
    allowFailure: false,
  })) as Array<AccountPoolRewards>;

  // initialise the rewards
  const userRewards: UserRewards = {
    accountId,
    rewards: emptyAccountRewards(folksTokenIds),
    referrals: {},
  };
  for (const aId of referredAccountIds) userRewards.referrals[aId] = emptyAccountRewards(folksTokenIds);

  // add all the rewards which are updated
  for (const [i, accountPoolReward] of accountsPoolRewards.entries()) {
    const accountIndex = Math.floor(i / folksTokenIds.length) - 1;
    const folksTokenId = folksTokenIds[Math.floor(i / folksTokenIds.length)];
    const accountRewards =
      accountIndex === -1 ? userRewards.rewards : userRewards.referrals[referredAccountIds[accountIndex]];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    addToAccountRewards(accountRewards[folksTokenId]!, accountPoolReward);
  }

  // add all the rewards which are not updated
  const userLoans = await getUserLoans(provider, network, allLoanIds);
  for (const loanId of allLoanIds) {
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

    const accountRewards =
      accountId === userLoanAccountId ? userRewards.rewards : userRewards.referrals[userLoanAccountId];
    for (const [i, poolId] of colPools.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const folksTokenId = seen.get(poolId)!;
      const { balance, rewardIndex } = userLoanCollateral[i];

      const loanPool = loanTypeInfo.pools[folksTokenId];
      if (!loanPool) throw new Error(`Unknown loan pool for token ${folksTokenId}`);
      const { collateralRewardIndex } = loanPool.reward;

      const [accrued] = calcAccruedRewards(balance, collateralRewardIndex, [rewardIndex, 18]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      accountRewards[folksTokenId]!.collateral += accrued;
    }
    for (const [i, poolId] of borPools.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const folksTokenId = seen.get(poolId)!;
      const { amount, rewardIndex } = userLoanBorrow[i];

      const loanPool = loanTypeInfo.pools[folksTokenId];
      if (!loanPool) throw new Error(`Unknown loan pool for token ${folksTokenId}`);
      const { borrowRewardIndex } = loanPool.reward;

      const [accrued] = calcAccruedRewards(amount, borrowRewardIndex, [rewardIndex, 18]);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      accountRewards[folksTokenId]!.borrow += accrued;
    }
  }

  return userRewards;
}
