import { PublicClient as EVMProvider } from "viem";
import {
  ChainType,
  FolksChain,
  FolksChainId,
  FolksCoreConfig,
  FolksCoreProvider,
  FolksProvider,
  FolksProviderType,
  FolksSigner,
  FolksSignerType,
  NetworkType,
} from "../../type/common";
import { ProviderEVMUtil } from "../../util/evm";
import { FolksChainUtil } from "../../util/common";
import { HubChainUtil } from "../../util/hub";

export class FolksCore {
  private static instance: FolksCore;
  private folksCoreProvider: FolksCoreProvider;

  private selectedNetwork: NetworkType;
  private signer?: FolksSigner;
  private selectedFolksChainId?: FolksChainId;

  private constructor(folksCoreConfig: FolksCoreConfig) {
    this.selectedNetwork = folksCoreConfig.network;
    this.folksCoreProvider = { evm: {} as Record<FolksChainId, EVMProvider> };
    this.folksCoreProvider.evm = ProviderEVMUtil.initProviders(folksCoreConfig.provider.evm);
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
    const folksChain = FolksChainUtil.getFolksChain(folksChainId, this.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM:
        return FolksCore.getEVMProvider(folksChainId) as FolksProviderType<T>;
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  }

  static getSigner<T extends ChainType>(): FolksSignerType<T> {
    if (!this.instance.signer) throw new Error("Signer is not set");
    return this.instance.signer as FolksSignerType<T>;
  }

  static getSelectedFolksChainId(): FolksChainId {
    if (!this.instance.selectedFolksChainId) throw new Error("FolksChainId is not set");
    return this.instance.selectedFolksChainId;
  }

  static getSelectedFolksChain(): FolksChain {
    return FolksChainUtil.getFolksChain(FolksCore.getSelectedFolksChainId(), FolksCore.getSelectedNetwork());
  }

  static getSelectedNetwork() {
    if (!this.instance.selectedNetwork) throw new Error("Network is not set");
    return this.instance.selectedNetwork;
  }

  static getHubProvider(): EVMProvider {
    const hubFolksChainId = HubChainUtil.getHubChain(this.instance.selectedNetwork).folksChainId;
    return this.instance.folksCoreProvider.evm[hubFolksChainId]!;
  }

  static setProvider(folksChainId: FolksChainId, provider: FolksProvider) {
    const folksChain = FolksChainUtil.getFolksChain(folksChainId, this.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM:
        this.instance.folksCoreProvider.evm[folksChainId] = provider as EVMProvider;
        break;
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  }

  static setFolksChainIdAndSigner(folksChainId: FolksChainId, network: NetworkType, signer?: FolksSigner) {
    const folksChain = FolksChainUtil.getFolksChain(folksChainId, network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        this.instance.signer = signer;
        break;
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }

    this.instance.selectedFolksChainId = folksChainId;
    this.instance.selectedNetwork = network;
  }

  static getEVMProvider(folksChainId: FolksChainId): EVMProvider {
    if (this.instance.folksCoreProvider.evm.hasOwnProperty(folksChainId))
      return this.instance.folksCoreProvider.evm[folksChainId]!;
    throw new Error(`Unsupported EVM folks chain id: ${folksChainId}`);
  }
}
