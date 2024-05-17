import { getContract } from "viem";
import type { Address, PublicClient, WalletClient } from "viem";
import { AccountManagerAbi } from "../../chains/evm/constants/abi/index.js";
import type { GetReadContractReturnType } from "../../chains/evm/type/index.js";

export function getAccountManagerContract(
  provider: PublicClient,
  address: Address,
  signer?: WalletClient,
): GetReadContractReturnType<typeof AccountManagerAbi> {
  return getContract({
    abi: AccountManagerAbi,
    address: address,
    client: { wallet: signer, public: provider },
  });
}
