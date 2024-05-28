import type { FolksChainId, GenericAddress } from "./chain.js";
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

export type MessageToSend = {
  params: MessageParams;
  sender: GenericAddress;
  destinationChainId: number;
  handler: GenericAddress;
  payload: Hex;
  finalityLevel: Finality;
  extraArgs: Hex;
};

export type DefaultMessageData = "0x";

export type InviteAddressMessageData = {
  folksChainIdToInvite: FolksChainId;
  addressToInvite: GenericAddress;
};

export type UnregisterAddressMessageData = {
  folksChainIdToUnregister: FolksChainId;
};

export type MessageData =
  | DefaultMessageData
  | InviteAddressMessageData
  | UnregisterAddressMessageData;
