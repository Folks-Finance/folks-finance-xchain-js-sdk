import type { HubTokenData } from "./token.js";
import type {
  FolksTokenId,
  GenericAddress,
  IFolksChain,
} from "../../../../common/types/index.js";

export type HubChain = {
  hubAddress: GenericAddress;
  bridgeRouterAddress: GenericAddress;
  spokeManagerAddress: GenericAddress;
  accountManagerAddress: GenericAddress;
  loanManagerAddress: GenericAddress;
  tokens: Record<FolksTokenId, HubTokenData>;
} & IFolksChain;
