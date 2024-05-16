import type { PublicClient as EVMProvider, WalletClient as EVMSigner } from "viem";
import type { ChainType, NetworkType } from "./chain.js";
import type { FolksChainId } from "./chain.js";

interface FolksProviderTypeMap {
  [ChainType.EVM]: EVMProvider;
}

interface FolksSignerTypeMap {
  [ChainType.EVM]: EVMSigner;
}

export type FolksProviderType<T extends ChainType> = FolksProviderTypeMap[T];
export type FolksSignerType<T extends ChainType> = FolksSignerTypeMap[T];

export type FolksProvider = EVMProvider | null;
export type FolksSigner = EVMSigner | null;

export interface FolksCoreProvider {
  evm: Partial<Record<FolksChainId, EVMProvider>>;
}
export interface FolksCoreConfig {
  network: NetworkType;
  provider: FolksCoreProvider;
}
