import type { Account, Address, WalletClient } from "viem";

export function getSignerAddress(signer: WalletClient): Address {
  if (signer.account?.address) return signer.account.address;
  throw new Error("EVM Signer address is not set");
}

export function getSignerAccount(signer: WalletClient): Account {
  if (signer.account) return signer.account;
  throw new Error("EVM Signer account is not set");
}
