import type { HubTokenData } from "./token.js";
import type {
  AdapterType,
  FolksTokenId,
  GenericAddress,
  IFolksChain,
} from "../../../../common/types/index.js";

export type HubChain = {
  hubAddress: GenericAddress;
  bridgeRouterAddress: GenericAddress;
  adapters: Record<AdapterType, GenericAddress>;
  oracleManagerAddress: GenericAddress;
  spokeManagerAddress: GenericAddress;
  accountManagerAddress: GenericAddress;
  loanManagerAddress: GenericAddress;
  tokens: Record<FolksTokenId, HubTokenData>;
} & IFolksChain;
