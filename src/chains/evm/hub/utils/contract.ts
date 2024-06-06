import { getContract } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { AccountManagerAbi } from "../constants/abi/account-manager-abi.js";
import { BridgeRouterHubAbi } from "../constants/abi/bridge-router-hub-abi.js";
import { HubAbi } from "../constants/abi/hub-abi.js";
import { HubPoolAbi } from "../constants/abi/hub-pool-abi.js";
import { LoanManagerAbi } from "../constants/abi/loan-manager-abi.js";
import { OracleManagerAbi } from "../constants/abi/oracle-manager-abi.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { GetReadContractReturnType } from "../../common/types/contract.js";
import type { Client, GetContractReturnType, WalletClient } from "viem";

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

export function getHubPoolContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof HubPoolAbi> {
  return getContract({
    abi: HubPoolAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}

export function getLoanManagerContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof LoanManagerAbi> {
  return getContract({
    abi: LoanManagerAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}

export function getOracleManagerContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof OracleManagerAbi> {
  return getContract({
    abi: OracleManagerAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}

export function getHubContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof HubAbi>;
export function getHubContract(
  provider: Client,
  address: GenericAddress,
  signer: WalletClient,
): GetContractReturnType<typeof HubAbi, Client>;
export function getHubContract(
  provider: Client,
  address: GenericAddress,
  signer?: WalletClient,
):
  | GetReadContractReturnType<typeof HubAbi>
  | GetContractReturnType<typeof HubAbi, Client> {
  return getContract({
    abi: HubAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}
