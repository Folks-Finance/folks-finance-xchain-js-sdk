import {
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  sepolia,
} from "viem/chains";

import type { EvmChainName, EvmFolksChainId } from "../types/chain.js";
import type { Chain } from "viem";

export const MAINNET_EVM_CHAIN_NAMES = ["AVALANCHE", "ETHEREUM", "BASE", "BSC"] as const;
export const TESTNET_EVM_CHAIN_NAMES = [
  "AVALANCHE_FUJI",
  "ETHEREUM_SEPOLIA",
  "BASE_SEPOLIA",
  "BSC_TESTNET",
  "ARBITRUM_SEPOLIA",
] as const;
export const EVM_CHAIN_NAMES = [...MAINNET_EVM_CHAIN_NAMES, ...TESTNET_EVM_CHAIN_NAMES] as const;

export const MAINNET_EVM_CHAIN_ID = {
  AVALANCHE: avalanche.id,
  ETHEREUM: mainnet.id,
  BASE: base.id,
  BSC: bsc.id,
} as const;

export const TESTNET_EVM_CHAIN_ID = {
  AVALANCHE_FUJI: avalancheFuji.id,
  ETHEREUM_SEPOLIA: sepolia.id,
  BASE_SEPOLIA: baseSepolia.id,
  BSC_TESTNET: bscTestnet.id,
  ARBITRUM_SEPOLIA: arbitrumSepolia.id,
} as const;

export const EVM_CHAIN_ID = {
  ...MAINNET_EVM_CHAIN_ID,
  ...TESTNET_EVM_CHAIN_ID,
} as const satisfies Record<EvmChainName, number>;

export const MAINNET_EVM_FOLKS_CHAIN_ID = {
  AVALANCHE: 100,
  ETHEREUM: 101,
  BASE: 102,
  BSC: 103,
} as const;

export const TESTNET_EVM_FOLKS_CHAIN_ID = {
  AVALANCHE_FUJI: 1,
  ETHEREUM_SEPOLIA: 6,
  BASE_SEPOLIA: 7,
  BSC_TESTNET: 3,
  ARBITRUM_SEPOLIA: 8,
} as const;

export const EVM_FOLKS_CHAIN_ID = {
  ...MAINNET_EVM_FOLKS_CHAIN_ID,
  ...TESTNET_EVM_FOLKS_CHAIN_ID,
} as const satisfies Record<EvmChainName, number>;

export const MAINNET_CHAIN_VIEM = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: avalanche,
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: mainnet,
  [EVM_FOLKS_CHAIN_ID.BASE]: base,
  [EVM_FOLKS_CHAIN_ID.BSC]: bsc,
} as const;
export const TESTNET_CHAIN_VIEM = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: avalancheFuji,
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: sepolia,
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: baseSepolia,
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: bscTestnet,
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: arbitrumSepolia,
} as const;
export const CHAIN_VIEM = {
  ...MAINNET_CHAIN_VIEM,
  ...TESTNET_CHAIN_VIEM,
} as const satisfies Record<EvmFolksChainId, Chain>;

export const MAINNET_CHAIN_NODE = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: [...avalanche.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: [...mainnet.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BASE]: [...base.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BSC]: [...bsc.rpcUrls.default.http],
};
export const TESTNET_CHAIN_NODE = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: [...avalancheFuji.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: [...sepolia.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: [...baseSepolia.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: [...bscTestnet.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: [...arbitrumSepolia.rpcUrls.default.http],
};
export const CHAIN_NODE = {
  ...MAINNET_CHAIN_NODE,
  ...TESTNET_CHAIN_NODE,
} as const satisfies Record<EvmFolksChainId, Array<string>>;
