import type { EventParams } from "../types/contract.js";

export const defaultEventParams: EventParams = {
  fromBlock: "earliest",
  toBlock: "latest",
  strict: true,
};
