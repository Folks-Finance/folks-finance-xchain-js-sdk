import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type { LoanType } from "../../../../common/types/module.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { GetEventParams, GetReadContractReturnType } from "../../common/types/contract.js";
import type { LoanManagerAbi } from "../constants/abi/loan-manager-abi.js";
import type { Dnum } from "dnum";

export type LoanPoolInfo = {
  folksTokenId: FolksTokenId;
  poolId: number;
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
  loanTypeId: LoanType;
  deprecated: boolean;
  loanTargetHealth: Dnum;
  pools: Partial<Record<FolksTokenId, LoanPoolInfo>>;
};

export type UserLoanInfoCollateral = {
  folksTokenId: FolksTokenId;
  poolId: number;
  tokenDecimals: number;
  tokenPrice: Dnum;
  collateralFactor: Dnum;
  fTokenBalance: bigint;
  tokenBalance: bigint;
  balanceValue: Dnum;
  effectiveBalanceValue: Dnum;
  interestRate: Dnum;
  interestYield: Dnum;
};

export type UserLoanInfoBorrow = {
  folksTokenId: FolksTokenId;
  poolId: number;
  tokenDecimals: number;
  tokenPrice: Dnum;
  isStable: boolean;
  borrowFactor: Dnum;
  borrowedAmount: bigint;
  borrowedAmountValue: Dnum;
  borrowBalance: bigint;
  borrowBalanceValue: Dnum;
  effectiveBorrowBalanceValue: Dnum;
  accruedInterest: bigint;
  accruedInterestValue: Dnum;
  interestRate: Dnum;
  interestYield: Dnum;
};

export type UserLoanInfo = {
  loanId: LoanId;
  loanTypeId: LoanType;
  accountId: AccountId;
  collaterals: Partial<Record<FolksTokenId, UserLoanInfoCollateral>>;
  borrows: Partial<Record<FolksTokenId, UserLoanInfoBorrow>>;
  netRate: Dnum;
  netYield: Dnum;
  totalCollateralBalanceValue: Dnum;
  totalBorrowedAmountValue: Dnum;
  totalBorrowBalanceValue: Dnum;
  totalEffectiveCollateralBalanceValue: Dnum;
  totalEffectiveBorrowBalanceValue: Dnum;
  loanToValueRatio: Dnum;
  borrowUtilisationRatio: Dnum;
  liquidationMargin: Dnum;
};

export type CreateUserLoanEventParams = GetEventParams & {
  loanManager: GetReadContractReturnType<typeof LoanManagerAbi>;
  accountId: AccountId;
  loanTypeId?: LoanType;
};

export type DeleteUserLoanEventParams = GetEventParams & {
  loanManager: GetReadContractReturnType<typeof LoanManagerAbi>;
  accountId: AccountId;
};
