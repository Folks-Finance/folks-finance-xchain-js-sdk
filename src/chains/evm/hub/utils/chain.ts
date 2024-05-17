import { HUB_CHAIN } from "../constants/index.js";
import type {
  FolksTokenId,
  LoanType,
  NetworkType,
} from "../../../../common/types/index.js";
import type { FolksChainId } from "../../../../common/types/index.js";
import type { HubChain, HubTokenData } from "../types/index.js";

export function isHubChain(
  folksChainId: FolksChainId,
  network: NetworkType,
): boolean {
  return HUB_CHAIN[network].folksChainId === folksChainId;
}

export function getHubChain(network: NetworkType): HubChain {
  return HUB_CHAIN[network];
}

export function getHubTokenData(
  folksTokenId: FolksTokenId,
  network: NetworkType,
): HubTokenData {
  const token = HUB_CHAIN[network].tokens[folksTokenId];
  return token;
}

export function isLoanTypeSupported(
  loanType: LoanType,
  folksTokenId: FolksTokenId,
  network: NetworkType,
): boolean {
  const token = getHubTokenData(folksTokenId, network);
  return token.supportedLoanTypes.has(loanType);
}

export function assertLoanTypeSupported(
  loanType: LoanType,
  folksTokenId: FolksTokenId,
  network: NetworkType,
): void {
  if (!isLoanTypeSupported(loanType, folksTokenId, network))
    throw new Error(
      `Loan type ${loanType} is not supported for folksTokenId: ${folksTokenId}`,
    );
}
