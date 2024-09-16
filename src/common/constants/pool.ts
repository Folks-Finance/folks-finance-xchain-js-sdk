import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID } from "../types/token.js";

import type { FolksTokenId } from "../types/token.js";

export const MAINNET_POOLS = {
  [MAINNET_FOLKS_TOKEN_ID.USDC]: 1,
  [MAINNET_FOLKS_TOKEN_ID.AVAX]: 2,
  [MAINNET_FOLKS_TOKEN_ID.sAVAX]: 3,
  [MAINNET_FOLKS_TOKEN_ID.ETH_eth]: 4,
  [MAINNET_FOLKS_TOKEN_ID.ETH_base]: 5,
  [MAINNET_FOLKS_TOKEN_ID.wETH_ava]: 6,
  [MAINNET_FOLKS_TOKEN_ID.wBTC_eth]: 7,
  [MAINNET_FOLKS_TOKEN_ID.BTCb_ava]: 8,
} as const satisfies Partial<Record<FolksTokenId, number>>;

export const TESTNET_POOLS = {
  [TESTNET_FOLKS_TOKEN_ID.USDC]: 128,
  [TESTNET_FOLKS_TOKEN_ID.AVAX]: 129,
  [TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep]: 130,
  [TESTNET_FOLKS_TOKEN_ID.ETH_base_sep]: 131,
  [TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep]: 132,
  [TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep]: 133,
  [TESTNET_FOLKS_TOKEN_ID.BNB]: 134,
} as const satisfies Partial<Record<FolksTokenId, number>>;
