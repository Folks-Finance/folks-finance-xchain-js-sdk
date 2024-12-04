import { NetworkType } from "../types/chain.js";
import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID } from "../types/token.js";

import type { FolksTokenId, MainnetFolksTokenId, TestnetFolksTokenId } from "../types/token.js";

export const MAINNET_POOLS = {
  [MAINNET_FOLKS_TOKEN_ID.USDC]: 1,
  [MAINNET_FOLKS_TOKEN_ID.AVAX]: 2,
  [MAINNET_FOLKS_TOKEN_ID.sAVAX]: 3,
  [MAINNET_FOLKS_TOKEN_ID.ETH_eth]: 4,
  [MAINNET_FOLKS_TOKEN_ID.ETH_base]: 5,
  [MAINNET_FOLKS_TOKEN_ID.wETH_ava]: 6,
  [MAINNET_FOLKS_TOKEN_ID.wBTC_eth]: 7,
  [MAINNET_FOLKS_TOKEN_ID.BTCb_ava]: 8,
  [MAINNET_FOLKS_TOKEN_ID.cbBTC_base]: 9,
  [MAINNET_FOLKS_TOKEN_ID.BNB]: 10,
  [MAINNET_FOLKS_TOKEN_ID.ETHB_bsc]: 11,
  [MAINNET_FOLKS_TOKEN_ID.BTCB_bsc]: 12,
  [MAINNET_FOLKS_TOKEN_ID.ETH_arb]: 13,
  [MAINNET_FOLKS_TOKEN_ID.ARB]: 14,
  [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: 15,
} as const satisfies Record<MainnetFolksTokenId, number>;

export const TESTNET_POOLS = {
  [TESTNET_FOLKS_TOKEN_ID.USDC]: 128,
  [TESTNET_FOLKS_TOKEN_ID.AVAX]: 129,
  [TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep]: 130,
  [TESTNET_FOLKS_TOKEN_ID.ETH_base_sep]: 131,
  [TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep]: 132,
  [TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep]: 133,
  [TESTNET_FOLKS_TOKEN_ID.BNB]: 134,
  [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM]: 135,
} as const satisfies Record<TestnetFolksTokenId, number>;

const MAINNET_FOLKS_TOKEN_IDS_FROM_POOL = Object.fromEntries(
  Object.entries(MAINNET_POOLS).map(([token, poolId]) => [poolId, token]),
) as Partial<Record<number, FolksTokenId>>;

const TESTNET_FOLKS_TOKEN_IDS_FROM_POOL = Object.fromEntries(
  Object.entries(TESTNET_POOLS).map(([token, poolId]) => [poolId, token]),
) as Partial<Record<number, FolksTokenId>>;

export const FOLKS_TOKEN_IDS_FROM_POOL_BY_NETWORK = {
  [NetworkType.MAINNET]: MAINNET_FOLKS_TOKEN_IDS_FROM_POOL,
  [NetworkType.TESTNET]: TESTNET_FOLKS_TOKEN_IDS_FROM_POOL,
} as Record<NetworkType, Partial<Record<number, FolksTokenId>>>;
