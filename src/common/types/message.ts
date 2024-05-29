import type { FolksChainId, GenericAddress } from "./chain.js";
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

export type MessageParams = {
  receiverValue: bigint;
  gasLimit: bigint;
  returnGasLimit: bigint;
} & MessageAdapters;

export type OptionalMessageParams = Partial<MessageParams>;

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
export type InviteAddressMessageData = {
  folksChainIdToInvite: FolksChainId;
  addressToInvite: GenericAddress;
};

export type UnregisterAddressMessageData = {
  folksChainIdToUnregister: FolksChainId;
};

// Data: loan
export type CreateLoanMessageData = {
  loanId: Hex;
  loanTypeId: LoanType;
};

export type DeleteLoanMessageData = {
  accountId: Hex;
  loanId: Hex;
};

export type DepositMessageData = {
  loanId: Hex;
  poolId: number;
  amount: bigint;
};

export type WithdrawMessageData = {
  loanId: Hex;
  poolId: number;
  receiverFolksChainId: FolksChainId;
  amount: bigint;
  isFAmount: boolean;
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
    | Action.CreateAccount
    | Action.AcceptInviteAddress
    | Action.AddDelegate
    | Action.RemoveDelegate
    | Action.DepositFToken
    | Action.WithdrawFToken
    | Action.Borrow
    | Action.Repay
    | Action.RepayWithCollateral
    | Action.Liquidate
    | Action.SwitchBorrowType
    | Action.SendToken;
  data: DefaultMessageData;
  extraArgs: DefaultExtraArgs;
};

// Params: account
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

export type MessageDataParams =
  | DefaultMessageDataParams
  | InviteAddressMessageDataParams
  | UnregisterAddressMessageDataParams
  | CreateLoanMessageDataParams
  | DeleteLoanMessageDataParams
  | DepositMessageDataParams
  | WithdrawMessageDataParams;

export type MessageBuilderParams = {
  userAddress: GenericAddress;
  accountId: Hex;
  adapters: MessageAdapters;
  sender: GenericAddress;
  destinationChainId: FolksChainId;
  handler: GenericAddress;
} & MessageDataParams;
