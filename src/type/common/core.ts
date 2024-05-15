import { PublicClient as EVMProvider, WalletClient as EVMSigner } from "viem";
import { ChainType, FolksChainId, NetworkType } from "./chain";

type FolksProviderTypeMap = {
  [ChainType.EVM]: EVMProvider;
};

type FolksSignerTypeMap = {
  [ChainType.EVM]: EVMSigner;
};

export type FolksProviderType<T extends ChainType> = FolksProviderTypeMap[T];
export type FolksSignerType<T extends ChainType> = FolksSignerTypeMap[T];

export type FolksProvider = EVMProvider | null;
export type FolksSigner = EVMSigner | null;

export type FolksCoreProvider = {
  evm: Partial<Record<FolksChainId, EVMProvider>>;
};
export type FolksCoreConfig = {
  network: NetworkType;
  provider: FolksCoreProvider;
};
