import { FolksHubAccount } from "../../chains/evm/hub/modules/index.js";
import { getHubChain } from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmAccount } from "../../chains/evm/spoke/modules/index.js";
import { ChainType } from "../../common/types/chain.js";
import { Action } from "../../common/types/message.js";
import { assertAdapterSupportsDataMessage } from "../../common/utils/adapter.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";
import {
  assertSpokeChainSupported,
  getSignerGenericAddress,
  getSpokeChain,
} from "../../common/utils/chain.js";
import {
  buildMessageToSend,
  estimateReceiveGasLimit,
} from "../../common/utils/messages.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type { EvmAddress, GenericAddress } from "../../common/types/address.js";
import type { FolksChainId } from "../../common/types/chain.js";
import type { AccountId } from "../../common/types/lending.js";
import type {
  InviteAddressMessageData,
  MessageAdapters,
  MessageBuilderParams,
  OptionalFeeParams,
  UnregisterAddressMessageData,
} from "../../common/types/message.js";
import type {
  PrepareAcceptInviteAddressCall,
  PrepareCreateAccountCall,
  PrepareInviteAddressCall,
  PrepareUnregisterAddressCall,
} from "../../common/types/module.js";

export const prepare = {
  async createAccount(accountId: AccountId, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.CreateAccount,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data: "0x",
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.createAccount(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          adapters,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async inviteAddress(
    accountId: AccountId,
    folksChainIdToInvite: FolksChainId,
    addressToInvite: GenericAddress,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: InviteAddressMessageData = {
      folksChainIdToInvite,
      addressToInvite,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.InviteAddress,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.inviteAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          folksChainIdToInvite,
          addressToInvite,
          adapters,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async acceptInvite(accountId: AccountId, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.AcceptInviteAddress,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data: "0x",
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.acceptInvite(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          adapters,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async unregisterAddress(
    accountId: AccountId,
    folksChainIdToUnregister: FolksChainId,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    // check adapters are compatible
    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: UnregisterAddressMessageData = {
      folksChainIdToUnregister,
    };

    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.UnregisterAddress,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.unregisterAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          folksChainIdToUnregister,
          adapters,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },
};

export const write = {
  async createAccount(
    accountId: AccountId,
    prepareCall: PrepareCreateAccountCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.write.createAccount(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async inviteAddress(
    accountId: AccountId,
    folksChainIdToInvite: number,
    addressToInvite: EvmAddress,
    prepareCall: PrepareInviteAddressCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.write.inviteAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          folksChainIdToInvite,
          addressToInvite,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async acceptInvite(
    accountId: AccountId,
    prepareCall: PrepareAcceptInviteAddressCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.write.acceptInvite(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async unregisterAddress(
    accountId: AccountId,
    folksChainIdToUnregister: FolksChainId,
    prepareCall: PrepareUnregisterAddressCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.write.unregisterAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          folksChainIdToUnregister,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },
};

export const read = {
  async accountInfo(accountId: AccountId, folksChainIds?: Array<FolksChainId>) {
    return FolksHubAccount.getAccountInfo(
      FolksCore.getHubProvider(),
      FolksCore.getSelectedNetwork(),
      accountId,
      folksChainIds,
    );
  },
};
