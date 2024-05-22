import { createPublicClient, fallback, http } from "viem";

import {
  CHAIN_VIEM,
  CHAIN_NODE,
  EVM_FOLKS_CHAIN_ID,
  isEvmChainId,
} from "../constants/chain.js";

import type { FolksChainId } from "../../../../common/types/chain.js";
import type { EvmChainId } from "../types/chain.js";
import type { PublicClient } from "viem";

export function initProviders(
  customProvider: Partial<Record<FolksChainId, PublicClient>>,
): Record<FolksChainId, PublicClient> {
  return Object.fromEntries(
    Object.values(EVM_FOLKS_CHAIN_ID).map((evmFolksChainId) => {
      return [
        evmFolksChainId,
        customProvider[evmFolksChainId] ??
          createPublicClient({
            chain: CHAIN_VIEM[evmFolksChainId],
            transport: fallback(
              CHAIN_NODE[evmFolksChainId].map((url: string) => http(url)),
            ),
          }),
      ];
    }),
  ) as Record<FolksChainId, PublicClient>;
}

export function getChainId(provider: PublicClient): EvmChainId {
  const chainId = provider.chain?.id;
  if (chainId === undefined)
    throw new Error("EVM provider chain id is undefined");
  if (!isEvmChainId(chainId))
    throw new Error(`EVM provider chain id is not supported: ${chainId}`);

  return chainId;
}
