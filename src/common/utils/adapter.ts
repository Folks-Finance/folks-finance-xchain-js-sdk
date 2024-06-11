import { isHubChain } from "../../chains/evm/hub/utils/chain.js";
import { FolksCore } from "../../xchain/core/folks-core.js";
import { AdapterType } from "../types/message.js";

import type { FolksChainId } from "../types/chain.js";
import type { MessageAdapters } from "../types/message.js";

export function doesAdapterSupportDataMessage(
  folksChainId: FolksChainId,
  adapterId: AdapterType,
): boolean {
  const isHub = isHubChain(folksChainId, FolksCore.getSelectedNetwork());
  return (
    (isHub && adapterId === AdapterType.HUB) ||
    (!isHub &&
      (adapterId === AdapterType.WORMHOLE_DATA ||
        adapterId === AdapterType.CCIP_DATA))
  );
}

export function assertAdapterSupportsDataMessage(
  folksChainId: FolksChainId,
  adapterId: AdapterType,
): void {
  if (!doesAdapterSupportDataMessage(folksChainId, adapterId))
    throw Error(
      `Adapter ${adapterId} does not support data message for folksChainId: ${folksChainId}`,
    );
}

export function doesAdapterSupportTokenMessage(
  folksChainId: FolksChainId,
  adapterId: AdapterType,
): boolean {
  const isHub = isHubChain(folksChainId, FolksCore.getSelectedNetwork());
  return (
    (isHub && adapterId === AdapterType.HUB) ||
    (!isHub &&
      (adapterId === AdapterType.WORMHOLE_CCTP ||
        adapterId === AdapterType.CCIP_TOKEN))
  );
}

export function assertAdapterSupportsTokenMessage(
  folksChainId: FolksChainId,
  adapterId: AdapterType,
): void {
  if (!doesAdapterSupportTokenMessage(folksChainId, adapterId))
    throw Error(
      `Adapter ${adapterId} does not support token message for folksChainId: ${folksChainId}`,
    );
}

export function transformAdapterForEstimation(
  adapters: MessageAdapters,
): MessageAdapters {
  if (adapters.adapterId === AdapterType.WORMHOLE_CCTP) {
    return {
      adapterId: AdapterType.WORMHOLE_DATA,
      returnAdapterId: adapters.returnAdapterId,
    };
  }
  if (adapters.returnAdapterId === AdapterType.WORMHOLE_CCTP) {
    return {
      adapterId: adapters.adapterId,
      returnAdapterId: AdapterType.WORMHOLE_DATA,
    };
  }
  return adapters;
}

export function getGasLimitIncrease(adapters: MessageAdapters) {
  if (
    adapters.adapterId === AdapterType.WORMHOLE_CCTP ||
    adapters.returnAdapterId === AdapterType.WORMHOLE_CCTP
  )
    return 100000n;
  return 0n;
}
