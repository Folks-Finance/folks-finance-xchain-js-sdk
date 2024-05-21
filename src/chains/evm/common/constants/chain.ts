import { avalancheFuji, baseSepolia, sepolia } from "viem/chains";

import { FOLKS_CHAIN_ID } from "../../../../common/constants/index.js";

import type { FolksChainId } from "../../../../common/types/index.js";
import type { Chain } from "viem";

export const CHAIN_VIEM: Record<FolksChainId, Chain> = {
  // testnet
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: avalancheFuji,
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: sepolia,
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: baseSepolia,
};

export const CHAIN_NODE: Record<FolksChainId, Array<string>> = {
  // testnet
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: [...avalancheFuji.rpcUrls.default.http],
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: [...sepolia.rpcUrls.default.http],
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: [...baseSepolia.rpcUrls.default.http],
};
