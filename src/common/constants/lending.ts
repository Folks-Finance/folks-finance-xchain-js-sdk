import { getEmptyBytes } from "../utils/bytes.js";

import { BYTES32_LENGTH } from "./bytes.js";

import type { AccountId } from "../types/lending.js";

export const NULL_ACCOUNT_ID: AccountId = getEmptyBytes(BYTES32_LENGTH) as AccountId;
