import type { EvmAddress, GenericAddress } from "../../../../common/types/address.js";
import type { FolksChainId } from "../../../../common/types/chain.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { Hex } from "viem";

type CCIPTokenAmount = {
  token: EvmAddress;
  amount: bigint;
};

export type CCIPAny2EvmMessage = {
  messageId: Hex;
  sourceChainSelector: bigint;
  sender: GenericAddress;
  data: Hex;
  destTokenAmounts: Array<CCIPTokenAmount>;
};

export type RetryMessageExtraArgs = {
  returnAdapterId: AdapterType;
  returnGasLimit: bigint;
};

export type RetryMessageExtraArgsParams = Partial<Omit<RetryMessageExtraArgs, "returnGasLimit">> | undefined;

export type ReverseMessageExtraArgs = {
  accountId: AccountId;
  returnAdapterId: AdapterType;
  returnGasLimit: bigint;
};

export type ReverseMessageExtraArgsParams = Partial<Omit<ReverseMessageExtraArgs, "returnGasLimit">> | undefined;

export type MessageReceived = {
  messageId: Hex;
  sourceChainId: FolksChainId;
  sourceAddress: GenericAddress;
  handler: GenericAddress;
  payload: Hex;
  returnAdapterId: AdapterType;
  returnGasLimit: bigint;
};

export type MsgValueEstimationArgs = {
  folksChainId: FolksChainId;
  accountId: AccountId;
  poolId: number;
  returnAdapterId: AdapterType;
  returnGasLimit: bigint;
};
