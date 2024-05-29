import { EVM_FOLKS_CHAIN_ID } from "../constants/chain.js";

import type { EvmChainId } from "../types/chain.js";
import type { Account, Address, WalletClient } from "viem";

export function getEvmSignerAddress(signer: WalletClient): Address {
  if (signer.account?.address) return signer.account.address;
  throw new Error("EVM Signer address is not set");
}

export function getEvmSignerAccount(signer: WalletClient): Account {
  if (signer.account) return signer.account;
  throw new Error("EVM Signer account is not set");
}

export const isEvmChainId = (chainId: number): chainId is EvmChainId => {
  // @ts-expect-error -- this is made on purpose to have the type predicate
  return Object.values(EVM_FOLKS_CHAIN_ID).includes(chainId);
};
