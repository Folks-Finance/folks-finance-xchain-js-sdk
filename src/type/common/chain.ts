import { FOLKS_CHAIN_ID } from "../../constants/common/index.js";
import { AdapterType } from "./message.js";
import { FolksTokenId } from "./token.js";
import type { SpokeTokenData } from "./token.js";

export enum ChainType {
  EVM = "EVM",
}

export enum NetworkType {
  MAINNET = "MAINNET",
  TESTNET = "TESTNET",
}

export type FolksChainId = (typeof FOLKS_CHAIN_ID)[keyof typeof FOLKS_CHAIN_ID];

export type GenericAddress = `0x${string}`;

export interface IFolksChain {
  folksChainId: FolksChainId;
}

export interface FolksChain extends IFolksChain {
  chainName: string;
  chainType: ChainType;
  chainId: number | string | undefined;
  network: NetworkType;
}

export interface SpokeChain extends IFolksChain {
  spokeCommonAddress: GenericAddress;
  bridgeRouterAddress: GenericAddress;
  adapters: Partial<Record<AdapterType, GenericAddress>>;
  tokens: Partial<Record<FolksTokenId, SpokeTokenData>>;
}
