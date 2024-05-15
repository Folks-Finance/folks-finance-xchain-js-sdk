import type { Address } from "viem";
import type { ListedToken, MessageAdapters, SpokeTokenData } from "../common/index.js";

export interface PrepareCall {
  adapters: MessageAdapters;
  adapterFee: bigint;
  returnAdapterFee: bigint;
  gasLimit: bigint;
  receiveGasLimit: bigint;
  returnReceiveGasLimit: bigint;
}

export interface PrepareCreateAccountCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareInviteAddressCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareAcceptInviteAddressCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareUnregisterAddressCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareAddDelegateCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareRemoveDelegateCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareCreateLoanCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareDeleteLoanCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareDepositCall extends PrepareCall {
  token: SpokeTokenData;
}

export interface PrepareWithdrawCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareBorrowCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareRepayCall extends PrepareCall {
  token: ListedToken;
}

export interface PrepareRepayWithCollateralCall extends PrepareCall {
  spokeCommonAddress: Address;
}

export interface PrepareSwitchBorrowTypeCall extends PrepareCall {
  spokeCommonAddress: Address;
}
