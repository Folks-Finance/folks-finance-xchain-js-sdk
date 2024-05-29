import { getContract } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { ERC20Abi } from "../constants/abi/erc-20-abi.js";
import { WormholeDataAdapterAbi } from "../constants/abi/wormhole-data-adapter-abi.js";

import { getSignerAccount, getSignerAddress } from "./chain.js";

import type { GenericAddress } from "../../../../common/types/chain.js";
import type { GetReadContractReturnType } from "../types/contract.js";
import type { Address, Client, WalletClient } from "viem";

export function getERC20Contract(
  provider: Client,
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
  provider: Client,
  address: GenericAddress,
  signer: WalletClient,
  receiver: Address,
  amount: bigint,
) {
  const erc20 = getERC20Contract(provider, address, signer);
  const allowance = await erc20.read.allowance([
    getSignerAddress(signer),
    receiver,
  ]);

  // approve if not enough
  if (allowance < amount)
    return await erc20.write.approve([receiver, BigInt(amount)], {
      account: getSignerAccount(signer),
      chain: signer.chain,
    });
}

export function getWormholeDataAdapterContract(
  provider: Client,
  address: Address,
): GetReadContractReturnType<typeof WormholeDataAdapterAbi> {
  return getContract({
    abi: WormholeDataAdapterAbi,
    address: convertFromGenericAddress<ChainType.EVM>(address, ChainType.EVM),
    client: { public: provider },
  });
}
