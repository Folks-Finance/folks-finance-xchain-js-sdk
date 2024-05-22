import { avalancheFuji, baseSepolia, sepolia } from "viem/chains";

import type {
  EvmChainId,
  EvmChainName,
  EvmFolksChainId,
} from "../types/chain.js";
import type { Chain } from "viem";

const EVM_CHAIN_NAMES_MAINNET = [] as const;
const EVM_CHAIN_NAMES_TESTNET = [
  "AVALANCHE_FUJI",
  "ETHEREUM_SEPOLIA",
  "BASE_SEPOLIA",
] as const;
export const EVM_CHAIN_NAMES = [
  ...EVM_CHAIN_NAMES_MAINNET,
  ...EVM_CHAIN_NAMES_TESTNET,
] as const;

const EVM_CHAIN_ID_MAINNET = {} as const;

const EVM_CHAIN_ID_TESTNET = {
  AVALANCHE_FUJI: avalancheFuji.id,
  ETHEREUM_SEPOLIA: sepolia.id,
  BASE_SEPOLIA: baseSepolia.id,
} as const;

export const EVM_CHAIN_ID = {
  ...EVM_CHAIN_ID_MAINNET,
  ...EVM_CHAIN_ID_TESTNET,
} as const satisfies Record<EvmChainName, number>;

export const isEvmChainId = (chainId: number): chainId is EvmChainId => {
  // @ts-expect-error -- this is made on purpose to have the type predicate
  return Object.values(EVM_FOLKS_CHAIN_ID).includes(chainId);
};

export const MAINNET_EVM_FOLKS_CHAIN_ID = {} as const;

export const TESTNET_EVM_FOLKS_CHAIN_ID = {
  AVALANCHE_FUJI: 1,
  ETHEREUM_SEPOLIA: 6,
  BASE_SEPOLIA: 7,
} as const;

export const EVM_FOLKS_CHAIN_ID = {
  ...MAINNET_EVM_FOLKS_CHAIN_ID,
  ...TESTNET_EVM_FOLKS_CHAIN_ID,
} as const satisfies Record<EvmChainName, number>;

export const CHAIN_VIEM: Record<EvmFolksChainId, Chain> = {
  // testnet
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: avalancheFuji,
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: sepolia,
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: baseSepolia,
};

export const CHAIN_NODE: Record<EvmFolksChainId, Array<string>> = {
  // testnet
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: [...avalancheFuji.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: [...sepolia.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: [...baseSepolia.rpcUrls.default.http],
};
