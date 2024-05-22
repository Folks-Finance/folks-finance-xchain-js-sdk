import type {
  EVM_CHAIN_ID,
  EVM_CHAIN_NAMES,
  EVM_FOLKS_CHAIN_ID,
} from "../constants/chain.js";

export type EvmChainName = (typeof EVM_CHAIN_NAMES)[number];

export type EvmChainId = (typeof EVM_CHAIN_ID)[keyof typeof EVM_CHAIN_ID];

export type EvmFolksChainId =
  (typeof EVM_FOLKS_CHAIN_ID)[keyof typeof EVM_FOLKS_CHAIN_ID];
