import * as dn from "dnum";

import { SECONDS_IN_YEAR, expBySquaring, unixTime } from "./math-lib.js";

import type { Dnum } from "dnum";

export function calcPeriodNumber(offset: bigint, length: bigint): bigint {
  return (BigInt(unixTime()) + offset) / length;
}

export function calcNextPeriodReset(
  periodNumber: bigint,
  offset: bigint,
  length: bigint,
): bigint {
  return (periodNumber + BigInt(1)) * length - offset;
}

export function calcDepositInterestIndex(
  dirt1: Dnum,
  diit1: Dnum,
  latestUpdate: bigint,
): Dnum {
  const dt = BigInt(unixTime()) - latestUpdate;
  return dn.mul(
    diit1,
    dn.add(dn.from(1, 18), dn.div(dn.mul(dirt1, dt), SECONDS_IN_YEAR)),
  );
}

export function calcBorrowInterestIndex(
  birt1: Dnum,
  biit1: Dnum,
  latestUpdate: bigint,
): Dnum {
  const dt = BigInt(unixTime()) - latestUpdate;
  return dn.mul(
    biit1,
    expBySquaring(dn.add(dn.from(1, 18), dn.div(birt1, SECONDS_IN_YEAR)), dt),
  );
}

export function calcRewardIndex(
  used: bigint,
  ma: bigint,
  rit1: Dnum,
  rs: Dnum,
  latestUpdate: bigint,
): Dnum {
  if (used <= ma) return rit1;
  const dt = BigInt(unixTime()) - latestUpdate;
  return dn.add(rit1, dn.div(dn.mul(rs, dt), used));
}

export function toFAmount(underlyingAmount: bigint, diit: Dnum): bigint {
  return dn.div(underlyingAmount, diit)[0];
}

export function toUnderlyingAmount(fAmount: bigint, diit: Dnum): bigint {
  return dn.mul(fAmount, diit)[0];
}

function calcAssetDollarValue(
  amount: bigint,
  tokenPrice: Dnum,
  tokenDecimals: number,
): Dnum {
  return dn.mul([amount, tokenDecimals], tokenPrice);
}

export function calcCollateralAssetLoanValue(
  amount: bigint,
  tokenPrice: Dnum,
  tokenDecimals: number,
  collateralFactor: Dnum,
): Dnum {
  return dn.mul(
    calcAssetDollarValue(amount, tokenPrice, tokenDecimals),
    collateralFactor,
  );
}

export function calcBorrowAssetLoanValue(
  amount: bigint,
  tokenPrice: Dnum,
  tokenDecimals: number,
  borrowFactor: Dnum,
): Dnum {
  return dn.mul(
    calcAssetDollarValue(amount, tokenPrice, tokenDecimals),
    borrowFactor,
  );
}

export function calcBorrowBalance(
  bbtn1: bigint,
  biit: Dnum,
  biitn1: Dnum,
): bigint {
  return dn.mul(bbtn1, dn.div(biit, biitn1))[0];
}

export function calcLtvRatio(
  totalBorrowBalanceValue: Dnum,
  totalCollateralBalanceValue: Dnum,
): Dnum {
  const [, decimals] = totalBorrowBalanceValue;
  if (dn.equal(totalCollateralBalanceValue, 0)) return dn.from(0, decimals);
  return dn.div(totalBorrowBalanceValue, totalCollateralBalanceValue);
}

export function calcBorrowUtilisationRatio(
  totalEffectiveBorrowBalanceValue: Dnum,
  totalEffectiveCollateralBalanceValue: Dnum,
): Dnum {
  const [, decimals] = totalEffectiveBorrowBalanceValue;
  if (dn.equal(totalEffectiveCollateralBalanceValue, 0))
    return dn.from(0, decimals);
  return dn.div(
    totalEffectiveBorrowBalanceValue,
    totalEffectiveCollateralBalanceValue,
  );
}

export function calcLiquidationMargin(
  totalEffectiveBorrowBalanceValue: Dnum,
  totalEffectiveCollateralBalanceValue: Dnum,
): Dnum {
  const [, decimals] = totalEffectiveBorrowBalanceValue;
  if (dn.equal(totalEffectiveCollateralBalanceValue, 0))
    return dn.from(0, decimals);
  return dn.div(
    dn.sub(
      totalEffectiveCollateralBalanceValue,
      totalEffectiveBorrowBalanceValue,
    ),
    totalEffectiveCollateralBalanceValue,
  );
}
