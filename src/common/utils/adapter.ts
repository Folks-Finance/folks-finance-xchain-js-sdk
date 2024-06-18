import { isHubChain } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../../xchain/core/folks-core.js";
import { DATA_ADAPTERS, HUB_ADAPTERS, TOKEN_ADAPTERS } from "../constants/adapter.js";
import { MessageAdapterParamsType } from "../types/adapter.js";
import { AdapterType } from "../types/message.js";

import { isCircleToken } from "./token.js";

import type {
  MessageAdapterParams,
  ReceiveTokenMessageAdapterParams,
  SendTokenMessageAdapterParams,
} from "../types/adapter.js";
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

function getAdapterId({
  folksTokenId,
  sourceFolksChainId,
  network,
  messageAdapterParamType,
}: ReceiveTokenMessageAdapterParams | SendTokenMessageAdapterParams) {
  if (isHubChain(sourceFolksChainId, network)) return HUB_ADAPTERS;
  if (messageAdapterParamType == MessageAdapterParamsType.SendToken && isCircleToken(folksTokenId))
    return TOKEN_ADAPTERS;
  return DATA_ADAPTERS;
}

function getReturnAdapterId({ folksTokenId, destFolksChainId, network }: ReceiveTokenMessageAdapterParams) {
  if (isHubChain(destFolksChainId, network)) return HUB_ADAPTERS;
  if (isCircleToken(folksTokenId)) return TOKEN_ADAPTERS;
  return DATA_ADAPTERS;
}

export function getSupportedMessageAdapters(params: MessageAdapterParams) {
  const { messageAdapterParamType } = params;

  switch (messageAdapterParamType) {
    case MessageAdapterParamsType.SendToken:
      return {
        adapterId: getAdapterId(params),
        returnAdapterId: [AdapterType.HUB],
      };
    case MessageAdapterParamsType.ReceiveToken:
      return {
        adapterId: getAdapterId(params),
        returnAdapterId: getReturnAdapterId(params),
      };
    case MessageAdapterParamsType.Data:
      return {
        adapterId: DATA_ADAPTERS,
        returnAdapterId: [AdapterType.HUB],
      };
    default:
      return exhaustiveCheck(messageAdapterParamType);
  }
}
