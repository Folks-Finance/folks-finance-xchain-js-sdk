import { getContract } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import {
  AccountManagerAbi,
  BridgeRouterHubAbi,
} from "../constants/abi/index.js";

import type { GenericAddress } from "../../../../common/types/chain.js";
import type { GetReadContractReturnType } from "../../common/types/index.js";
import type { Address, PublicClient, WalletClient } from "viem";

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
): GetReadContractReturnType<typeof BridgeRouterHubAbi> {
  return getContract({
    abi: BridgeRouterHubAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}
