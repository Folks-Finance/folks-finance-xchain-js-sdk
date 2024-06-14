import { BaseError, ContractFunctionRevertedError, encodeAbiParameters, getContract, keccak256 } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { CCIPDataAdapterAbi } from "../constants/abi/ccip-data-adapter-abi.js";
import { ERC20Abi } from "../constants/abi/erc-20-abi.js";
import { WormholeDataAdapterAbi } from "../constants/abi/wormhole-data-adapter-abi.js";

import { getEvmSignerAccount, getEvmSignerAddress } from "./chain.js";

import type { EvmAddress, GenericAddress } from "../../../../common/types/address.js";
import type { GetReadContractReturnType } from "../types/contract.js";
import type { Client, Hex, WalletClient } from "viem";

export function getERC20Contract(provider: Client, address: GenericAddress, signer: WalletClient) {
  return getContract({
    abi: ERC20Abi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { wallet: signer, public: provider },
  });
}

export async function sendERC20Approve(
  provider: Client,
  address: GenericAddress,
  signer: WalletClient,
  spender: EvmAddress,
  amount: bigint,
): Promise<Hex | null> {
  const erc20 = getERC20Contract(provider, address, signer);
  const allowance = await erc20.read.allowance([getEvmSignerAddress(signer), spender]);

  // approve if not enough
  if (allowance < amount)
    return await erc20.write.approve([spender, BigInt(amount)], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
    });
  return null;
}

export function getWormholeDataAdapterContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof WormholeDataAdapterAbi> {
  return getContract({
    abi: WormholeDataAdapterAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}

export function getCCIPDataAdapterContract(
  provider: Client,
  address: GenericAddress,
): GetReadContractReturnType<typeof CCIPDataAdapterAbi> {
  return getContract({
    abi: CCIPDataAdapterAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}

export function extractRevertErrorName(err: unknown): string | undefined {
  if (err instanceof BaseError) {
    const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError && revertError.data?.errorName) {
      return revertError.data.errorName;
    }
  }
}

export function getBalanceOfSlotHash(address: EvmAddress, slot: bigint) {
  return keccak256(encodeAbiParameters([{ type: "address" }, { type: "uint256" }], [address, slot]));
}

export function getAllowanceSlotHash(owner: EvmAddress, spender: EvmAddress, slot: bigint) {
  return keccak256(
    encodeAbiParameters(
      [{ type: "address" }, { type: "bytes32" }],
      [spender, keccak256(encodeAbiParameters([{ type: "address" }, { type: "uint256" }], [owner, slot]))],
    ),
  );
}
