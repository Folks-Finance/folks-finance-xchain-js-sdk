import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID } from "../../../../common/types/token.js";

import { EVM_FOLKS_CHAIN_ID } from "./chain.js";

import type { FolksTokenId } from "../../../../common/types/token.js";
import type { EvmFolksChainId } from "../types/chain.js";
import type { Erc20ContractSlot } from "../types/tokens.js";

export const CONTRACT_SLOT: Partial<
  Record<EvmFolksChainId, { erc20: Partial<Record<FolksTokenId, Erc20ContractSlot>> }>
> = {
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: {
    erc20: {
      [MAINNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MAINNET_FOLKS_TOKEN_ID.sAVAX]: {
        balanceOf: 203n,
        allowance: 204n,
      },
      [MAINNET_FOLKS_TOKEN_ID.wETH_ava]: {
        balanceOf: 0n,
        allowance: 1n,
      },
      [MAINNET_FOLKS_TOKEN_ID.BTCb_ava]: {
        balanceOf: 0n,
        allowance: 1n,
      },
      [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
        balanceOf: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222592"),
        allowance: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222593"),
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: {
    erc20: {
      [MAINNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MAINNET_FOLKS_TOKEN_ID.wBTC_eth]: {
        balanceOf: 0n,
        allowance: 2n,
      },
      [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
        balanceOf: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222592"),
        allowance: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222593"),
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE]: {
    erc20: {
      [MAINNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MAINNET_FOLKS_TOKEN_ID.cbBTC_base]: {
        balanceOf: 1n,
        allowance: 2n,
      },
      [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
        balanceOf: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222592"),
        allowance: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222593"),
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BSC]: {
    erc20: {
      [MAINNET_FOLKS_TOKEN_ID.ETHB_bsc]: {
        balanceOf: 1n,
        allowance: 2n,
      },
      [MAINNET_FOLKS_TOKEN_ID.BTCB_bsc]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
        balanceOf: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222592"),
        allowance: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222593"),
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: {
    erc20: {
      [MAINNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [MAINNET_FOLKS_TOKEN_ID.ARB]: {
        balanceOf: 51n,
        allowance: 52n,
      },
      [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
        balanceOf: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222592"),
        allowance: BigInt("37439836327923360225337895871394760624280537466773280374265222508165906222593"),
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    erc20: {
      [TESTNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    erc20: {
      [TESTNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
    erc20: {
      [TESTNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
    },
  },
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    erc20: {
      [TESTNET_FOLKS_TOKEN_ID.USDC]: {
        balanceOf: 9n,
        allowance: 10n,
      },
      [TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep]: {
        balanceOf: 0n,
        allowance: 1n,
      },
    },
  },
} as const;
