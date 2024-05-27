import type { ChainType, NetworkType, FolksChainId } from "./chain.js";
import type { Client as EVMProvider, WalletClient as EVMSigner } from "viem";

type FolksProviderTypeMap = {
  [ChainType.EVM]: EVMProvider;
};

type FolksSignerTypeMap = {
  [ChainType.EVM]: EVMSigner;
};

export type FolksProviderType<T extends ChainType> = FolksProviderTypeMap[T];
export type FolksSignerType<T extends ChainType> = FolksSignerTypeMap[T];

export type FolksProvider = EVMProvider | null;
export type FolksSigner = { signer: EVMSigner; folksChainId: FolksChainId };

export type FolksCoreProvider = {
  evm: Partial<Record<FolksChainId, EVMProvider>>;
};
export type FolksCoreConfig = {
  network: NetworkType;
  provider: FolksCoreProvider;
};
