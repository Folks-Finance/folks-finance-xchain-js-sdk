import { FOLKS_CHAIN_ID } from "../../../../common/constants/index.js";
import { NetworkType } from "../../../../common/types/index.js";

import type { FolksTokenId } from "../../../../common/types/index.js";
import type { HubChain, HubTokenData } from "../types/index.js";

export const HUB_CHAIN: Record<NetworkType, HubChain> = {
  [NetworkType.MAINNET]: {
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE,
    hubAddress: "0x",
    bridgeRouterAddress: "0x",
    spokeManagerAddress: "0x",
    accountManagerAddress: "0x",
    loanManagerAddress: "0x",
    tokens: {} as Record<FolksTokenId, HubTokenData>,
  },
  [NetworkType.TESTNET]: {
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    hubAddress: "0x",
    bridgeRouterAddress: "0x",
    spokeManagerAddress: "0x",
    accountManagerAddress: "0x",
    loanManagerAddress: "0x",
    tokens: {} as Record<FolksTokenId, HubTokenData>,
  },
};
