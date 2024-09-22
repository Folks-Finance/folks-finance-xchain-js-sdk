import { getEvmSignerAddress } from "../../chains/evm/common/utils/chain.js";
import { encodeRetryMessageExtraArgs, encodeReverseMessageExtraArgs } from "../../chains/evm/common/utils/gmp.js";
import { FolksHubGmp } from "../../chains/evm/hub/modules/index.js";
import { getHubChain, getHubTokenData } from "../../chains/evm/hub/utils/chain.js";
import { getBridgeRouterHubContract } from "../../chains/evm/hub/utils/contract.js";
import {
  getHubRetryMessageExtraArgsAndAdapterFees,
  getHubReverseMessageExtraArgsAndAdapterFees,
} from "../../chains/evm/hub/utils/message.js";
import { FolksEvmGmp } from "../../chains/evm/spoke/modules/index.js";
import { getBridgeRouterSpokeContract } from "../../chains/evm/spoke/utils/contract.js";
import { ChainType } from "../../common/types/chain.js";
import { MessageDirection } from "../../common/types/gmp.js";
import {
  assertAdapterSupportsDataMessage,
  assertAdapterSupportsReceiverValue,
  assertAdapterSupportsTokenMessage,
} from "../../common/utils/adapter.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";
import {
  assertHubChainSelected,
  getFolksChain,
  getSignerGenericAddress,
  getSpokeChain,
  getSpokeTokenData,
} from "../../common/utils/chain.js";
import { bigIntMax } from "../../common/utils/math-lib.js";
import { assertRetryableAction, assertReversibleAction, decodeMessagePayload } from "../../common/utils/messages.js";
import { isCircleToken } from "../../common/utils/token.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type {
  MessageReceived,
  RetryMessageExtraArgsParams,
  ReverseMessageExtraArgsParams,
} from "../../chains/evm/common/types/gmp.js";
import type { GenericAddress } from "../../common/types/address.js";
import type { FolksChainId } from "../../common/types/chain.js";
import type { MessageId } from "../../common/types/gmp.js";
import type { AccountId } from "../../common/types/lending.js";
import type { AdapterType, MessageAdapters } from "../../common/types/message.js";
import type {
  PrepareResendWormholeMessageCall,
  PrepareRetryMessageCall,
  PrepareReverseMessageCall,
} from "../../common/types/module.js";
import type { FolksTokenId } from "../../common/types/token.js";

export const prepare = {
  async retryMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgsParams: RetryMessageExtraArgsParams,
    isHub = true,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const payload = decodeMessagePayload(message.payload);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      assertRetryableAction(payload.action, MessageDirection.HubToSpoke);

      const hubChain = getHubChain(folksChain.network);
      const provider = FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId);

      const { adapterFees, extraArgs } = await getHubRetryMessageExtraArgsAndAdapterFees(
        provider,
        hubChain,
        folksChain.network,
        userAddress,
        message,
        extraArgsParams,
        payload,
      );
      const encodedExtraArgs = encodeRetryMessageExtraArgs(extraArgs);
      const bridgeRouterBalance = await util.bridgeRouterHubBalance(payload.accountId);
      const value = bigIntMax(adapterFees - bridgeRouterBalance, 0n);

      return await FolksHubGmp.prepare.retryMessage(
        provider,
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getHubChain(folksChain.network),
      );
    } else {
      assertRetryableAction(payload.action, MessageDirection.SpokeToHub);

      switch (folksChain.chainType) {
        case ChainType.EVM: {
          return await FolksEvmGmp.prepare.retryMessage(
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            getEvmSignerAddress(FolksCore.getSigner()),
            adapterId,
            messageId,
            message,
            "0x",
            0n,
            getSpokeChain(folksChain.folksChainId, folksChain.network),
          );
        }
        default:
          return exhaustiveCheck(folksChain.chainType);
      }
    }
  },

  async reverseMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgsParams: ReverseMessageExtraArgsParams,
    isHub = true,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const payload = decodeMessagePayload(message.payload);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      assertReversibleAction(payload.action, MessageDirection.HubToSpoke);

      const hubChain = getHubChain(folksChain.network);
      const provider = FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId);

      const { adapterFees, extraArgs } = await getHubReverseMessageExtraArgsAndAdapterFees(
        provider,
        hubChain,
        folksChain.network,
        userAddress,
        message,
        extraArgsParams,
        payload,
        adapterId,
      );
      const encodedExtraArgs = encodeReverseMessageExtraArgs(extraArgs);
      const bridgeRouterBalance = await util.bridgeRouterHubBalance(payload.accountId);
      const value = bigIntMax(adapterFees - bridgeRouterBalance, 0n);

      return await FolksHubGmp.prepare.reverseMessage(
        provider,
        convertFromGenericAddress(userAddress, ChainType.EVM),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        hubChain,
      );
    } else {
      switch (folksChain.chainType) {
        case ChainType.EVM: {
          assertReversibleAction(payload.action, MessageDirection.SpokeToHub);

          return await FolksEvmGmp.prepare.reverseMessage(
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            getEvmSignerAddress(FolksCore.getSigner()),
            adapterId,
            messageId,
            message,
            "0x",
            0n,
            getSpokeChain(folksChain.folksChainId, folksChain.network),
          );
        }
        default:
          return exhaustiveCheck(folksChain.chainType);
      }
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
  async bridgeRouterHubBalance(accountId: AccountId): Promise<bigint> {
    const hubChain = getHubChain(FolksCore.getSelectedNetwork());
    const bridgeRouter = getBridgeRouterHubContract(FolksCore.getHubProvider(), hubChain.bridgeRouterAddress);

    return await bridgeRouter.read.balances([accountId]);
  },

  async bridgeRouterSpokeBalance(userAddress: GenericAddress, folksChainId: FolksChainId): Promise<bigint> {
    const folksChain = getFolksChain(folksChainId, FolksCore.getSelectedNetwork());
    const spokeChain = getSpokeChain(folksChainId, FolksCore.getSelectedNetwork());
    switch (folksChain.chainType) {
      case ChainType.EVM: {
        const bridgeRouter = getBridgeRouterSpokeContract(
          FolksCore.getEVMProvider(folksChainId),
          spokeChain.bridgeRouterAddress,
        );
        return await bridgeRouter.read.balances([userAddress]);
      }
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async spokeToHubMessageFee(
    adapterId: AdapterType,
    fromFolksChainId: FolksChainId,
    sendFolksTokenId?: FolksTokenId,
    receiverValue = 0n,
    gasLimit = 1_500_000n,
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
    receiveFolksTokenId: FolksTokenId,
    gasLimit = 500_000n,
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
    receiveFolksTokenId: FolksTokenId,
    gasLimit = 1_500_000n,
    returnGasLimit = 500_000n,
  ): Promise<bigint> {
    const { adapterId, returnAdapterId } = adapters;
    const receiverValue = await this.hubToSpokeMessageFee(
      returnAdapterId,
      endFolksChainId,
      receiveFolksTokenId,
      returnGasLimit,
    );
    return await this.spokeToHubMessageFee(adapterId, startFolksChainId, undefined, receiverValue, gasLimit);
  },
};
