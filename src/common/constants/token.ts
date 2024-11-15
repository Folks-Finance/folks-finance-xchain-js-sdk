import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID } from "../types/token.js";

import type { FolksTokenId } from "../types/token.js";

export const CROSS_CHAIN_FOLKS_TOKEN_ID: Array<FolksTokenId> = [
  MAINNET_FOLKS_TOKEN_ID.USDC,
  MAINNET_FOLKS_TOKEN_ID.SolvBTC,
  TESTNET_FOLKS_TOKEN_ID.USDC,
];
