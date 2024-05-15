import type { Address, Hex } from "viem";
import * as FolksHubAccount from "../../hub/module/FolksHubAccount.js";
import * as FolksEVMAccount from "../../spoke/evm/module/FolksEVMAccount.js";
import { ChainType } from "../../type/common/index.js";
import type {
  FolksChainId,
  MessageAdapters,
  PrepareAcceptInviteAddressCall,
  PrepareCreateAccountCall,
  PrepareInviteAddressCall,
  PrepareUnregisterAddressCall,
} from "../../type/common/index.js";
import { FolksCore } from "../core/FolksCore.js";
import { checkAdapterSupportsDataMessage } from "../../util/common/adapter.js";
import { checkSpokeChainSupported } from "../../util/common/chain.js";

export const prepare = {
  async createAccount(accountId: Hex, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.prepare.createAccount(
          folksChain.folksChainId,
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          folksChain.network,
          accountId,
          adapters
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },

  async inviteAddress(
    accountId: Hex,
    folksChainIdToInvite: FolksChainId,
    addressToInvite: Address,
    adapters: MessageAdapters
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.prepare.inviteAddress(
          folksChain.folksChainId,
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          folksChain.network,
          accountId,
          folksChainIdToInvite,
          addressToInvite,
          adapters
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },

  async acceptInvite(accountId: Hex, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.prepare.acceptInvite(
          folksChain.folksChainId,
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          folksChain.network,
          accountId,
          adapters
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },

  async unregisterAddress(accountId: Hex, folksChainIdToUnregister: FolksChainId, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.prepare.unregisterAddress(
          folksChain.folksChainId,
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          folksChain.network,
          accountId,
          folksChainIdToUnregister,
          adapters
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },
};

export const write = {
  async createAccount(accountId: Hex, prepareCall: PrepareCreateAccountCall) {
    if (!FolksCore.getSigner()) throw new Error("Signer is not set");
    const folksChain = FolksCore.getSelectedFolksChain();

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.write.createAccount(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          prepareCall
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },

  async inviteAddress(
    accountId: Hex,
    folksChainIdToInvite: number,
    addressToInvite: Address,
    prepareCall: PrepareInviteAddressCall
  ) {
    if (!FolksCore.getSigner()) throw new Error("Signer is not set");
    const folksChain = FolksCore.getSelectedFolksChain();

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.write.inviteAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          folksChainIdToInvite,
          addressToInvite,
          prepareCall
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },

  async acceptInvite(accountId: Hex, prepareCall: PrepareAcceptInviteAddressCall) {
    if (!FolksCore.getSigner()) throw new Error("Signer is not set");
    const folksChain = FolksCore.getSelectedFolksChain();

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.write.acceptInvite(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          prepareCall
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },

  async unregisterAddress(
    accountId: Hex,
    folksChainIdToUnregister: FolksChainId,
    prepareCall: PrepareUnregisterAddressCall
  ) {
    if (!FolksCore.getSigner()) throw new Error("Signer is not set");
    const folksChain = FolksCore.getSelectedFolksChain();

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMAccount.write.unregisterAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          folksChainIdToUnregister,
          prepareCall
        );
      default:
        throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
    }
  },
};

export const read = {
  async accountInfo(accountId: Hex, folksChainIds?: FolksChainId[]) {
    return FolksHubAccount.getAccountInfo(
      FolksCore.getHubProvider(),
      FolksCore.getSelectedNetwork(),
      accountId,
      folksChainIds
    );
  },
};
