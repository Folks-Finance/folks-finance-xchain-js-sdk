import { getEvmSignerAddress } from "../../chains/evm/common/utils/chain.js";
import { encodeRetryMessageExtraArgs, encodeReverseMessageExtraArgs } from "../../chains/evm/common/utils/gmp.js";
import { FolksHubGmp } from "../../chains/evm/hub/modules/index.js";
import { getHubChain, getHubTokenData } from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmGmp } from "../../chains/evm/spoke/modules/index.js";
import {
  assertAdapterSupportsDataMessage,
  assertAdapterSupportsReceiverValue,
  assertAdapterSupportsTokenMessage,
} from "../../common/utils/adapter.js";
import { assertHubChainSelected, getSpokeChain, getSpokeTokenData } from "../../common/utils/chain.js";
import { isCircleToken } from "../../common/utils/token.js";
import { FolksCore } from "../core/folks-core.js";

import type {
  MessageReceived,
  RetryMessageExtraArgs,
  ReverseMessageExtraArgs,
} from "../../chains/evm/common/types/gmp.js";
import type { GenericAddress } from "../../common/types/address.js";
import type { ChainType, FolksChainId } from "../../common/types/chain.js";
import type { MessageId } from "../../common/types/gmp.js";
import type { AdapterType, MessageAdapters } from "../../common/types/message.js";
import type {
  PrepareRetryMessageCall,
  PrepareReverseMessageCall,
  PrepareResendWormholeMessageCall,
} from "../../common/types/module.js";
import type { FolksTokenId } from "../../common/types/token.js";

export const prepare = {
  async retryMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgs: RetryMessageExtraArgs | undefined,
    value: bigint,
    isHub = true,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const encodedExtraArgs = encodeRetryMessageExtraArgs(extraArgs);

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.prepare.retryMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getHubChain(folksChain.network),
      );
    } else {
      return await FolksEvmGmp.prepare.retryMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getSpokeChain(folksChain.folksChainId, folksChain.network),
      );
    }
  },

  async reverseMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgs: ReverseMessageExtraArgs | undefined,
    value: bigint,
    isHub = true,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const encodedExtraArgs = encodeReverseMessageExtraArgs(extraArgs);

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.prepare.reverseMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getHubChain(folksChain.network),
      );
    } else {
      return await FolksEvmGmp.prepare.reverseMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getSpokeChain(folksChain.folksChainId, folksChain.network),
      );
    }
  },

  async resendWormholeMessage(
    sourceFolksChainId: FolksChainId,
    emitterAddress: GenericAddress,
    sequence: bigint,
    targetFolksChainId: FolksChainId,
    receiverValue: bigint,
    receiverGasLimit: bigint,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    return await FolksEvmGmp.prepare.resendWormholeMessage(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      getEvmSignerAddress(FolksCore.getSigner()),
      sourceFolksChainId,
      emitterAddress,
      sequence,
      targetFolksChainId,
      receiverValue,
      receiverGasLimit,
    );
  },
};

export const write = {
  async retryMessage(adapterId: AdapterType, messageId: MessageId, prepareCall: PrepareRetryMessageCall) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { isHub } = prepareCall;

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.write.retryMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    } else {
      return await FolksEvmGmp.write.retryMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    }
  },

  async reverseMessage(adapterId: AdapterType, messageId: MessageId, prepareCall: PrepareReverseMessageCall) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { isHub } = prepareCall;

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.write.reverseMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    } else {
      return await FolksEvmGmp.write.reverseMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    }
  },

  async resendWormholeMessage(prepareCall: PrepareResendWormholeMessageCall) {
    return await FolksEvmGmp.write.resendMessage(
      FolksCore.getHubProvider(),
      FolksCore.getSigner<ChainType.EVM>(),
      prepareCall,
    );
  },
};

export const util = {
  async spokeToHubMessageFee(
    adapterId: AdapterType,
    fromFolksChainId: FolksChainId,
    receiverValue = 0n,
    gasLimit = 1_500_000n,
    sendFolksTokenId?: FolksTokenId,
  ): Promise<bigint> {
    const network = FolksCore.getSelectedNetwork();
    const spokeChain = getSpokeChain(fromFolksChainId, network);
    const hubChain = getHubChain(network);

    // check receiver value is support
    if (receiverValue > 0n) assertAdapterSupportsReceiverValue(fromFolksChainId, adapterId);

    // check adapter id is supported
    sendFolksTokenId && isCircleToken(sendFolksTokenId)
      ? assertAdapterSupportsTokenMessage(fromFolksChainId, adapterId)
      : assertAdapterSupportsDataMessage(fromFolksChainId, adapterId);
    const spokeTokenData = sendFolksTokenId ? getSpokeTokenData(spokeChain, sendFolksTokenId) : undefined;

    return FolksEvmGmp.getSendMessageFee(
      FolksCore.getProvider<ChainType.EVM>(fromFolksChainId),
      adapterId,
      receiverValue,
      gasLimit,
      hubChain,
      spokeChain,
      spokeTokenData,
    );
  },

  async hubToSpokeMessageFee(
    adapterId: AdapterType,
    toFolksChainId: FolksChainId,
    gasLimit = 500_000n,
    receiveFolksTokenId: FolksTokenId,
  ): Promise<bigint> {
    const network = FolksCore.getSelectedNetwork();
    const hubChain = getHubChain(network);

    // check adapter id is supported
    isCircleToken(receiveFolksTokenId)
      ? assertAdapterSupportsTokenMessage(toFolksChainId, adapterId)
      : assertAdapterSupportsDataMessage(toFolksChainId, adapterId);

    const hubTokenData = getHubTokenData(receiveFolksTokenId, network);

    return await FolksHubGmp.getSendMessageFee(
      FolksCore.getHubProvider(),
      toFolksChainId,
      adapterId,
      gasLimit,
      hubChain,
      hubTokenData,
    );
  },

  async roundTripMessageFee(
    adapters: MessageAdapters,
    startFolksChainId: FolksChainId,
    endFolksChainId: FolksChainId,
    gasLimit = 1_500_000n,
    returnGasLimit = 500_000n,
    receiveFolksTokenId: FolksTokenId,
  ): Promise<bigint> {
    const { adapterId, returnAdapterId } = adapters;
    const receiverValue = await this.hubToSpokeMessageFee(
      returnAdapterId,
      endFolksChainId,
      returnGasLimit,
      receiveFolksTokenId,
    );
    return await this.spokeToHubMessageFee(adapterId, startFolksChainId, receiverValue, gasLimit);
  },
};
