import type {
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
} from "viem";
import { getContract } from "viem";
import {
  BridgeRouterHubAbi,
  BridgeRouterSpokeAbi,
  ERC20Abi,
  SpokeCommonAbi,
  SpokeTokenAbi,
} from "../../constants/evm/abi/index.js";
import type { GetReadContractReturnType } from "../../type/evm/index.js";
import { getSignerAddress } from "./chain.js";
import { ChainType } from "../../type/common/index.js";
import type { GenericAddress } from "../../type/common/index.js";
import { convertFromGenericAddress } from "../common/address.js";

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

export function getBridgeRouterHubContract(
  provider: PublicClient,
  address: GenericAddress,
  signer?: WalletClient,
) {
  return getContract({
    abi: BridgeRouterHubAbi,
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

export function getERC20Contract(
  provider: PublicClient,
  address: GenericAddress,
  signer: WalletClient,
) {
  return getContract({
    abi: ERC20Abi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}

export async function sendERC20Approve(
  provider: PublicClient,
  address: GenericAddress,
  signer: WalletClient,
  receiver: Address,
  amount: bigint,
) {
  const sender = getSignerAddress(signer);

  const erc20 = getERC20Contract(provider, address, signer);
  const allowance = await erc20.read.allowance([sender, receiver]);

  // approve if not enough
  if (allowance < amount)
    return await erc20.write.approve([receiver, BigInt(amount)], {
      account: sender,
      chain: signer.chain,
    });
}
