import type { PublicClient as EVMProvider } from "viem";
import { ChainType } from "../../common/types/index.js";
import type {
  FolksChain,
  FolksChainId,
  FolksCoreConfig,
  FolksCoreProvider,
  FolksProvider,
  FolksProviderType,
  FolksSigner,
  FolksSignerType,
  NetworkType,
} from "../../common/types/index.js";
import { getFolksChain } from "../../common/utils/chain.js";
import { initProviders } from "../../chains/evm/common/utils/provider.js";
import { getHubChain } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";

export class FolksCore {
  private static instance: FolksCore | undefined;
  private folksCoreProvider: FolksCoreProvider;

  private selectedNetwork: NetworkType;
  private folksSigner?: FolksSigner;

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

  static getProvider<T extends ChainType>(
    folksChainId: FolksChainId,
  ): FolksProviderType<T> {
    const folksChain = getFolksChain(folksChainId, this.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM:
        return FolksCore.getEVMProvider(folksChainId) as FolksProviderType<T>;
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  }

  static getFolksSigner() {
    const instance = this.getInstance();
    if (!instance.folksSigner)
      throw new Error("FolksSigner is not initialized");

    return instance.folksSigner;
  }

  static getSigner<T extends ChainType>(): FolksSignerType<T> {
    const { signer } = this.getFolksSigner();

    return signer as FolksSignerType<T>;
  }

  static getSelectedFolksChain(): FolksChain {
    const { folksChainId } = this.getFolksSigner();

    return getFolksChain(folksChainId, this.getSelectedNetwork());
  }

  static getSelectedNetwork() {
    const instance = this.getInstance();
    return instance.selectedNetwork;
  }

  static getHubProvider(): EVMProvider {
    const instance = this.getInstance();
    const hubFolksChainId = getHubChain(instance.selectedNetwork).folksChainId;

    const hubProvider = instance.folksCoreProvider.evm[hubFolksChainId];
    if (!hubProvider) throw new Error(`Hub Provider has not been initialized`);

    return hubProvider;
  }

  static setProvider(folksChainId: FolksChainId, provider: FolksProvider) {
    const instance = this.getInstance();
    const folksChain = getFolksChain(folksChainId, this.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM:
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style -- in the future FolksProvider will contain more than just EVMProvider
        instance.folksCoreProvider.evm[folksChainId] = provider as EVMProvider;
        break;
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  }

  static setNetwork(network: NetworkType) {
    const instance = this.getInstance();
    instance.selectedNetwork = network;
  }

  static setFolksSigner(folksSigner: FolksSigner) {
    const instance = this.getInstance();
    const folksChain = getFolksChain(
      folksSigner.folksChainId,
      this.getSelectedNetwork(),
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        instance.folksSigner = folksSigner;
        break;
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  }

  static getEVMProvider(folksChainId: FolksChainId): EVMProvider {
    const instance = this.getInstance();
    const evmProvider = instance.folksCoreProvider.evm[folksChainId];
    if (!evmProvider)
      throw new Error(
        `EVM Provider not found for folksChainId: ${folksChainId}`,
      );

    return evmProvider;
  }
}
