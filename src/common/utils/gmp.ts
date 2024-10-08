import { CCIP_DATA, WORMHOLE_DATA } from "../constants/gmp.js";

import type { FolksChainId } from "../types/chain.js";
import type { CCIPData, WormholeData } from "../types/gmp.js";

export function getWormholeData(folksChainId: FolksChainId): WormholeData {
  const wormholeData = WORMHOLE_DATA[folksChainId];
  if (wormholeData) return wormholeData;
  throw new Error(`Wormhole data not found for folksChainId: ${folksChainId}`);
}

export function getCcipData(folksChainId: FolksChainId): CCIPData {
  const ccipData = CCIP_DATA[folksChainId];
  if (ccipData) return ccipData;
  throw new Error(`CCIP data not found for folksChainId: ${folksChainId}`);
}
