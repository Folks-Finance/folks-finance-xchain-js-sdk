import { FINALITY } from "../../../../common/constants/message.js";
import { ChainType } from "../../../../common/types/chain.js";
import {
  convertFromGenericAddress,
  convertToGenericAddress,
  getRandomGenericAddress,
} from "../../../../common/utils/address.js";
import { getRandomBytes } from "../../../../common/utils/bytes.js";
import { getWormholeData } from "../../../../common/utils/gmp.js";
import { GAS_LIMIT_ESTIMATE_INCREASE } from "../../common/constants/contract.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { getWormholeRelayerContract } from "../../common/utils/contract.js";
import { buildMessageParams, buildSendTokenExtraArgsWhenAdding } from "../../common/utils/message.js";
import { getBridgeRouterSpokeContract } from "../utils/contract.js";

import type { EvmAddress, GenericAddress } from "../../../../common/types/address.js";
import type { FolksChainId, SpokeChain } from "../../../../common/types/chain.js";
import type { MessageId } from "../../../../common/types/gmp.js";
import type { AdapterType, MessageToSend } from "../../../../common/types/message.js";
import type { SpokeTokenData } from "../../../../common/types/token.js";
import type { MessageReceived } from "../../common/types/gmp.js";
import type {
  PrepareResendWormholeMessageCall,
  PrepareRetryMessageCall,
  PrepareReverseMessageCall,
} from "../../common/types/module.js";
import type { HubChain } from "../../hub/types/chain.js";
import type { Client, EstimateGasParameters, Hex, WalletClient } from "viem";

export const prepare = {
  async retryMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgs: Hex,
    value: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const gasLimit = await bridgeRouter.estimateGas.retryMessage([adapterId, messageId, message, extraArgs], {
      ...transactionOptions,
      value,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      isHub: false,
      message,
      extraArgs,
      bridgeRouterAddress: spokeChain.bridgeRouterAddress,
    };
  },

  async reverseMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgs: Hex,
    value: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const gasLimit = await bridgeRouter.estimateGas.reverseMessage([adapterId, messageId, message, extraArgs], {
      ...transactionOptions,
      value,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      isHub: false,
      message,
      extraArgs,
      bridgeRouterAddress: spokeChain.bridgeRouterAddress,
    };
  },

  async resendWormholeMessage(
    provider: Client,
    sender: EvmAddress,
    sourceFolksChainId: FolksChainId,
    emitterAddress: GenericAddress,
    sequence: bigint,
    targetFolksChainId: FolksChainId,
    receiverValue: bigint,
    receiverGasLimit: bigint,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareResendWormholeMessageCall> {
    const { wormholeChainId: sourceWormholeChainId, wormholeRelayer: wormholeRelayerAddress } =
      getWormholeData(sourceFolksChainId);
    const wormholeRelayer = getWormholeRelayerContract(provider, wormholeRelayerAddress);
    const { wormholeChainId: targetWormholeChainId } = getWormholeData(targetFolksChainId);

    // get delivery provider address
    const evmDeliveryProviderAddress = (await wormholeRelayer.read.getDefaultDeliveryProvider()) as EvmAddress;
    const genericDeliveryProviderAddress = convertToGenericAddress(evmDeliveryProviderAddress, ChainType.EVM);

    // get quote for delivery
    const [value] = (await wormholeRelayer.read.quoteEVMDeliveryPrice([
      targetWormholeChainId,
      receiverValue,
      receiverGasLimit,
      evmDeliveryProviderAddress,
    ])) as [bigint, bigint];

    // estimate gas limit
    const vaaKey = {
      chainId: sourceWormholeChainId,
      emitterAddress,
      sequence,
    };
    const gasLimit = await wormholeRelayer.estimateGas.resendToEvm(
      [vaaKey, targetWormholeChainId, receiverValue, receiverGasLimit, evmDeliveryProviderAddress],
      {
        ...transactionOptions,
        value,
      },
    );

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      vaaKey,
      targetWormholeChainId,
      receiverValue,
      receiverGasLimit,
      deliveryProviderAddress: genericDeliveryProviderAddress,
      wormholeRelayerAddress,
    };
  },
};

export const write = {
  async retryMessage(
    provider: Client,
    signer: WalletClient,
    adapterId: AdapterType,
    messageId: MessageId,
    prepareCall: PrepareRetryMessageCall,
  ) {
    const { gasLimit, msgValue, message, extraArgs, bridgeRouterAddress } = prepareCall;

    const bridgeRouter = getBridgeRouterSpokeContract(provider, bridgeRouterAddress, signer);

    return await bridgeRouter.write.retryMessage([adapterId, messageId, message, extraArgs], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },

  async reverseMessage(
    provider: Client,
    signer: WalletClient,
    adapterId: AdapterType,
    messageId: MessageId,
    prepareCall: PrepareReverseMessageCall,
  ) {
    const { gasLimit, msgValue, message, extraArgs, bridgeRouterAddress } = prepareCall;

    const bridgeRouter = getBridgeRouterSpokeContract(provider, bridgeRouterAddress, signer);

    return await bridgeRouter.write.reverseMessage([adapterId, messageId, message, extraArgs], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },

  async resendMessage(provider: Client, signer: WalletClient, prepareCall: PrepareResendWormholeMessageCall) {
    const {
      gasLimit,
      msgValue,
      vaaKey,
      targetWormholeChainId,
      receiverValue,
      receiverGasLimit,
      deliveryProviderAddress,
      wormholeRelayerAddress,
    } = prepareCall;

    const evmDeliveryProviderAddress = convertFromGenericAddress(deliveryProviderAddress, ChainType.EVM);
    const wormholeRelayer = getWormholeRelayerContract(provider, wormholeRelayerAddress, signer);

    return await wormholeRelayer.write.resendToEvm(
      [vaaKey, targetWormholeChainId, receiverValue, receiverGasLimit, evmDeliveryProviderAddress],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
        value: msgValue,
      },
    );
  },
};

export async function getSendMessageFee(
  provider: Client,
  adapterId: AdapterType,
  receiverValue: bigint,
  gasLimit: bigint,
  hubChain: HubChain,
  spokeChain: SpokeChain,
  spokeTokenData?: SpokeTokenData,
): Promise<bigint> {
  const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

  // construct return message
  const message: MessageToSend = {
    params: buildMessageParams({
      adapters: {
        adapterId,
        returnAdapterId: 0 as AdapterType,
      },
      gasLimit,
      receiverValue,
    }),
    sender: spokeChain.spokeCommonAddress,
    destinationChainId: hubChain.folksChainId,
    handler: getRandomGenericAddress(),
    payload: getRandomBytes(256),
    finalityLevel: FINALITY.FINALISED,
    extraArgs: spokeTokenData
      ? buildSendTokenExtraArgsWhenAdding(getRandomGenericAddress(), spokeTokenData.token, 1n)
      : "0x",
  };

  // get return adapter fee
  return await bridgeRouter.read.getSendFee([message]);
}
