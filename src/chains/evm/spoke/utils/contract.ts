import { getContract } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { BridgeRouterSpokeAbi } from "../constants/abi/bridge-router-spoke-abi.js";
import { SpokeCommonAbi } from "../constants/abi/spoke-common-abi.js";
import { SpokeTokenAbi } from "../constants/abi/spoke-token-abi.js";

import type { GenericAddress } from "../../../../common/types/chain.js";
import type { GetReadContractReturnType } from "../../common/types/contract.js";
import type { GetContractReturnType, PublicClient, WalletClient } from "viem";

export function getSpokeCommonContract(
  provider: PublicClient,
  address: GenericAddress,
): GetReadContractReturnType<typeof SpokeCommonAbi>;
export function getSpokeCommonContract(
  provider: PublicClient,
  address: GenericAddress,
  signer: WalletClient,
): GetContractReturnType<typeof SpokeCommonAbi, PublicClient>;
export function getSpokeCommonContract(
  provider: PublicClient,
  address: GenericAddress,
  signer?: WalletClient,
) {
  return getContract({
    abi: SpokeCommonAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}

export function getBridgeRouterSpokeContract(
  provider: PublicClient,
  address: GenericAddress,
  signer?: WalletClient,
): GetReadContractReturnType<typeof BridgeRouterSpokeAbi> {
  return getContract({
    abi: BridgeRouterSpokeAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}

export function getSpokeTokenContract(
  provider: PublicClient,
  address: GenericAddress,
): GetReadContractReturnType<typeof SpokeTokenAbi>;
export function getSpokeTokenContract(
  provider: PublicClient,
  address: GenericAddress,
  signer: WalletClient,
): GetContractReturnType<typeof SpokeTokenAbi, PublicClient>;
export function getSpokeTokenContract(
  provider: PublicClient,
  address: GenericAddress,
  signer?: WalletClient,
) {
  return getContract({
    abi: SpokeTokenAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}
