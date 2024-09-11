import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Dnum } from "dnum";

type FeeData = {
  flashLoanFee: Dnum;
  retentionRate: Dnum;
  totalRetainedAmount: bigint;
};

type DepositData = {
  optimalUtilisationRatio: Dnum;
  totalAmount: bigint;
  interestRate: Dnum;
  interestYield: Dnum;
  interestIndex: Dnum;
};

type VariableBorrowData = {
  vr0: Dnum;
  vr1: Dnum;
  vr2: Dnum;
  totalAmount: bigint;
  interestRate: Dnum;
  interestYield: Dnum;
  interestIndex: Dnum;
};

type StableBorrowData = {
  sr0: Dnum;
  sr1: Dnum;
  sr2: Dnum;
  sr3: Dnum;
  optimalStableToTotalDebtRatio: Dnum;
  rebalanceUpUtilisationRatio: Dnum;
  rebalanceUpDepositInterestRate: Dnum;
  rebalanceDownDelta: Dnum;
  totalAmount: bigint;
  interestRate: Dnum;
  interestYield: Dnum;
  averageInterestRate: Dnum;
  averageInterestYield: Dnum;
};

type CapsData = {
  deposit: bigint; // $ amount
  borrow: bigint; // $ amount
  stableBorrowPercentage: Dnum;
};

type ConfigData = {
  deprecated: boolean;
  stableBorrowSupported: boolean;
  canMintFToken: boolean;
  flashLoanSupported: boolean;
};

export type PoolInfo = {
  folksTokenId: FolksTokenId;
  poolId: number;
  tokenDecimals: number;
  feeData: FeeData;
  depositData: DepositData;
  variableBorrowData: VariableBorrowData;
  stableBorrowData: StableBorrowData;
  capsData: CapsData;
  configData: ConfigData;
};
