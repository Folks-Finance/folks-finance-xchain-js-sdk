import {
  calcBorrowBalance,
  calcBorrowInterestIndex,
  calcStableInterestRate,
} from "../../../../common/utils/formulae.js";
import { unixTime } from "../../../../common/utils/math-lib.js";

import type { LoanManagerUserLoanBorrow } from "../types/loan.js";
import type { PoolInfo } from "../types/pool.js";

export function initLoanBorrowInterests(isStable: boolean, poolInfo: PoolInfo): LoanManagerUserLoanBorrow {
  const lastInterestIndex = isStable ? BigInt(1e18) : poolInfo.variableBorrowData.interestIndex[0];
  const stableInterestRate = isStable ? poolInfo.stableBorrowData.interestRate[0] : 0n;
  const lastStableUpdateTimestamp = isStable ? BigInt(unixTime()) : 0n;
  return {
    amount: 0n,
    balance: 0n,
    lastInterestIndex,
    stableInterestRate,
    lastStableUpdateTimestamp,
    rewardIndex: 0n,
  };
}

export function updateLoanBorrowInterests(
  borrow: LoanManagerUserLoanBorrow,
  amount: bigint,
  poolInfo: PoolInfo,
  isStableInterestRateToUpdate: boolean,
): LoanManagerUserLoanBorrow {
  if (borrow.lastStableUpdateTimestamp > 0) {
    const oldInterestIndex = borrow.lastInterestIndex;
    const oldStableInterestRate = borrow.stableInterestRate;
    borrow.lastInterestIndex = calcBorrowInterestIndex(
      [oldStableInterestRate, 18],
      [oldInterestIndex, 18],
      borrow.lastStableUpdateTimestamp,
    )[0];
    borrow.lastStableUpdateTimestamp = BigInt(unixTime());

    borrow.balance = calcBorrowBalance(borrow.balance, [borrow.lastInterestIndex, 18], [oldInterestIndex, 18]);

    if (isStableInterestRateToUpdate) {
      borrow.stableInterestRate = calcStableInterestRate(
        borrow.balance,
        amount,
        [oldStableInterestRate, 18],
        poolInfo.stableBorrowData.interestRate,
      )[0];
    }
  } else {
    borrow.balance = calcBorrowBalance(borrow.balance, poolInfo.variableBorrowData.interestIndex, [
      borrow.lastInterestIndex,
      18,
    ]);
    borrow.lastInterestIndex = poolInfo.variableBorrowData.interestIndex[0];
  }

  return borrow;
}
