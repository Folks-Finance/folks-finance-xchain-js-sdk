import type { AccountId } from "../../../../common/types/lending.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Dnum } from "dnum";

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

export type ActiveEpochInfo = {
  remainingRewards: bigint;
  rewardsApr: Dnum;
} & Epoch;

export type ActiveEpochsInfo = Partial<Record<FolksTokenId, ActiveEpochInfo>>;

export type PendingRewards = Partial<Record<FolksTokenId, bigint>>;

export type PoolsPoints = {
  collateral: bigint;
  borrow: bigint;
  interestPaid: bigint;
};

export type UserPoints = {
  accountId: AccountId;
  poolsPoints: Partial<Record<FolksTokenId, PoolsPoints>>;
};

export type LastUpdatedPointsForRewards = Partial<
  Record<
    FolksTokenId,
    {
      lastWrittenPoints: bigint;
      writtenEpochPoints: bigint;
    }
  >
>;
