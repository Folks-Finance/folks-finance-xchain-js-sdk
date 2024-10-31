import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID } from "../types/token.js";

import type { FolksTokenId } from "../types/token.js";

export const CIRCLE_FOLKS_TOKEN_ID: Array<FolksTokenId> = [MAINNET_FOLKS_TOKEN_ID.USDC, TESTNET_FOLKS_TOKEN_ID.USDC];
export const CCIP_FOLKS_TOKEN_ID: Array<FolksTokenId> = [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM];

export const BRIDGED_FOLKS_TOKEN_ID: Array<FolksTokenId> = [...CIRCLE_FOLKS_TOKEN_ID, ...CCIP_FOLKS_TOKEN_ID];
