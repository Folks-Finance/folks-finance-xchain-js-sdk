import { AdapterType } from "../types/index.js";
import type { FolksChainId } from "../types/index.js";
import { FolksCore } from "../../xchain/core/folks-core.js";
import { isHubChain } from "../../hub/utils/chain.js";

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
