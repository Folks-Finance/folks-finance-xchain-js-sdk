import { FolksTokenId } from "../../../../common/types/token.js";

import { EVM_FOLKS_CHAIN_ID } from "./chain.js";

import type { EvmFolksChainId } from "../types/chain.js";
import type { Erc20ContractSlot } from "../types/tokens.js";

export const CONTRACT_SLOT: Partial<
  Record<
    EvmFolksChainId,
    { erc20: Partial<Record<FolksTokenId, Erc20ContractSlot>> }
  >
> = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    erc20: {
      [FolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    erc20: {
      [FolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    erc20: {
      [FolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
} as const;
