import { concat } from "viem";

import { getSignerAddress } from "../../chains/evm/common/utils/chain.js";
import { FolksHubAccount } from "../../chains/evm/hub/modules/index.js";
import { getHubChain } from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmAccount } from "../../chains/evm/spoke/modules/index.js";
import { UINT16_LENGTH } from "../../common/constants/bytes.js";
import { ChainType } from "../../common/types/chain.js";
import { Action } from "../../common/types/message.js";
import { assertAdapterSupportsDataMessage } from "../../common/utils/adapter.js";
import { convertToGenericAddress } from "../../common/utils/address.js";
import { convertNumberToBytes } from "../../common/utils/bytes.js";
import {
  assertSpokeChainSupported,
  getSpokeChain,
} from "../../common/utils/chain.js";
import { buildMessageToSend } from "../../common/utils/messages.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type { FolksChainId } from "../../common/types/chain.js";
import type { MessageAdapters } from "../../common/types/message.js";
import type {
  PrepareCreateAccountCall,
  PrepareInviteAddressCall,
  PrepareAcceptInviteAddressCall,
  PrepareUnregisterAddressCall,
} from "../../common/types/module.js";
import type { Address, Hex } from "viem";

export const prepare = {
  async createAccount(accountId: Hex, adapters: MessageAdapters) {
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

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      accountId,
      adapters,
      Action.CreateAccount,
      spokeChain.spokeCommonAddress,
      hubChain.folksChainId,
      hubChain.hubAddress,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.createAccount(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          getSignerAddress(FolksCore.getSigner<ChainType.EVM>()),
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
    accountId: Hex,
    folksChainIdToInvite: FolksChainId,
    addressToInvite: Address,
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

    const data = concat([
      convertNumberToBytes(folksChainIdToInvite, UINT16_LENGTH),
      convertToGenericAddress<ChainType.EVM>(addressToInvite, ChainType.EVM),
    ]);
    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      accountId,
      adapters,
      Action.InviteAddress,
      spokeChain.spokeCommonAddress,
      hubChain.folksChainId,
      hubChain.hubAddress,
      data,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.inviteAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          getSignerAddress(FolksCore.getSigner<ChainType.EVM>()),
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

  async acceptInvite(accountId: Hex, adapters: MessageAdapters) {
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

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      accountId,
      adapters,
      Action.AcceptInviteAddress,
      spokeChain.spokeCommonAddress,
      hubChain.folksChainId,
      hubChain.hubAddress,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.acceptInvite(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          getSignerAddress(FolksCore.getSigner<ChainType.EVM>()),
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
    accountId: Hex,
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

    const data = convertNumberToBytes(folksChainIdToUnregister, UINT16_LENGTH);
    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      accountId,
      adapters,
      Action.UnregisterAddress,
      spokeChain.spokeCommonAddress,
      hubChain.folksChainId,
      hubChain.hubAddress,
      data,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmAccount.prepare.unregisterAddress(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          getSignerAddress(FolksCore.getSigner<ChainType.EVM>()),
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
  async createAccount(accountId: Hex, prepareCall: PrepareCreateAccountCall) {
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
    accountId: Hex,
    folksChainIdToInvite: number,
    addressToInvite: Address,
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
    accountId: Hex,
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
    accountId: Hex,
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
  async accountInfo(accountId: Hex, folksChainIds?: Array<FolksChainId>) {
    return FolksHubAccount.getAccountInfo(
      FolksCore.getHubProvider(),
      FolksCore.getSelectedNetwork(),
      accountId,
      folksChainIds,
    );
  },
};
