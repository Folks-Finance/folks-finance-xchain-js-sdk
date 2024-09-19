import { Action } from "../types/message.js";

export const FINALITY = {
  IMMEDIATE: BigInt(0),
  FINALISED: BigInt(1),
} as const;

export const REVERSIBLE_HUB_ACTIONS = [Action.CreateLoanAndDeposit, Action.Deposit, Action.Repay] as const;
