import { getContract } from "viem";
import type { Address, PublicClient, WalletClient } from "viem";
import { AccountManagerAbi } from "../../constants/evm/abi/index.js";
import type { GetReadContractReturnType } from "../../type/evm/index.js";

export namespace HubContractUtil {
  export function getAccountManagerContract(
    provider: PublicClient,
    address: Address,
    signer?: WalletClient
  ): GetReadContractReturnType<typeof AccountManagerAbi> {
    return getContract({
      abi: AccountManagerAbi,
      address: address,
      client: { wallet: signer, public: provider },
    });
  }
}
