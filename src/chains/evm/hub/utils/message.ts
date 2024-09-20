import { RECEIVE_TOKEN_ACTIONS } from "../../../../common/constants/message.js";
import { MessageDirection } from "../../../../common/types/gmp.js";
import { Action, AdapterType } from "../../../../common/types/message.js";
import { getSpokeChain, getSpokeTokenData } from "../../../../common/utils/chain.js";
import { decodeMessagePayloadData, estimateAdapterReceiveGasLimit } from "../../../../common/utils/messages.js";
import { getFolksTokenIdFromPool } from "../../../../common/utils/token.js";
import { FolksCore } from "../../../../xchain/core/folks-core.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { NetworkType } from "../../../../common/types/chain.js";
import type {
  MessageBuilderParams,
  Payload,
  ReceiveTokenAction,
  ReversibleHubAction,
  SendTokenExtraArgs,
  SendTokenMessageData,
} from "../../../../common/types/message.js";
import type {
  MessageReceived,
  MsgValueEstimationArgs,
  RetryMessageExtraArgs,
  RetryMessageExtraArgsParams,
  ReverseMessageExtraArgs,
  ReverseMessageExtraArgsParams,
} from "../../common/types/gmp.js";
import type { HubChain } from "../types/chain.js";

export async function getHubRetryMessageExtraArgsAndValue(
  hubChain: HubChain,
  network: NetworkType,
  userAddress: GenericAddress,
  message: MessageReceived,
  extraArgsParams: RetryMessageExtraArgsParams,
  payload: Payload,
): Promise<{
  msgValueEstimationArgs: MsgValueEstimationArgs;
  extraArgs: RetryMessageExtraArgs;
}> {
  const returnAdapterId = extraArgsParams?.returnAdapterId ?? message.returnAdapterId;
  const { accountId, action, data } = payload;

  // @ts-expect-error: ts(2345)
  if (!RECEIVE_TOKEN_ACTIONS.includes(action)) return { value: 0n, extraArgs: { returnAdapterId, returnGasLimit: 0n } };
  const payloadData = decodeMessagePayloadData(action as ReceiveTokenAction, data);

  const folksTokenId = getFolksTokenIdFromPool(payloadData.poolId);

  const spokeChain = getSpokeChain(payloadData.receiverFolksChainId, network);
  const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

  const returnData: SendTokenMessageData = {
    amount: payloadData.amount,
  };
  const returnExtraArgs: SendTokenExtraArgs = {
    folksTokenId,
    token: spokeTokenData.token,
    recipient: spokeTokenData.spokeAddress,
    amount: payloadData.amount,
  };
  const returnMessageBuilderParams: MessageBuilderParams = {
    userAddress,
    accountId,
    adapters: {
      adapterId: AdapterType.HUB,
      returnAdapterId: extraArgsParams?.returnAdapterId ?? message.returnAdapterId,
    },
    action: Action.SendToken,
    sender: hubChain.hubAddress,
    destinationChainId: payloadData.receiverFolksChainId,
    handler: spokeTokenData.spokeAddress,
    data: returnData,
    extraArgs: returnExtraArgs,
  };
  const returnGasLimit = await estimateAdapterReceiveGasLimit(
    hubChain.folksChainId,
    payloadData.receiverFolksChainId,
    FolksCore.getEVMProvider(payloadData.receiverFolksChainId),
    network,
    MessageDirection.HubToSpoke,
    returnMessageBuilderParams,
  );

  return {
    msgValueEstimationArgs: {
      folksChainId: payloadData.receiverFolksChainId,
      accountId,
      poolId: payloadData.poolId,
      returnAdapterId,
      returnGasLimit,
    },
    extraArgs: { returnAdapterId, returnGasLimit },
  };
}

export async function getHubReverseMessageExtraArgsAndValue(
  hubChain: HubChain,
  network: NetworkType,
  userAddress: GenericAddress,
  message: MessageReceived,
  extraArgsParams: ReverseMessageExtraArgsParams,
  payload: Payload,
): Promise<{
  msgValueEstimationArgs: MsgValueEstimationArgs;
  extraArgs: ReverseMessageExtraArgs;
}> {
  const { action, data } = payload;
  const payloadData = decodeMessagePayloadData(action as ReversibleHubAction, data);

  const returnAdapterId = extraArgsParams?.returnAdapterId ?? message.returnAdapterId;
  const accountId = extraArgsParams?.accountId ?? payload.accountId;

  const folksTokenId = getFolksTokenIdFromPool(payloadData.poolId);

  const spokeChain = getSpokeChain(message.sourceChainId, network);
  const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

  const returnData: SendTokenMessageData = {
    amount: payloadData.amount,
  };
  const returnExtraArgs: SendTokenExtraArgs = {
    folksTokenId,
    token: spokeTokenData.token,
    recipient: spokeTokenData.spokeAddress,
    amount: payloadData.amount,
  };
  const returnMessageBuilderParams: MessageBuilderParams = {
    userAddress,
    accountId,
    adapters: {
      adapterId: AdapterType.HUB,
      returnAdapterId,
    },
    action: Action.SendToken,
    sender: hubChain.hubAddress,
    destinationChainId: message.sourceChainId,
    handler: spokeTokenData.spokeAddress,
    data: returnData,
    extraArgs: returnExtraArgs,
  };
  const returnGasLimit = await estimateAdapterReceiveGasLimit(
    hubChain.folksChainId,
    message.sourceChainId,
    FolksCore.getEVMProvider(message.sourceChainId),
    network,
    MessageDirection.HubToSpoke,
    returnMessageBuilderParams,
  );

  return {
    msgValueEstimationArgs: {
      folksChainId: message.sourceChainId,
      accountId,
      poolId: payloadData.poolId,
      returnAdapterId,
      returnGasLimit,
    },
    extraArgs: {
      accountId,
      returnAdapterId,
      returnGasLimit,
    },
  };
}
