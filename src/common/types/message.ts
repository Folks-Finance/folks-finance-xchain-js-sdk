import type { GenericAddress } from "./address.js";
import type { FolksChainId } from "./chain.js";
import type { AccountId, LoanId } from "./lending.js";
import type { LoanType } from "./module.js";
import type { TokenType } from "./token.js";
import type { FINALITY } from "../constants/message.js";
import type { Hex } from "viem";

export enum AdapterType {
  HUB = 1,
  WORMHOLE_DATA = 2,
  WORMHOLE_CCTP = 3,
  CCIP_DATA = 4,
  CCIP_TOKEN = 5,
}

export enum Action {
  // SPOKE -> HUB
  CreateAccount,
  InviteAddress,
  AcceptInviteAddress,
  UnregisterAddress,
  AddDelegate,
  RemoveDelegate,
  CreateLoan,
  DeleteLoan,
  Deposit,
  DepositFToken,
  Withdraw,
  WithdrawFToken,
  Borrow,
  Repay,
  RepayWithCollateral,
  Liquidate,
  SwitchBorrowType,
  // HUB -> SPOKE
  SendToken,
}

export type Finality = (typeof FINALITY)[keyof typeof FINALITY];

export type MessageAdapters = {
  adapterId: AdapterType;
  returnAdapterId: AdapterType;
};

export type FeeParams = {
  receiverValue: bigint;
  gasLimit: bigint;
  returnGasLimit: bigint;
};

export type MessageParams = FeeParams & MessageAdapters;

export type OptionalFeeParams = Partial<FeeParams>;

export type MessageToSend = {
  params: MessageParams;
  sender: GenericAddress;
  destinationChainId: number;
  handler: GenericAddress;
  payload: Hex;
  finalityLevel: Finality;
  extraArgs: Hex;
};

// Data
export type DefaultMessageData = "0x";

// Data: account
export type CreateAccountMessageData = {
  refAccountId: AccountId;
};

export type InviteAddressMessageData = {
  folksChainIdToInvite: FolksChainId;
  addressToInvite: GenericAddress;
  refAccountId: AccountId;
};

export type UnregisterAddressMessageData = {
  folksChainIdToUnregister: FolksChainId;
};

// Data: loan
export type CreateLoanMessageData = {
  loanId: LoanId;
  loanTypeId: LoanType;
};

export type DeleteLoanMessageData = {
  accountId: AccountId;
  loanId: LoanId;
};

export type DepositMessageData = {
  loanId: LoanId;
  poolId: number;
  amount: bigint;
};

export type WithdrawMessageData = {
  loanId: LoanId;
  poolId: number;
  receiverFolksChainId: FolksChainId;
  amount: bigint;
  isFAmount: boolean;
};

export type RepayWithCollateralMessageData = {
  loanId: LoanId;
  poolId: number;
  amount: bigint;
};

// Extra args
export type DefaultExtraArgs = "0x";

// Extra args: loan
export type DepositExtraArgs = {
  tokenType: TokenType;
  spokeTokenAddress: GenericAddress;
  hubPoolAddress: GenericAddress;
  amount: bigint;
};

// Params
export type DefaultMessageDataParams = {
  action:
    | Action.AcceptInviteAddress
    | Action.AddDelegate
    | Action.RemoveDelegate
    | Action.DepositFToken
    | Action.WithdrawFToken
    | Action.Borrow
    | Action.Repay
    | Action.Liquidate
    | Action.SwitchBorrowType
    | Action.SendToken;
  data: DefaultMessageData;
  extraArgs: DefaultExtraArgs;
};

// Params: account
export type CreateAccountMessageDataParams = {
  action: Action.CreateAccount;
  data: CreateAccountMessageData;
  extraArgs: DefaultExtraArgs;
};

export type InviteAddressMessageDataParams = {
  action: Action.InviteAddress;
  data: InviteAddressMessageData;
  extraArgs: DefaultExtraArgs;
};

export type UnregisterAddressMessageDataParams = {
  action: Action.UnregisterAddress;
  data: UnregisterAddressMessageData;
  extraArgs: DefaultExtraArgs;
};

// Params: loan
export type CreateLoanMessageDataParams = {
  action: Action.CreateLoan;
  data: CreateLoanMessageData;
  extraArgs: DefaultExtraArgs;
};

export type DeleteLoanMessageDataParams = {
  action: Action.DeleteLoan;
  data: DeleteLoanMessageData;
  extraArgs: DefaultExtraArgs;
};

export type WithdrawMessageDataParams = {
  action: Action.Withdraw;
  data: WithdrawMessageData;
  extraArgs: DefaultExtraArgs;
};

export type DepositMessageDataParams = {
  action: Action.Deposit;
  data: DepositMessageData;
  extraArgs: DepositExtraArgs;
};

export type RepayWithCollateralMessageDataParams = {
  action: Action.RepayWithCollateral;
  data: RepayWithCollateralMessageData;
  extraArgs: DefaultExtraArgs;
};

export type MessageDataParams =
  | DefaultMessageDataParams
  | CreateAccountMessageDataParams
  | InviteAddressMessageDataParams
  | UnregisterAddressMessageDataParams
  | CreateLoanMessageDataParams
  | DeleteLoanMessageDataParams
  | DepositMessageDataParams
  | WithdrawMessageDataParams
  | RepayWithCollateralMessageDataParams;

export type MessageBuilderParams = {
  userAddress: GenericAddress;
  accountId: AccountId;
  adapters: MessageAdapters;
  sender: GenericAddress;
  destinationChainId: FolksChainId;
  handler: GenericAddress;
} & MessageDataParams;
