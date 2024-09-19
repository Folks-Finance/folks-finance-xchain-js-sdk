import * as dn from "dnum";

import type { Dnum } from "dnum";

export const SECONDS_IN_YEAR = BigInt(365 * 24 * 60 * 60);
export const HOURS_IN_YEAR = BigInt(365 * 24);

export function unixTime(): number {
  return Math.floor(Date.now() / 1000);
}

export function expBySquaring(x: Dnum, n: bigint): Dnum {
  const [, decimals] = x;
  const one = dn.from(1, decimals);

  if (n === BigInt(0)) return one;

  let y = one;
  while (n > BigInt(1)) {
    if (n % BigInt(2)) {
      y = dn.mul(x, y, { rounding: "ROUND_DOWN" });
      n = (n - BigInt(1)) / BigInt(2);
    } else {
      n = n / BigInt(2);
    }
    x = dn.mul(x, x, { rounding: "ROUND_DOWN" });
  }
  return dn.mul(x, y, { rounding: "ROUND_DOWN" });
}

function compound(rate: Dnum, period: bigint): Dnum {
  const [, decimals] = rate;
  const one = dn.from(1, decimals);
  return dn.sub(expBySquaring(dn.add(one, dn.div(rate, period)), period), one);
}

export function compoundEverySecond(rate: Dnum): Dnum {
  return compound(rate, SECONDS_IN_YEAR);
}

export function compoundEveryHour(rate: Dnum): Dnum {
  return compound(rate, HOURS_IN_YEAR);
}

export const bigIntMax = (...args: Array<bigint>) => args.reduce((m, e) => (e > m ? e : m));
export const bigIntMin = (...args: Array<bigint>) => args.reduce((m, e) => (e < m ? e : m));

export const increaseByPercent = (value: bigint, percent: number) => {
  return value + (value * BigInt(10_000 * percent)) / BigInt(10_000);
};
