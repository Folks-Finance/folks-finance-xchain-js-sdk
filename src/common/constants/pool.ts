import { MainnetFolksTokenId, TestnetFolksTokenId } from "../types/token.js";

import type { FolksTokenId } from "../types/token.js";

export const MAINNET_POOLS = {
  [MainnetFolksTokenId.USDC]: 1,
  [MainnetFolksTokenId.AVAX]: 2,
  [MainnetFolksTokenId.sAVAX]: 3,
  [MainnetFolksTokenId.ETH_eth]: 4,
  [MainnetFolksTokenId.ETH_base]: 5,
  [MainnetFolksTokenId.wETH_ava]: 6,
  [MainnetFolksTokenId.wBTC_eth]: 7,
  [MainnetFolksTokenId.BTCb_ava]: 8,
} as const satisfies Partial<Record<FolksTokenId, number>>;

export const TESTNET_POOLS = {
  [TestnetFolksTokenId.USDC]: 128,
  [TestnetFolksTokenId.AVAX]: 129,
  [TestnetFolksTokenId.ETH_eth_sep]: 130,
  [TestnetFolksTokenId.ETH_base_sep]: 131,
  [TestnetFolksTokenId.ETH_arb_sep]: 132,
  [TestnetFolksTokenId.LINK_eth_sep]: 133,
  [TestnetFolksTokenId.BNB]: 134,
} as const satisfies Partial<Record<FolksTokenId, number>>;
