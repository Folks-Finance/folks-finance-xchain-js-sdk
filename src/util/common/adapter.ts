import { AdapterType, FolksChainId } from "../../type/common";
import { FolksCore } from "../../xchain/core/FolksCore";
import { HubChainUtil } from "../hub";

export namespace AdapterUtil {
  export function doesAdapterSupportDataMessage(folksChainId: FolksChainId, adapterId: AdapterType): boolean {
    const isHub = HubChainUtil.isHubChain(folksChainId, FolksCore.getSelectedNetwork());
    return (
      (isHub && adapterId === AdapterType.HUB) ||
      (!isHub && (adapterId === AdapterType.WORMHOLE_DATA || adapterId === AdapterType.CCIP_DATA))
    );
  }

  export function checkAdapterSupportsDataMessage(folksChainId: FolksChainId, adapterId: AdapterType): void {
    if (!doesAdapterSupportDataMessage(folksChainId, adapterId))
      throw Error(`Adapter ${adapterId} does not support data message for folksChainId: ${folksChainId}`);
  }

  export function doesAdapterSupportTokenMessage(folksChainId: FolksChainId, adapterId: AdapterType): boolean {
    const isHub = HubChainUtil.isHubChain(folksChainId, FolksCore.getSelectedNetwork());
    return (
      (isHub && adapterId === AdapterType.HUB) ||
      (!isHub && (adapterId === AdapterType.WORMHOLE_CCTP || adapterId === AdapterType.CCIP_TOKEN))
    );
  }

  export function checkAdapterSupportsTokenMessage(folksChainId: FolksChainId, adapterId: AdapterType): void {
    if (!doesAdapterSupportTokenMessage(folksChainId, adapterId))
      throw Error(`Adapter ${adapterId} does not support token message for folksChainId: ${folksChainId}`);
  }
}
