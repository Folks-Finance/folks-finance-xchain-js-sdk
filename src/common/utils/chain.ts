import { FOLKS_CHAIN, SPOKE_CHAIN } from "../constants/chain.js";

import type {
  FolksChainId,
  NetworkType,
  FolksChain,
  SpokeChain,
  GenericAddress,
} from "../types/chain.js";
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
