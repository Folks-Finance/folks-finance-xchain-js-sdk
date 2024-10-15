import { CCIP_DATA, WORMHOLE_DATA } from "../constants/gmp.js";

import type { FolksChainId } from "../types/chain.js";
import type { CCIPData, WormholeData } from "../types/gmp.js";

export function getWormholeData(folksChainId: FolksChainId): WormholeData {
  return WORMHOLE_DATA[folksChainId];
}

export function getCcipData(folksChainId: FolksChainId): CCIPData {
  return CCIP_DATA[folksChainId];
}
