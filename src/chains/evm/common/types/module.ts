import type { GenericAddress } from "../../../../common/types/address.js";
import type { MessageParams } from "../../../../common/types/message.js";
import type { SpokeTokenData } from "../../../../common/types/token.js";
import type { Hex } from "viem";

export type PrepareCall = {
  msgValue: bigint;
  gasLimit: bigint;
  messageParams: MessageParams;
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
  spokeTokenData: SpokeTokenData;
} & PrepareCall;

export type PrepareWithdrawCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareBorrowCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareRepayCall = {
  spokeTokenData: SpokeTokenData;
} & PrepareCall;

export type PrepareRepayWithCollateralCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareSwitchBorrowTypeCall = {
  spokeCommonAddress: GenericAddress;
} & PrepareCall;

export type PrepareLiquidateCall = {
  messageData: Hex;
  hubAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams" | "msgValue">;

export type PrepareRetryMessageCall = {
  bridgeRouterAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams" | "msgValue">;

export type PrepareReverseMessageCall = {
  bridgeRouterAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams" | "msgValue">;
