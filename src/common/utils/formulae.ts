import * as dn from "dnum";

import { SECONDS_IN_YEAR, expBySquaring, unixTime } from "./math-lib.js";

import type { Dnum } from "Dnum";

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
