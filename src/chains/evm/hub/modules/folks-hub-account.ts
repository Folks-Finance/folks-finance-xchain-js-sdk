import { multicall } from "viem/actions";

import { getFolksChainIdsByNetwork } from "../../../../common/utils/chain.js";
import { extractRevertErrorName } from "../../common/utils/contract.js";
import { getHubChain } from "../utils/chain.js";
import { getAccountManagerContract } from "../utils/contract.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type {
  FolksChainId,
  NetworkType,
} from "../../../../common/types/chain.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type { AccountIdByAddress, AccountInfo } from "../types/account.js";
import type { Client } from "viem";

export async function getAccountInfo(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
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
    registered: new Map<FolksChainId, GenericAddress>(),
    invited: new Map<FolksChainId, GenericAddress>(),
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
      accountInfo.registered.set(chainId, result.result as GenericAddress);
  }
  for (const [index, result] of invitedAddresses.entries()) {
    const chainId = folksChainIds[index];
    if (result.status === "success")
      accountInfo.invited.set(chainId, result.result as GenericAddress);
  }

  return accountInfo;
}

export async function getAccountIdByAddress(
  provider: Client,
  network: NetworkType,
  address: GenericAddress,
  folksChainIds?: Array<FolksChainId>,
): Promise<AccountIdByAddress> {
  const hubChain = getHubChain(network);
  const accountManager = getAccountManagerContract(
    provider,
    hubChain.accountManagerAddress,
  );

  // get chain ids to check
  folksChainIds = folksChainIds
    ? folksChainIds
    : getFolksChainIdsByNetwork(network);

  const accountIds = await multicall(provider, {
    contracts: folksChainIds.map((folksChainId) => ({
      address: accountManager.address,
      abi: accountManager.abi,
      functionName: "getAccountIdOfAddressOnChain",
      args: [address, folksChainId],
    })),
    allowFailure: true,
  });

  const accountIdByAddress: AccountIdByAddress = [];

  for (const [index, result] of accountIds.entries()) {
    const folksChainId = folksChainIds[index];
    if (result.status === "success")
      accountIdByAddress.push({
        accountId: result.result as AccountId,
        folksChainId,
      });
  }

  return accountIdByAddress;
}

export async function getAccountIdByAddressOnChain(
  provider: Client,
  network: NetworkType,
  address: GenericAddress,
  folksChainId: FolksChainId,
): Promise<AccountId | null> {
  const hubChain = getHubChain(network);
  const accountManager = getAccountManagerContract(
    provider,
    hubChain.accountManagerAddress,
  );

  try {
    const accountId = await accountManager.read.getAccountIdOfAddressOnChain([
      address,
      folksChainId,
    ]);
    return accountId as AccountId;
  } catch (err: unknown) {
    const errorName = extractRevertErrorName(err);
    if (errorName === "NoAccountRegisteredTo") return null;
    throw err;
  }
}
