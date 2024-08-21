import type { EventParams } from "../types/contract.js";

export const defaultEventParams: EventParams = {
  fromBlock: "earliest",
  toBlock: "latest",
  strict: true,
};

export const GAS_LIMIT_ESTIMATE_INCREASE = 100_000n; // TODO: investigate and reduce
export const SEND_TOKEN_ACTION_RETURN_GAS_LIMIT = 500_000n;
