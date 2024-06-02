import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Dnum } from "dnum";

// added because ts(2589)
export type AbiLoanPool = {
  collateralUsed: bigint;
  borrowUsed: bigint;
  collateralCap: bigint;
  borrowCap: bigint;
  collateralFactor: number;
  borrowFactor: number;
  liquidationBonus: number;
  liquidationFee: number;
  isAdded: boolean;
  isDeprecated: boolean;
  reward: {
    lastUpdateTimestamp: bigint;
    minimumAmount: bigint;
    collateralSpeed: bigint;
    borrowSpeed: bigint;
    collateralRewardIndex: bigint;
    borrowRewardIndex: bigint;
  };
};

export type LoanPoolInfo = {
  collateralUsed: bigint; // in f token
  borrowUsed: bigint; // in token
  collateralCap: bigint; // $ amount
  borrowCap: bigint; // $ amount
  collateralFactor: Dnum;
  borrowFactor: Dnum;
  liquidationBonus: Dnum;
  liquidationFee: Dnum;
  isDeprecated: boolean;
  reward: {
    minimumAmount: bigint; // in token
    collateralSpeed: Dnum;
    borrowSpeed: Dnum;
    collateralRewardIndex: Dnum;
    borrowRewardIndex: Dnum;
  };
};

export type LoanTypeInfo = {
  deprecated: boolean;
  loanTargetHealth: Dnum;
  pools: Partial<Record<FolksTokenId, LoanPoolInfo>>;
};
