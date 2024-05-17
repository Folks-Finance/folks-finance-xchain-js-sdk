import { createPublicClient, fallback, http } from "viem";
import type { PublicClient } from "viem";
import { CHAIN_NODE, CHAIN_VIEM } from "../constants/index.js";
import type { ChainId } from "../types/index.js";
import { FOLKS_CHAIN_ID } from "../../../common/constants/index.js";
import type { FolksChainId } from "../../../common/types/index.js";

export function initProviders(
  customProvider: Partial<Record<FolksChainId, PublicClient>>,
): Record<FolksChainId, PublicClient> {
  return Object.fromEntries(
    Object.values(FOLKS_CHAIN_ID).map((folksChainId) => {
      return [
        folksChainId,
        customProvider[folksChainId] ??
          createPublicClient({
            chain: CHAIN_VIEM[folksChainId],
            transport: fallback(
              CHAIN_NODE[folksChainId].map((url: string) => http(url)),
            ),
          }),
      ];
    }),
  ) as Record<FolksChainId, PublicClient>;
}

export function getChainId(provider: PublicClient): ChainId {
  if (provider.chain?.id === undefined)
    throw new Error("EVM provider chain id is undefined");
  return provider.chain.id;
}
