import type { Address, WalletClient } from "viem";

export function getSignerAddress(signer: WalletClient): Address {
  if (signer.account?.address) return signer.account.address;
  throw new Error("EVM Signer address is not set");
}
