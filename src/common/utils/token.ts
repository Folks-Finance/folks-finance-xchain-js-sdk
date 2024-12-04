import { FOLKS_TOKEN_IDS_FROM_POOL_BY_NETWORK } from "../constants/pool.js";
import { CROSS_CHAIN_FOLKS_TOKEN_ID } from "../constants/token.js";

import type { NetworkType } from "../types/chain.js";
import type { FolksTokenId } from "../types/token.js";

export function isCrossChainToken(folksTokenId: FolksTokenId): boolean {
  return CROSS_CHAIN_FOLKS_TOKEN_ID.includes(folksTokenId);
}

export function getFolksTokenIdFromPool(poolId: number, network: NetworkType): FolksTokenId {
  const folksTokenId = FOLKS_TOKEN_IDS_FROM_POOL_BY_NETWORK[network][poolId];
  if (!folksTokenId) throw new Error(`Unknown poolId: ${poolId}`);
  return folksTokenId;
}
