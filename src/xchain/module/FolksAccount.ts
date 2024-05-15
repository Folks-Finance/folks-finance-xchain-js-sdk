import { Address, Hex } from "viem";
import { FolksHubAccount } from "../../hub/module/FolksHubAccount";
import { FolksEVMAccount } from "../../spoke/evm/module/FolksEVMAccount";
import {
  ChainType,
  FolksChainId,
  MessageAdapters,
  PrepareAcceptInviteAddressCall,
  PrepareCreateAccountCall,
  PrepareInviteAddressCall,
  PrepareUnregisterAddressCall,
} from "../../type/common";
import { FolksCore } from "../core/FolksCore";
import { AdapterUtil, SpokeChainUtil } from "../../util/common";

export class FolksAccount {
  static prepare = {
    async createAccount(accountId: Hex, adapters: MessageAdapters) {
      const folksChain = FolksCore.getSelectedFolksChain();

      // check adapters are compatible
      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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
      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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
      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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
      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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

  static write = {
    async createAccount(accountId: Hex, prepareCall: PrepareCreateAccountCall) {
      if (!FolksCore.getSigner()) throw new Error("Signer is not set");
      const folksChain = FolksCore.getSelectedFolksChain();

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

  static read = {
    async accountInfo(accountId: Hex, folksChainIds?: FolksChainId[]) {
      return FolksHubAccount.getAccountInfo(
        FolksCore.getHubProvider(),
        FolksCore.getSelectedNetwork(),
        accountId,
        folksChainIds
      );
    },
  };
}
