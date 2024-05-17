import { getContract } from "viem";
import type { Address, PublicClient, WalletClient } from "viem";
import {
  AccountManagerAbi,
  BridgeRouterHubAbi,
} from "../../chains/evm/constants/abi/index.js";
import type { GetReadContractReturnType } from "../../chains/evm/types/index.js";
import { ChainType, type GenericAddress } from "../../common/types/chain.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";

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

export function getBridgeRouterHubContract(
  provider: PublicClient,
  address: GenericAddress,
) {
  return getContract({
    abi: BridgeRouterHubAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}
