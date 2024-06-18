import { CIRCLE_FOLKS_TOKEN_ID } from "../constants/token.js";

import type { FolksTokenId } from "../types/token.js";

export function isCircleToken(folksTokenId: FolksTokenId): boolean {
  return CIRCLE_FOLKS_TOKEN_ID.includes(folksTokenId);
}
