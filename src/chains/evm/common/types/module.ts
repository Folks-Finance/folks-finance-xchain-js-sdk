import type {
  ListedToken,
  MessageAdapters,
  SpokeTokenData,
} from "../../../../common/types/index.js";
import type { Address } from "viem";

export type PrepareCall = {
  adapters: MessageAdapters;
  adapterFee: bigint;
  returnAdapterFee: bigint;
  gasLimit: bigint;
  receiveGasLimit: bigint;
  returnReceiveGasLimit: bigint;
};

export type PrepareCreateAccountCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareInviteAddressCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareAcceptInviteAddressCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareUnregisterAddressCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareAddDelegateCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareRemoveDelegateCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareCreateLoanCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareDeleteLoanCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareDepositCall = {
  token: SpokeTokenData;
} & PrepareCall;

export type PrepareWithdrawCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareBorrowCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareRepayCall = {
  token: ListedToken;
} & PrepareCall;

export type PrepareRepayWithCollateralCall = {
  spokeCommonAddress: Address;
} & PrepareCall;

export type PrepareSwitchBorrowTypeCall = {
  spokeCommonAddress: Address;
} & PrepareCall;
