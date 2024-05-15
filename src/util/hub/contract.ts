import { Address, PublicClient, WalletClient, getContract } from "viem";
import { AccountManagerAbi } from "../../constants/evm/abi";
import { GetReadContractReturnType } from "../../type/evm";

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
