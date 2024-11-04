import { getHubTokenData, isHubChain } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../../xchain/core/folks-core.js";
import { DATA_ADAPTERS, HUB_ADAPTERS } from "../constants/adapter.js";
import { MessageAdapterParamsType } from "../types/adapter.js";
import { AdapterType } from "../types/message.js";
import { TokenType } from "../types/token.js";

import type { MessageAdapterParams, ReceiveTokenMessageAdapterParams } from "../types/adapter.js";
import type { FolksChainId, NetworkType } from "../types/chain.js";
import type { CrossChainTokenType, FolksTokenId } from "../types/token.js";

export function doesAdapterSupportDataMessage(folksChainId: FolksChainId, adapterId: AdapterType): boolean {
  const isHub = isHubChain(folksChainId, FolksCore.getSelectedNetwork());
  return (
    (isHub && adapterId === AdapterType.HUB) ||
    (!isHub && (adapterId === AdapterType.WORMHOLE_DATA || adapterId === AdapterType.CCIP_DATA))
  );
}

export function assertAdapterSupportsDataMessage(folksChainId: FolksChainId, adapterId: AdapterType): void {
  if (!doesAdapterSupportDataMessage(folksChainId, adapterId))
    throw Error(`Adapter ${adapterId} does not support data message for folksChainId: ${folksChainId}`);
}

export function doesAdapterSupportTokenMessage(folksChainId: FolksChainId, adapterId: AdapterType): boolean {
  const isHub = isHubChain(folksChainId, FolksCore.getSelectedNetwork());
  return (
    (isHub && adapterId === AdapterType.HUB) ||
    (!isHub && (adapterId === AdapterType.WORMHOLE_CCTP || adapterId === AdapterType.CCIP_TOKEN))
  );
}

export function assertAdapterSupportsTokenMessage(folksChainId: FolksChainId, adapterId: AdapterType): void {
  if (!doesAdapterSupportTokenMessage(folksChainId, adapterId))
    throw Error(`Adapter ${adapterId} does not support token message for folksChainId: ${folksChainId}`);
}

export function doesAdapterSupportCrossChainToken(
  crossChainToken: CrossChainTokenType,
  adapterId: AdapterType,
): boolean {
  return crossChainToken.adapters.includes(adapterId);
}

export function assertCrossChainTokenSupportedByAdapter(
  crossChainToken: CrossChainTokenType,
  adapterId: AdapterType,
): void {
  if (!doesAdapterSupportCrossChainToken(crossChainToken, adapterId))
    throw Error(`Adapter ${adapterId} does not support cross chain token: ${crossChainToken.address}`);
}

export function assertAdapterSupportsCrossChainToken(
  folksChainId: FolksChainId,
  crossChainToken: CrossChainTokenType,
  adapterId: AdapterType,
): void {
  assertAdapterSupportsTokenMessage(folksChainId, adapterId);
  assertCrossChainTokenSupportedByAdapter(crossChainToken, adapterId);
}

export function doesAdapterSupportReceiverValue(folksChainId: FolksChainId, adapterId: AdapterType): boolean {
  const isHub = isHubChain(folksChainId, FolksCore.getSelectedNetwork());
  return (
    (isHub && adapterId === AdapterType.HUB) ||
    (!isHub && (adapterId === AdapterType.WORMHOLE_DATA || adapterId === AdapterType.WORMHOLE_CCTP))
  );
}

export function assertAdapterSupportsReceiverValue(folksChainId: FolksChainId, adapterId: AdapterType): void {
  if (!doesAdapterSupportReceiverValue(folksChainId, adapterId))
    throw Error(`Adapter ${adapterId} does not support receiver value for folksChainId: ${folksChainId}`);
}

function getSendTokenAdapterIds(folksTokenId: FolksTokenId, network: NetworkType) {
  const hubTokenData = getHubTokenData(folksTokenId, network);
  if (hubTokenData.token.type == TokenType.CROSS_CHAIN) return hubTokenData.token.adapters;
  return DATA_ADAPTERS;
}

function getAdapterIds(messageAdapterParams: MessageAdapterParams) {
  const { sourceFolksChainId, network, messageAdapterParamType } = messageAdapterParams;
  if (isHubChain(sourceFolksChainId, network)) return HUB_ADAPTERS;
  if (messageAdapterParamType == MessageAdapterParamsType.SendToken)
    return getSendTokenAdapterIds(messageAdapterParams.folksTokenId, network);
  return DATA_ADAPTERS;
}

function getReturnAdapterIds({ folksTokenId, destFolksChainId, network }: ReceiveTokenMessageAdapterParams) {
  if (isHubChain(destFolksChainId, network)) return HUB_ADAPTERS;
  return getSendTokenAdapterIds(folksTokenId, network);
}

export function getSupportedMessageAdapters(params: MessageAdapterParams) {
  const { messageAdapterParamType } = params;

  switch (messageAdapterParamType) {
    case MessageAdapterParamsType.SendToken:
      return {
        adapterIds: getAdapterIds(params),
        returnAdapterIds: getAdapterIds(params),
      };
    case MessageAdapterParamsType.ReceiveToken:
      return {
        adapterIds: getAdapterIds(params),
        returnAdapterIds: getReturnAdapterIds(params),
      };
    case MessageAdapterParamsType.Data:
      return {
        adapterIds: getAdapterIds(params),
        returnAdapterIds: [AdapterType.HUB],
      };
    default:
      return exhaustiveCheck(messageAdapterParamType);
  }
}
