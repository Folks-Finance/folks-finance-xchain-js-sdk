import { isHubChain } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../../xchain/core/folks-core.js";
import { DATA_ADAPTERS, HUB_ADAPTERS, TOKEN_ADAPTERS } from "../constants/adapter.js";
import { MessageAdapterParamsType } from "../types/adapter.js";
import { AdapterType } from "../types/message.js";

import { isCircleToken } from "./token.js";

import type { MessageAdapterParams, ReceiveTokenMessageAdapterParams } from "../types/adapter.js";
import type { FolksChainId } from "../types/chain.js";

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

function getAdapterIds(messageAdapterParams: MessageAdapterParams) {
  const { sourceFolksChainId, network, messageAdapterParamType } = messageAdapterParams;
  if (isHubChain(sourceFolksChainId, network)) return HUB_ADAPTERS;
  if (messageAdapterParamType == MessageAdapterParamsType.SendToken && isCircleToken(messageAdapterParams.folksTokenId))
    return TOKEN_ADAPTERS;
  return DATA_ADAPTERS;
}

function getReturnAdapterIds({ folksTokenId, destFolksChainId, network }: ReceiveTokenMessageAdapterParams) {
  if (isHubChain(destFolksChainId, network)) return HUB_ADAPTERS;
  if (isCircleToken(folksTokenId)) return TOKEN_ADAPTERS;
  return DATA_ADAPTERS;
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
