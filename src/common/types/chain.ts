import type { GenericAddress } from "./address.js";
import type { AdapterType } from "./message.js";
import type { FolksTokenId, SpokeTokenData } from "./token.js";
import type { EvmChainName } from "../../chains/evm/common/types/chain.js";
import type { FOLKS_CHAIN_ID, MAINNET_FOLKS_CHAIN_ID, TESTNET_FOLKS_CHAIN_ID } from "../constants/chain.js";

export enum ChainType {
  EVM = "EVM",
}

export enum NetworkType {
  MAINNET = "MAINNET",
  TESTNET = "TESTNET",
}

export type FolksChainName = EvmChainName;
export type MainnetFolksChainId = (typeof MAINNET_FOLKS_CHAIN_ID)[keyof typeof MAINNET_FOLKS_CHAIN_ID];
export type TestnetFolksChainId = (typeof TESTNET_FOLKS_CHAIN_ID)[keyof typeof TESTNET_FOLKS_CHAIN_ID];
export type FolksChainId = (typeof FOLKS_CHAIN_ID)[keyof typeof FOLKS_CHAIN_ID];

export type IFolksChain = {
  folksChainId: FolksChainId;
};

export type FolksChain = {
  chainName: string;
  chainType: ChainType;
  chainId: number | string | undefined;
  network: NetworkType;
} & IFolksChain;

export type SpokeChain = {
  spokeCommonAddress: GenericAddress;
  bridgeRouterAddress: GenericAddress;
  adapters: Partial<Record<AdapterType, GenericAddress>>;
  tokens: Partial<Record<FolksTokenId, SpokeTokenData>>;
} & IFolksChain;
