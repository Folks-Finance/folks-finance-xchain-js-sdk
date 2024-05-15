import { FolksTokenId, GenericAddress, IFolksChain } from "../common";
import { HubTokenData } from "./token";

export interface HubChain extends IFolksChain {
  hubAddress: GenericAddress;
  bridgeRouterAddress: GenericAddress;
  spokeManagerAddress: GenericAddress;
  accountManagerAddress: GenericAddress;
  loanManagerAddress: GenericAddress;
  tokens: Record<FolksTokenId, HubTokenData>;
}
