import type { EventParams } from "../types/contract.js";

export const defaultEventParams: EventParams = {
  fromBlock: "earliest",
  toBlock: "latest",
  strict: true,
};

export const GAS_LIMIT_ESTIMATE_INCREASE = 10_000n;
