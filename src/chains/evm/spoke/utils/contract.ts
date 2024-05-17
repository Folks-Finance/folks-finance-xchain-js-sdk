import type { GetContractReturnType, PublicClient, WalletClient } from "viem";
import { getContract } from "viem";
import {
  BridgeRouterSpokeAbi,
  SpokeCommonAbi,
  SpokeTokenAbi,
} from "../constants/abi/index.js";
import { ChainType } from "../../../../common/types/index.js";
import type { GenericAddress } from "../../../../common/types/index.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import type { GetReadContractReturnType } from "../../common/types/contract.js";

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
) {
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
