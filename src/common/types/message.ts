import type { GenericAddress } from "./address.js";
import type { FolksChainId } from "./chain.js";
import type { AccountId, LoanId, LoanName } from "./lending.js";
import type { LoanTypeId } from "./module.js";
import type { FolksTokenId, FolksSpokeTokenType } from "./token.js";
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
  CreateLoanAndDeposit,
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

export type SendTokenAction = Extract<Action, Action.Deposit | Action.Repay>;
export type ReceiveTokenAction = Extract<Action, Action.Withdraw | Action.Borrow>;
export type HubAction = Extract<
  Action,
  Action.DepositFToken | Action.WithdrawFToken | Action.Liquidate | Action.SendToken
>;
export type DataAction = Extract<
  Action,
  | Action.CreateAccount
  | Action.InviteAddress
  | Action.AcceptInviteAddress
  | Action.UnregisterAddress
  | Action.AddDelegate
  | Action.RemoveDelegate
  | Action.CreateLoan
  | Action.DeleteLoan
  | Action.RepayWithCollateral
  | Action.SwitchBorrowType
>;

export type Finality = (typeof FINALITY)[keyof typeof FINALITY];

export type MessageAdapters = {
  adapterId: AdapterType;
  returnAdapterId: AdapterType;
};

export type SupportedMessageAdapters = {
  adapterId: Array<AdapterType>;
  returnAdapterId: Array<AdapterType>;
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
  loanTypeId: LoanTypeId;
  loanName: LoanName;
};

export type DeleteLoanMessageData = {
  accountId: AccountId;
  loanId: LoanId;
};

export type CreateLoanAndDepositMessageData = {
  loanId: LoanId;
  poolId: number;
  amount: bigint;
  loanTypeId: LoanTypeId;
  loanName: LoanName;
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

export type BorrowMessageData = {
  loanId: LoanId;
  poolId: number;
  receiverFolksChainId: FolksChainId;
  amount: bigint;
  maxStableRate: bigint;
};

export type RepayMessageData = {
  loanId: LoanId;
  poolId: number;
  amount: bigint;
  maxOverRepayment: bigint;
};

export type RepayWithCollateralMessageData = {
  loanId: LoanId;
  poolId: number;
  amount: bigint;
};

export type SwitchBorrowTypeMessageData = {
  loanId: LoanId;
  poolId: number;
  maxStableRate: bigint;
};

export type LiquidateMessageData = {
  violatorLoanId: LoanId;
  liquidatorLoanId: LoanId;
  colPoolId: number;
  borPoolId: number;
  repayingAmount: bigint;
  minSeizedAmount: bigint;
};

export type SendTokenMessageData = {
  folksTokenId: FolksTokenId;
  amount: bigint;
};

// Extra args
export type DefaultExtraArgs = "0x";

// Extra args: loan
export type DepositExtraArgs = {
  token: FolksSpokeTokenType;
  recipient: GenericAddress;
  amount: bigint;
};

export type RepayExtraArgs = {
  token: FolksSpokeTokenType;
  recipient: GenericAddress;
  amount: bigint;
};

export type SendTokenExtraArgs = {
  token: FolksSpokeTokenType;
  recipient: GenericAddress;
  amount: bigint;
};

// Params
export type DefaultMessageDataParams = {
  action:
    | Action.AcceptInviteAddress
    | Action.AddDelegate
    | Action.RemoveDelegate
    | Action.DepositFToken
    | Action.WithdrawFToken;
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

export type CreateLoanAndDepositMessageDataParams = {
  action: Action.CreateLoanAndDeposit;
  data: CreateLoanAndDepositMessageData;
  extraArgs: DepositExtraArgs;
};

export type DepositMessageDataParams = {
  action: Action.Deposit;
  data: DepositMessageData;
  extraArgs: DepositExtraArgs;
};

export type WithdrawMessageDataParams = {
  action: Action.Withdraw;
  data: WithdrawMessageData;
  extraArgs: DefaultExtraArgs;
};

export type BorrowMessageDataParams = {
  action: Action.Borrow;
  data: BorrowMessageData;
  extraArgs: DefaultExtraArgs;
};

export type RepayMessageDataParams = {
  action: Action.Repay;
  data: RepayMessageData;
  extraArgs: RepayExtraArgs;
};

export type RepayWithCollateralMessageDataParams = {
  action: Action.RepayWithCollateral;
  data: RepayWithCollateralMessageData;
  extraArgs: DefaultExtraArgs;
};

export type SwitchBorrowTypeMessageDataParams = {
  action: Action.SwitchBorrowType;
  data: SwitchBorrowTypeMessageData;
  extraArgs: DefaultExtraArgs;
};

export type LiquidateMessageDataParams = {
  action: Action.Liquidate;
  data: LiquidateMessageData;
  extraArgs: DefaultExtraArgs;
};

export type SendTokenMessageDataParams = {
  action: Action.SendToken;
  data: SendTokenMessageData;
  extraArgs: SendTokenExtraArgs;
};

export type MessageDataParams =
  | DefaultMessageDataParams
  | CreateAccountMessageDataParams
  | InviteAddressMessageDataParams
  | UnregisterAddressMessageDataParams
  | CreateLoanMessageDataParams
  | DeleteLoanMessageDataParams
  | CreateLoanAndDepositMessageDataParams
  | DepositMessageDataParams
  | WithdrawMessageDataParams
  | BorrowMessageDataParams
  | RepayMessageDataParams
  | RepayWithCollateralMessageDataParams
  | SwitchBorrowTypeMessageDataParams
  | LiquidateMessageDataParams
  | SendTokenMessageDataParams;

export type MessageBuilderParams = {
  userAddress: GenericAddress;
  accountId: AccountId;
  adapters: MessageAdapters;
  sender: GenericAddress;
  destinationChainId: FolksChainId;
  handler: GenericAddress;
} & MessageDataParams;
