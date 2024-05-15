import { HUB_CHAIN } from "../../constants/hub/index.js";
import { FolksTokenId, LoanType, NetworkType } from "../../type/common/index.js";
import type { FolksChainId } from "../../type/common/index.js";
import type { HubChain, HubTokenData } from "../../type/hub/index.js";

export namespace HubChainUtil {
  export function isHubChainNetworkSupported(network: NetworkType): boolean {
    return HUB_CHAIN.hasOwnProperty(network);
  }

  export function checkHubChainNetworkSupported(network: NetworkType) {
    if (!isHubChainNetworkSupported(network)) throw new Error(`Hub chain is not supported for network: ${network}`);
  }

  export function isHubChain(folksChainId: FolksChainId, network: NetworkType): boolean {
    checkHubChainNetworkSupported(network);
    return HUB_CHAIN[network].folksChainId === folksChainId;
  }

  export function getHubChain(network: NetworkType): HubChain {
    if (isHubChainNetworkSupported(network)) return HUB_CHAIN[network];
    throw new Error(`Invalid hub network: ${network}`);
  }

  export function getHubTokenData(folksTokenId: FolksTokenId, network: NetworkType): HubTokenData {
    const token = HUB_CHAIN[network].tokens[folksTokenId];
    if (token) return token;
    throw new Error(`Token not found for folksTokenId: ${folksTokenId}`);
  }

  export function isLoanTypeSupported(loanType: LoanType, folksTokenId: FolksTokenId, network: NetworkType): boolean {
    const token = getHubTokenData(folksTokenId, network);
    return token.supportedLoanTypes.has(loanType);
  }

  export function checkLoanTypeSupported(loanType: LoanType, folksTokenId: FolksTokenId, network: NetworkType): void {
    if (!isLoanTypeSupported(loanType, folksTokenId, network))
      throw new Error(`Loan type ${loanType} is not supported for folksTokenId: ${folksTokenId}`);
  }
}
