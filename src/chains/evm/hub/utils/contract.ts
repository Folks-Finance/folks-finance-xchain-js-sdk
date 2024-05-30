import { getContract } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { AccountManagerAbi } from "../constants/abi/account-manager-abi.js";
import { BridgeRouterHubAbi } from "../constants/abi/bridge-router-hub-abi.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { GetReadContractReturnType } from "../../common/types/contract.js";
import type { Client, WalletClient } from "viem";

export function getAccountManagerContract(
  provider: Client,
  address: GenericAddress,
  signer?: WalletClient,
): GetReadContractReturnType<typeof AccountManagerAbi> {
  return getContract({
    abi: AccountManagerAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}

export function getBridgeRouterHubContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof BridgeRouterHubAbi> {
  return getContract({
    abi: BridgeRouterHubAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}
