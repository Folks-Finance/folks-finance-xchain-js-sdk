import { getEvmSignerAddress } from "../../chains/evm/common/utils/chain.js";
import {
  getHubChainAdapterAddress,
  isHubChain,
} from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FOLKS_CHAIN, SPOKE_CHAIN } from "../constants/chain.js";
import { ChainType } from "../types/chain.js";

import { convertToGenericAddress } from "./address.js";

import type { GenericAddress } from "../types/address.js";
import type {
  FolksChain,
  FolksChainId,
  NetworkType,
  SpokeChain,
} from "../types/chain.js";
import type { FolksChainSigner } from "../types/core.js";
import type { AdapterType } from "../types/message.js";
import type { FolksTokenId, SpokeTokenData } from "../types/token.js";

export function getFolksChain(
  folksChainId: FolksChainId,
  network: NetworkType,
): FolksChain {
  const folksChain = FOLKS_CHAIN[network][folksChainId];
  if (!folksChain)
    throw new Error(`Folks Chain not found for folksChainId: ${folksChainId}`);

  return folksChain;
}

export function getFolksChainsByNetwork(
  network: NetworkType,
): Array<FolksChain> {
  return Object.values(FOLKS_CHAIN[network]);
}

export function getFolksChainIdsByNetwork(
  networkType: NetworkType,
): Array<FolksChainId> {
  return getFolksChainsByNetwork(networkType).map(
    (folksChain) => folksChain.folksChainId,
  );
}

export function isSpokeChainSupported(
  folksChainId: FolksChainId,
  network: NetworkType,
): boolean {
  return SPOKE_CHAIN[network][folksChainId] !== undefined;
}

export function assertSpokeChainSupported(
  folksChainId: FolksChainId,
  network: NetworkType,
) {
  if (!isSpokeChainSupported(folksChainId, network))
    throw new Error(
      `Spoke chain is not supported for folksChainId: ${folksChainId}`,
    );
}

export function getSpokeChain(
  folksChainId: FolksChainId,
  network: NetworkType,
): SpokeChain {
  const spokeChain = SPOKE_CHAIN[network][folksChainId];
  if (!spokeChain)
    throw new Error(`Spoke chain not found for folksChainId: ${folksChainId}`);

  return spokeChain;
}

export function doesSpokeSupportFolksToken(
  spokeChain: SpokeChain,
  folksTokenId: FolksTokenId,
): boolean {
  return spokeChain.tokens[folksTokenId] !== undefined;
}

export function getSpokeTokenData(
  spokeChain: SpokeChain,
  folksTokenId: FolksTokenId,
): SpokeTokenData {
  const tokenData = spokeChain.tokens[folksTokenId];
  if (!tokenData)
    throw new Error(`Spoke Token not found for folksTokenId: ${folksTokenId}`);

  return tokenData;
}

export function isFolksTokenSupported(
  folksTokenId: FolksTokenId,
  folksChainId: FolksChainId,
  network: NetworkType,
): boolean {
  const spokeChain = getSpokeChain(folksChainId, network);
  return doesSpokeSupportFolksToken(spokeChain, folksTokenId);
}

export function assertSpokeChainSupportFolksToken(
  folksChainId: FolksChainId,
  folksTokenId: FolksTokenId,
  network: NetworkType,
) {
  if (!isFolksTokenSupported(folksTokenId, folksChainId, network))
    throw new Error(
      `Folks Token ${folksTokenId} is not supported on Folks Chain ${folksChainId}`,
    );
}

export function getSpokeTokenDataTokenAddress(
  spokeTokenData: SpokeTokenData,
): GenericAddress {
  if (spokeTokenData.tokenAddress) return spokeTokenData.tokenAddress;
  throw new Error(
    `Token address not found for spokeTokenData for folks token: ${spokeTokenData.folksTokenId} in spoke: ${spokeTokenData.spokeAddress}`,
  );
}

export function getSpokeChainAdapterAddress(
  folksChainId: FolksChainId,
  network: NetworkType,
  adapterType: AdapterType,
): GenericAddress {
  const spokeChain = getSpokeChain(folksChainId, network);
  const adapterAddress = spokeChain.adapters[adapterType];
  if (adapterAddress) return adapterAddress;
  throw new Error(
    `Adapter ${adapterType} not found for spoke chain ${folksChainId}`,
  );
}

export function getAdapterAddress(
  folksChainId: FolksChainId,
  network: NetworkType,
  adapterType: AdapterType,
) {
  if (isHubChain(folksChainId, network))
    return getHubChainAdapterAddress(network, adapterType);
  return getSpokeChainAdapterAddress(folksChainId, network, adapterType);
}

export function getSignerGenericAddress(
  folksChainSigner: FolksChainSigner,
): GenericAddress {
  const chainType = folksChainSigner.chainType;
  switch (chainType) {
    case ChainType.EVM:
      return convertToGenericAddress(
        getEvmSignerAddress(folksChainSigner.signer),
        chainType,
      );
    default:
      return exhaustiveCheck(chainType);
  }
}

export function assertHubChainSelected(
  folksChainId: FolksChainId,
  network: NetworkType,
) {
  if (!isHubChain(folksChainId, network))
    throw new Error(
      `Wrong chain selected: ${folksChainId}. Expected Hub chain`,
    );
}
