import { MainnetFolksTokenId, TestnetFolksTokenId } from "../../../../common/types/token.js";

import { EVM_FOLKS_CHAIN_ID } from "./chain.js";

import type { FolksTokenId } from "../../../../common/types/token.js";
import type { EvmFolksChainId } from "../types/chain.js";
import type { Erc20ContractSlot } from "../types/tokens.js";

export const CONTRACT_SLOT: Partial<
  Record<EvmFolksChainId, { erc20: Partial<Record<FolksTokenId, Erc20ContractSlot>> }>
> = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: {
    erc20: {
      [MainnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MainnetFolksTokenId.sAVAX]: {
        balanceOf: 203n,
        allowance: 204n,
      },
      [MainnetFolksTokenId.wETH_ava]: {
        balanceOf: 0n,
        allowance: 1n,
      },
      [MainnetFolksTokenId.BTCb_ava]: {
        balanceOf: 0n,
        allowance: 1n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: {
    erc20: {
      [MainnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MainnetFolksTokenId.wBTC_eth]: {
        balanceOf: 0n,
        allowance: 1n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE]: {
    erc20: {
      [MainnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    erc20: {
      [TestnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    erc20: {
      [TestnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
    erc20: {
      [TestnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    erc20: {
      [TestnetFolksTokenId.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [TestnetFolksTokenId.LINK_eth_sep]: {
        balanceOf: 0n,
        allowance: 1n,
      },
    },
  },
} as const;
