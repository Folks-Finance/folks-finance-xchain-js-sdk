import type {
  EVM_CHAIN_ID,
  MAINNET_EVM_CHAIN_ID,
  TESTNET_EVM_CHAIN_ID,
  EVM_CHAIN_NAMES,
  MAINNET_EVM_CHAIN_NAMES,
  TESTNET_EVM_CHAIN_NAMES,
  EVM_FOLKS_CHAIN_ID,
  MAINNET_EVM_FOLKS_CHAIN_ID,
  TESTNET_EVM_FOLKS_CHAIN_ID,
} from "../constants/chain.js";

export type MainnetEvmChainName = (typeof MAINNET_EVM_CHAIN_NAMES)[number];
export type TestnetEvmChainName = (typeof TESTNET_EVM_CHAIN_NAMES)[number];
export type EvmChainName = (typeof EVM_CHAIN_NAMES)[number];

export type MainnetEvmChainId = (typeof MAINNET_EVM_CHAIN_ID)[keyof typeof MAINNET_EVM_CHAIN_ID];
export type TestnetEvmChainId = (typeof TESTNET_EVM_CHAIN_ID)[keyof typeof TESTNET_EVM_CHAIN_ID];
export type EvmChainId = (typeof EVM_CHAIN_ID)[keyof typeof EVM_CHAIN_ID];

export type MainnetEvmFolksChainId = (typeof MAINNET_EVM_FOLKS_CHAIN_ID)[keyof typeof MAINNET_EVM_FOLKS_CHAIN_ID];
export type TestnetEvmFolksChainId = (typeof TESTNET_EVM_FOLKS_CHAIN_ID)[keyof typeof TESTNET_EVM_FOLKS_CHAIN_ID];
export type EvmFolksChainId = (typeof EVM_FOLKS_CHAIN_ID)[keyof typeof EVM_FOLKS_CHAIN_ID];
