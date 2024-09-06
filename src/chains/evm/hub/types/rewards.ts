import type { AccountId } from "../../../../common/types/lending.js";
import type { FolksTokenId } from "../../../../common/types/token.js";

export type AccountPoolRewards = {
  collateral: bigint;
  borrow: bigint;
  interestPaid: bigint;
};

export type AccountRewards = Partial<Record<FolksTokenId, AccountPoolRewards>>;

export type UserRewards = {
  accountId: AccountId;
  rewards: AccountRewards;
};
