import type { EventParams } from "../types/contract.js";

export const defaultEventParams: EventParams = {
  fromBlock: "earliest",
  toBlock: "latest",
  strict: true,
};

export const GAS_LIMIT_ESTIMATE_INCREASE = 10_000n;
export const SEND_TOKEN_ACTION_RETURN_GAS_LIMIT = 500_000n;
export const RECEIVER_VALUE_SLIPPAGE = 0.01;
export const RETRY_REVERSE_GAS_LIMIT_SLIPPAGE = 0.05;
