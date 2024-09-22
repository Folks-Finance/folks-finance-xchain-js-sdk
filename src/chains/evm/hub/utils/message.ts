import { RECEIVE_TOKEN_ACTIONS } from "../../../../common/constants/message.js";
import { ChainType } from "../../../../common/types/chain.js";
import { MessageDirection } from "../../../../common/types/gmp.js";
import { Action } from "../../../../common/types/message.js";
import { getSpokeChain, getSpokeTokenData } from "../../../../common/utils/chain.js";
import {
  buildMessageToSend,
  decodeMessagePayloadData,
  estimateAdapterReceiveGasLimit,
} from "../../../../common/utils/messages.js";
import { getFolksTokenIdFromPool } from "../../../../common/utils/token.js";
import { FolksCore } from "../../../../xchain/core/folks-core.js";

import { getBridgeRouterHubContract } from "./contract.js";

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
  RetryMessageExtraArgs,
  RetryMessageExtraArgsParams,
  ReverseMessageExtraArgs,
  ReverseMessageExtraArgsParams,
} from "../../common/types/gmp.js";
import type { HubChain } from "../types/chain.js";
import type { Client as EVMProvider } from "viem";

export async function getHubRetryMessageExtraArgsAndAdapterFees(
  provider: EVMProvider,
  hubChain: HubChain,
  network: NetworkType,
  userAddress: GenericAddress,
  message: MessageReceived,
  extraArgsParams: RetryMessageExtraArgsParams,
  payload: Payload,
): Promise<{
  adapterFees: bigint;
  extraArgs: RetryMessageExtraArgs;
}> {
  const returnAdapterId = extraArgsParams?.returnAdapterId ?? message.returnAdapterId;
  const { accountId, action, data } = payload;

  // @ts-expect-error: ts(2345)
  if (!RECEIVE_TOKEN_ACTIONS.includes(action))
    return { adapterFees: 0n, extraArgs: { returnAdapterId, returnGasLimit: 0n } };
  const payloadData = decodeMessagePayloadData(action as ReceiveTokenAction, data);

  const folksTokenId = getFolksTokenIdFromPool(payloadData.poolId);

  const spokeChain = getSpokeChain(payloadData.receiverFolksChainId, network);
  const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
  const hubSpokeChain = getSpokeChain(hubChain.folksChainId, network);
  const hubSpokeTokenData = getSpokeTokenData(hubSpokeChain, folksTokenId);

  const returnData: SendTokenMessageData = {
    amount: payloadData.amount,
  };
  const returnExtraArgs: SendTokenExtraArgs = {
    folksTokenId,
    token: hubSpokeTokenData.token,
    recipient: spokeTokenData.spokeAddress,
    amount: payloadData.amount,
  };
  const returnMessageBuilderParams: MessageBuilderParams = {
    userAddress,
    accountId,
    adapters: {
      adapterId: returnAdapterId,
      returnAdapterId,
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

  const bridgeRouter = getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);
  const messageToSend = buildMessageToSend(ChainType.EVM, returnMessageBuilderParams);
  const adapterFees = await bridgeRouter.read.getSendFee([messageToSend]);

  return {
    adapterFees,
    extraArgs: { returnAdapterId, returnGasLimit },
  };
}

export async function getHubReverseMessageExtraArgsAndAdapterFees(
  provider: EVMProvider,
  hubChain: HubChain,
  network: NetworkType,
  userAddress: GenericAddress,
  message: MessageReceived,
  extraArgsParams: ReverseMessageExtraArgsParams,
  payload: Payload,
): Promise<{
  adapterFees: bigint;
  extraArgs: ReverseMessageExtraArgs;
}> {
  const { action, data } = payload;
  const payloadData = decodeMessagePayloadData(action as ReversibleHubAction, data);
  const folksTokenId = getFolksTokenIdFromPool(payloadData.poolId);

  const returnAdapterId = extraArgsParams?.returnAdapterId ?? message.returnAdapterId;
  const accountId = extraArgsParams?.accountId ?? payload.accountId;

  const spokeChain = getSpokeChain(message.sourceChainId, network);
  const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
  const hubSpokeChain = getSpokeChain(hubChain.folksChainId, network);
  const hubSpokeTokenData = getSpokeTokenData(hubSpokeChain, folksTokenId);

  const returnData: SendTokenMessageData = {
    amount: payloadData.amount,
  };
  const returnExtraArgs: SendTokenExtraArgs = {
    folksTokenId,
    token: hubSpokeTokenData.token,
    recipient: spokeTokenData.spokeAddress,
    amount: payloadData.amount,
  };
  const returnMessageBuilderParams: MessageBuilderParams = {
    userAddress,
    accountId,
    adapters: {
      adapterId: returnAdapterId,
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

  const bridgeRouter = getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);
  const messageToSend = buildMessageToSend(ChainType.EVM, returnMessageBuilderParams, {
    gasLimit: returnGasLimit,
    receiverValue: 0n,
    returnGasLimit: 0n,
  });
  const adapterFees = await bridgeRouter.read.getSendFee([messageToSend]);

  return {
    adapterFees,
    extraArgs: {
      accountId,
      returnAdapterId,
      returnGasLimit,
    },
  };
}
