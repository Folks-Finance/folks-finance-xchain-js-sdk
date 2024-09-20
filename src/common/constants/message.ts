import { Action } from "../types/message.js";

export const FINALITY = {
  IMMEDIATE: BigInt(0),
  FINALISED: BigInt(1),
} as const;

export const REVERSIBLE_HUB_ACTIONS = [Action.CreateLoanAndDeposit, Action.Deposit, Action.Repay] as const;

export const SEND_TOKEN_ACTIONS = [Action.CreateLoanAndDeposit, Action.Deposit, Action.Repay] as const;
export const RECEIVE_TOKEN_ACTIONS = [Action.Withdraw, Action.Borrow] as const;
export const HUB_ACTIONS = [Action.DepositFToken, Action.WithdrawFToken, Action.Liquidate, Action.SendToken] as const;
