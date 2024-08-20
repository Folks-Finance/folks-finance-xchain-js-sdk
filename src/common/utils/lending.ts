import { concat, keccak256 } from "viem";

import { UINT16_LENGTH } from "../constants/bytes.js";

import { convertNumberToBytes } from "./bytes.js";

import type { GenericAddress } from "../types/address.js";
import type { FolksChainId } from "../types/chain.js";
import type { AccountId, LoanId, Nonce } from "../types/lending.js";

export function isAccountId(accountId: AccountId): boolean {
  return accountId.length === 64 + 2;
}

export function generateAccountId(addr: GenericAddress, chainId: FolksChainId, nonce: Nonce): AccountId {
  return keccak256(concat([addr, convertNumberToBytes(chainId, UINT16_LENGTH), nonce])) as AccountId;
}

export function generateLoanId(accountId: AccountId, nonce: Nonce): LoanId {
  return keccak256(concat([accountId, nonce])) as LoanId;
}
