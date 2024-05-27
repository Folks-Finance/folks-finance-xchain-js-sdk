import { createClient, fallback, http } from "viem";

import {
  CHAIN_VIEM,
  CHAIN_NODE,
  EVM_FOLKS_CHAIN_ID,
} from "../constants/chain.js";

import { isEvmChainId } from "./chain.js";

import type { FolksChainId } from "../../../../common/types/chain.js";
import type { EvmChainId } from "../types/chain.js";
import type { Client } from "viem";

export function initProviders(
  customProvider: Partial<Record<FolksChainId, Client>>,
): Record<FolksChainId, Client> {
  return Object.fromEntries(
    Object.values(EVM_FOLKS_CHAIN_ID).map((evmFolksChainId) => {
      return [
        evmFolksChainId,
        customProvider[evmFolksChainId] ??
          createClient({
            chain: CHAIN_VIEM[evmFolksChainId],
            transport: fallback(
              CHAIN_NODE[evmFolksChainId].map((url: string) => http(url)),
            ),
          }),
      ];
    }),
  ) as Record<FolksChainId, Client>;
}

export function getChainId(provider: Client): EvmChainId {
  const chainId = provider.chain?.id;
  if (chainId === undefined)
    throw new Error("EVM provider chain id is undefined");
  if (!isEvmChainId(chainId))
    throw new Error(`EVM provider chain id is not supported: ${chainId}`);

  return chainId;
}
