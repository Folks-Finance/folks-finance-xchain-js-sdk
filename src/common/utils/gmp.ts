import { CCIP_DATA, CCTP_DATA, WORMHOLE_DATA } from "../constants/gmp.js";

import type { FolksChainId } from "../types/chain.js";
import type { CCIPData, CCTPData, WormholeData } from "../types/gmp.js";

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

export function getCctpData(folksChainId: FolksChainId): CCTPData {
  const cctpData = CCTP_DATA[folksChainId];
  if (cctpData) return cctpData;
  throw new Error(`CCTP data not found for folksChainId: ${folksChainId}`);
}
