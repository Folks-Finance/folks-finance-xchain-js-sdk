import { multicall } from "viem/actions";

import { getFolksChainIdsByNetwork } from "../../../../common/utils/chain.js";
import { getHubChain } from "../utils/chain.js";
import { getAccountManagerContract } from "../utils/contract.js";

import type {
  NetworkType,
  FolksChainId,
} from "../../../../common/types/chain.js";
import type { AccountInfo } from "../types/account.js";
import type { Address, Client, Hex } from "viem";

export async function getAccountInfo(
  provider: Client,
  network: NetworkType,
  accountId: Hex,
  folksChainIds?: Array<FolksChainId>,
): Promise<AccountInfo> {
  const hubChain = getHubChain(network);
  const accountManager = getAccountManagerContract(
    provider,
    hubChain.accountManagerAddress,
  );
  // get chain ids to check
  folksChainIds = folksChainIds
    ? folksChainIds
    : getFolksChainIdsByNetwork(network);
  // define return variable
  const accountInfo: AccountInfo = {
    registered: new Map(),
    invited: new Map(),
  };

  // query for registered and invited addresses on each respective chain
  const registeredAddresses = await multicall(provider, {
    contracts: folksChainIds.map((folksChainId) => ({
      address: accountManager.address,
      abi: accountManager.abi,
      functionName: "getAddressRegisteredToAccountOnChain",
      args: [accountId, folksChainId],
    })),
    allowFailure: true,
  });

  const invitedAddresses = await multicall(provider, {
    contracts: folksChainIds.map((folksChainId) => ({
      address: accountManager.address,
      abi: accountManager.abi,
      functionName: "getAddressInvitedToAccountOnChain",
      args: [accountId, folksChainId],
    })),
    allowFailure: true,
  });

  for (const [index, result] of registeredAddresses.entries()) {
    const chainId = folksChainIds[index];
    if (result.status === "success")
      accountInfo.registered.set(chainId, result.result as Address);
  }
  for (const [index, result] of invitedAddresses.entries()) {
    const chainId = folksChainIds[index];
    if (result.status === "success")
      accountInfo.invited.set(chainId, result.result as Address);
  }

  return accountInfo;
}
