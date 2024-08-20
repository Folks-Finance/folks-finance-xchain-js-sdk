import { FolksTokenId } from "../types/token.js";

export const MAINNET_POOLS = {} as const satisfies Partial<Record<FolksTokenId, number>>;

export const TESTNET_POOLS = {
  [FolksTokenId.USDC]: 128,
  [FolksTokenId.AVAX]: 129,
  [FolksTokenId.ETH_eth_sep]: 130,
  [FolksTokenId.ETH_base_sep]: 131,
  [FolksTokenId.ETH_arb_sep]: 132,
  [FolksTokenId.LINK_eth_sep]: 133,
  [FolksTokenId.BNB]: 134,
} as const satisfies Partial<Record<FolksTokenId, number>>;
