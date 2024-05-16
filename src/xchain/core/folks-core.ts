import type { PublicClient as EVMProvider } from "viem";
import { ChainType, NetworkType } from "../../type/common/index.js";
import type {
  FolksChain,
  FolksChainId,
  FolksCoreConfig,
  FolksCoreProvider,
  FolksProvider,
  FolksProviderType,
  FolksSigner,
  FolksSignerType,
} from "../../type/common/index.js";
import { getFolksChain } from "../../util/common/chain.js";
import { initProviders } from "../../util/evm/provider.js";
import { getHubChain } from "../../util/hub/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";

export class FolksCore {
  private static instance: FolksCore | undefined;
  private folksCoreProvider: FolksCoreProvider;

  private selectedNetwork: NetworkType;
  private signer?: FolksSigner;
  private selectedFolksChainId?: FolksChainId;

  private constructor(folksCoreConfig: FolksCoreConfig) {
    this.selectedNetwork = folksCoreConfig.network;
    this.folksCoreProvider = { evm: {} as Record<FolksChainId, EVMProvider> };
    this.folksCoreProvider.evm = initProviders(folksCoreConfig.provider.evm);
  }

  static init(folksCoreConfig: FolksCoreConfig): FolksCore {
    if (FolksCore.instance) throw new Error("FolksCore is already initialized");
    FolksCore.instance = new FolksCore(folksCoreConfig);
    return FolksCore.instance;
  }

  static getInstance(): FolksCore {
    if (FolksCore.instance) return FolksCore.instance;
    throw new Error("FolksCore is not initialized");
  }

  static getProvider<T extends ChainType>(folksChainId: FolksChainId): FolksProviderType<T> {
    const folksChain = getFolksChain(folksChainId, this.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM:
        return FolksCore.getEVMProvider(folksChainId) as FolksProviderType<T>;
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  }

  static getSigner<T extends ChainType>(): FolksSignerType<T> {
    const instance = this.getInstance();
    return instance.signer as FolksSignerType<T>;
  }

  static getSelectedFolksChainId(): FolksChainId {
    const instance = this.getInstance();
    if (!instance.selectedFolksChainId) throw new Error("FolksChainId is not set");

    return instance.selectedFolksChainId;
  }

  static getSelectedFolksChain(): FolksChain {
    return getFolksChain(FolksCore.getSelectedFolksChainId(), FolksCore.getSelectedNetwork());
  }

  static getSelectedNetwork() {
    const instance = this.getInstance();
    return instance.selectedNetwork;
  }

  static getHubProvider(): EVMProvider {
    const instance = this.getInstance();
    const hubFolksChainId = getHubChain(instance.selectedNetwork).folksChainId;
    return instance.folksCoreProvider.evm[hubFolksChainId]!;
  }

  static setProvider(folksChainId: FolksChainId, provider: FolksProvider) {
    const instance = this.getInstance();
    const folksChain = getFolksChain(folksChainId, this.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM:
        instance.folksCoreProvider.evm[folksChainId] = provider as EVMProvider;
        break;
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  }

  static setFolksChainIdAndSigner(folksChainId: FolksChainId, network: NetworkType, signer?: FolksSigner) {
    const instance = this.getInstance();
    const folksChain = getFolksChain(folksChainId, network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        instance.signer = signer;
        break;
      default:
        return exhaustiveCheck(folksChain.chainType);
    }

    instance.selectedFolksChainId = folksChainId;
    instance.selectedNetwork = network;
  }

  static getEVMProvider(folksChainId: FolksChainId): EVMProvider {
    const instance = this.getInstance();
    const evmProvider = instance.folksCoreProvider.evm[folksChainId];
    if (!evmProvider) throw new Error(`EVM Provider not found for folksChainId: ${folksChainId}`);

    return evmProvider;
  }
}
