import { EVM_FOLKS_CHAIN_ID } from "../constants/chain.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { EvmChainId } from "../types/chain.js";
import type { Account, WalletClient } from "viem";

export function getEvmSignerAddress(signer: WalletClient): EvmAddress {
  if (signer.account?.address) return signer.account.address as EvmAddress;
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
