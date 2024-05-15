import { FOLKS_CHAIN, SPOKE_CHAIN } from "../../constants/common";
import { FolksChain, FolksChainId, FolksTokenId, NetworkType, SpokeChain, SpokeTokenData } from "../../type/common";

export namespace FolksChainUtil {
  export function isFolksChainNetworkSupported(network: NetworkType): boolean {
    return FOLKS_CHAIN.hasOwnProperty(network);
  }

  export function isFolksChainSupported(folksChainId: FolksChainId, network: NetworkType): boolean {
    return isFolksChainNetworkSupported(network) && FOLKS_CHAIN[network].hasOwnProperty(folksChainId);
  }

  export function getFolksChain(folksChainId: FolksChainId, network: NetworkType): FolksChain {
    if (isFolksChainSupported(folksChainId, network)) return FOLKS_CHAIN[network][folksChainId]!;
    throw new Error(`Invalid folksChainId: ${folksChainId} for network: ${network}`);
  }

  export function getFolksChainsByNetwork(network: NetworkType): FolksChain[] {
    if (isFolksChainNetworkSupported(network)) return Object.values(FOLKS_CHAIN[network]);
    throw new Error(`Invalid network: ${network}`);
  }

  export function getFolksChainIdsByNetwork(networkType: NetworkType): FolksChainId[] {
    return getFolksChainsByNetwork(networkType).map((folksChain) => folksChain.folksChainId);
  }
}

export namespace SpokeChainUtil {
  export function isSpokeChainNetworkSupported(network: NetworkType): boolean {
    return SPOKE_CHAIN.hasOwnProperty(network);
  }

  export function checkSpokeChainNetworkSupported(network: NetworkType) {
    if (!isSpokeChainNetworkSupported(network)) throw new Error(`Spoke chain is not supported for network: ${network}`);
  }

  export function isSpokeChainSupported(folksChainId: FolksChainId, network: NetworkType): boolean {
    checkSpokeChainNetworkSupported(network);
    return SPOKE_CHAIN[network].hasOwnProperty(folksChainId);
  }

  export function checkSpokeChainSupported(folksChainId: FolksChainId, network: NetworkType) {
    if (!isSpokeChainSupported(folksChainId, network))
      throw new Error(`Spoke chain is not supported for folksChainId: ${folksChainId}`);
  }

  export function getSpokeChain(folksChainId: FolksChainId, network: NetworkType): SpokeChain {
    checkSpokeChainSupported(folksChainId, network);
    return SPOKE_CHAIN[network][folksChainId]!;
  }

  export function doesSpokeSupportFolksToken(spokeChain: SpokeChain, folksTokenId: FolksTokenId): boolean {
    return spokeChain.tokens.hasOwnProperty(folksTokenId);
  }

  export function getSpokeTokenData(spokeChain: SpokeChain, folksTokenId: FolksTokenId): SpokeTokenData {
    if (doesSpokeSupportFolksToken(spokeChain, folksTokenId)) return spokeChain.tokens[folksTokenId]!;
    throw new Error(`Spoke Token not found for folksTokenId: ${folksTokenId}`);
  }

  export function isFolksTokenSupported(
    folksTokenId: FolksTokenId,
    folksChainId: FolksChainId,
    network: NetworkType
  ): boolean {
    const spokeChain = getSpokeChain(folksChainId, network);
    return doesSpokeSupportFolksToken(spokeChain, folksTokenId);
  }

  export function checkSpokeChainSupportFolksToken(
    folksChainId: FolksChainId,
    folksTokenId: FolksTokenId,
    network: NetworkType
  ) {
    if (!isFolksTokenSupported(folksTokenId, folksChainId, network))
      throw new Error(`Folks Token ${folksTokenId} is not supported on Folks Chain ${folksChainId}`);
  }
}
