import type { AccountId } from "../../../../common/types/lending.js";
import type { FolksTokenId } from "../../../../common/types/token.js";

export type Epoch = {
  poolId: number;
  epochIndex: number;
  startTimestamp: bigint;
  endTimestamp: bigint;
  totalRewards: bigint;
};

export type PoolEpoch = {
  poolId: number;
  epochIndex: number;
};

export type ActiveEpochs = Partial<Record<FolksTokenId, Epoch>>;

export type PoolsPoints = {
  collateral: bigint;
  borrow: bigint;
  interestPaid: bigint;
};

export type UserPoolPoints = {
  accountId: AccountId;
  poolsPoints: Partial<Record<FolksTokenId, PoolsPoints>>;
};
