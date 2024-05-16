import type { FolksTokenId } from "../common/index.js";
import type { GenericAddress, IFolksChain } from "../common/index.js";
import type { HubTokenData } from "./token.js";

export interface HubChain extends IFolksChain {
  hubAddress: GenericAddress;
  bridgeRouterAddress: GenericAddress;
  spokeManagerAddress: GenericAddress;
  accountManagerAddress: GenericAddress;
  loanManagerAddress: GenericAddress;
  tokens: Record<FolksTokenId, HubTokenData>;
}
