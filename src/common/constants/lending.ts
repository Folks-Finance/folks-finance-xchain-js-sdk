import { getAccountIdBytes } from "../utils/bytes.js";

import type { AccountId } from "../types/lending.js";

export const NULL_ACCOUNT_ID = getAccountIdBytes("") as AccountId;
