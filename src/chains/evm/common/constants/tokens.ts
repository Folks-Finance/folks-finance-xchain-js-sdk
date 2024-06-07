import { FolksTokenId } from "../../../../common/types/token.js";

import { EVM_FOLKS_CHAIN_ID } from "./chain.js";

import type { EvmFolksChainId } from "../types/chain.js";
import type { Erc20ContractSlot } from "../types/tokens.js";

export const CONTRACT_SLOT: Partial<
  Record<
    EvmFolksChainId,
    { folksToken: Partial<Record<FolksTokenId, Erc20ContractSlot>> }
  >
> = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    folksToken: {
      [FolksTokenId.USDC]: {
        balanceOf: 0n,
        allowance: 0n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    folksToken: {
      [FolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    folksToken: {
      [FolksTokenId.USDC]: {
        balanceOf: 0n,
        allowance: 0n,
      },
    },
  },
} as const;
