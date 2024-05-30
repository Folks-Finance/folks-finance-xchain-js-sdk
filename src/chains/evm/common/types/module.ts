import type { GenericAddress } from "../../../../common/types/address.js";
import type { MessageAdapters } from "../../../../common/types/message.js";
import type { SpokeTokenData } from "../../../../common/types/token.js";

export type PrepareCall = {
  adapters: MessageAdapters;
  adapterFee: bigint;
  returnAdapterFee: bigint;
  gasLimit: bigint;
  receiveGasLimit: bigint;
  returnReceiveGasLimit: bigint;
};

export type PrepareCreateAccountCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareInviteAddressCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareAcceptInviteAddressCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareUnregisterAddressCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareAddDelegateCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareRemoveDelegateCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareCreateLoanCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareDeleteLoanCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareDepositCall = {
  token: SpokeTokenData;
} & PrepareCall;

export type PrepareWithdrawCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareBorrowCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareRepayCall = {
  token: SpokeTokenData;
} & PrepareCall;

export type PrepareRepayWithCollateralCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareSwitchBorrowTypeCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;
