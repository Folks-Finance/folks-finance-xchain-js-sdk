import type { MessageReceived } from "./gmp.js";
import type { EvmAddress, GenericAddress } from "../../../../common/types/address.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type { MessageParams } from "../../../../common/types/message.js";
import type { SpokeTokenData } from "../../../../common/types/token.js";
import type { PoolEpoch } from "../../hub/types/rewards.js";
import type { Hex } from "viem";

export type PrepareCall = {
  msgValue: bigint;
  gasLimit: bigint;
  messageParams: MessageParams;
};

export type PrepareCreateAccountCall = {
  accountId: AccountId;
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

export type PrepareCreateLoanAndDepositCall = {
  spokeTokenData: SpokeTokenData;
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
  isHub: boolean;
  message: MessageReceived;
  extraArgs: Hex;
  bridgeRouterAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams">;

export type PrepareReverseMessageCall = {
  isHub: boolean;
  message: MessageReceived;
  extraArgs: Hex;
  bridgeRouterAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams">;

export type PrepareResendWormholeMessageCall = {
  vaaKey: {
    chainId: number;
    emitterAddress: GenericAddress;
    sequence: bigint;
  };
  targetWormholeChainId: number;
  receiverValue: bigint;
  receiverGasLimit: bigint;
  deliveryProviderAddress: GenericAddress;
  wormholeRelayerAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams">;

export type PrepareUpdateUserLoanPoolPoints = {
  loanManagerAddress: GenericAddress;
} & Omit<PrepareCall, "messageParams" | "msgValue">;

export type PrepareUpdateAccountsPointsForRewardsCall = {
  poolEpochs: Array<PoolEpoch>;
  rewardsV1Address: GenericAddress;
} & Omit<PrepareCall, "messageParams" | "msgValue">;

export type PrepareClaimRewardsCall = {
  poolEpochs: Array<PoolEpoch>;
  receiver: EvmAddress;
  rewardsV1Address: GenericAddress;
} & Omit<PrepareCall, "messageParams" | "msgValue">;
