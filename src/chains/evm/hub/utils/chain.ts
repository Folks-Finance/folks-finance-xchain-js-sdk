import { HUB_CHAIN } from "../constants/chain.js";

import type { FolksChainId, NetworkType } from "../../../../common/types/chain.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { HubChain } from "../types/chain.js";
import type { HubTokenData } from "../types/token.js";

export function isHubChain(folksChainId: FolksChainId, network: NetworkType): boolean {
  return HUB_CHAIN[network].folksChainId === folksChainId;
}

export function getHubChain(network: NetworkType): HubChain {
  return HUB_CHAIN[network];
}

export function getHubTokensData(network: NetworkType): Partial<Record<FolksTokenId, HubTokenData>> {
  return HUB_CHAIN[network].tokens;
}

export function getHubTokenData(folksTokenId: FolksTokenId, network: NetworkType): HubTokenData {
  const token = HUB_CHAIN[network].tokens[folksTokenId];
  if (!token) throw new Error(`Hub token not found for folksTokenId: ${folksTokenId}`);
  return token;
}

export function isLoanTypeSupported(loanType: LoanTypeId, folksTokenId: FolksTokenId, network: NetworkType): boolean {
  const token = getHubTokenData(folksTokenId, network);
  return token.supportedLoanTypes.has(loanType);
}

export function assertLoanTypeSupported(loanType: LoanTypeId, folksTokenId: FolksTokenId, network: NetworkType): void {
  if (!isLoanTypeSupported(loanType, folksTokenId, network))
    throw new Error(`Loan type ${loanType} is not supported for folksTokenId: ${folksTokenId}`);
}

export function getHubChainAdapterAddress(network: NetworkType, adapterType: AdapterType) {
  const hubChain = getHubChain(network);
  return hubChain.adapters[adapterType];
}
