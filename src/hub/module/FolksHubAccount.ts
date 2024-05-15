import { Address, Hex, PublicClient } from "viem";
import { FolksChainId, NetworkType } from "../../type/common";
import { AccountInfo } from "../../type/hub";
import { FolksChainUtil } from "../../util/common";
import { HubChainUtil, HubContractUtil } from "../../util/hub";

export class FolksHubAccount {
  static async getAccountInfo(
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    folksChainIds?: FolksChainId[]
  ): Promise<AccountInfo> {
    const hubChain = HubChainUtil.getHubChain(network);
    const accountManager = HubContractUtil.getAccountManagerContract(provider, hubChain.accountManagerAddress);
    // get chain ids to check
    folksChainIds = folksChainIds ? folksChainIds : FolksChainUtil.getFolksChainIdsByNetwork(network);
    // define return variable
    const accountInfo: AccountInfo = { registered: new Map(), invited: new Map() };

    // query for registered and invited addresses on each respective chain
    const registeredAddresses = await provider.multicall({
      contracts: folksChainIds.map((folksChainId) => ({
        address: accountManager.address,
        abi: accountManager.abi,
        functionName: "getAddressRegisteredToAccountOnChain",
        args: [accountId, folksChainId],
      })),
      allowFailure: true,
    });

    const invitedAddresses = await provider.multicall({
      contracts: folksChainIds.map((folksChainId) => ({
        address: accountManager.address,
        abi: accountManager.abi,
        functionName: "getAddressInvitedToAccountOnChain",
        args: [accountId, folksChainId],
      })),
      allowFailure: true,
    });

    registeredAddresses.forEach((result, index) => {
      const chainId = folksChainIds[index];
      if (result.status === "success") accountInfo.registered.set(chainId, result.result as Address);
    });
    invitedAddresses.forEach((result, index) => {
      const chainId = folksChainIds[index];
      if (result.status === "success") accountInfo.invited.set(chainId, result.result as Address);
    });

    return accountInfo;
  }
}
