import { FINALITY } from "../../../../common/constants/message.js";
import { getRandomGenericAddress } from "../../../../common/utils/address.js";
import { getRandomBytes } from "../../../../common/utils/bytes.js";
import { GAS_LIMIT_ESTIMATE_INCREASE } from "../../common/constants/contract.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { buildMessageParams, buildSendTokenExtraArgsWhenRemoving } from "../../common/utils/message.js";
import { getBridgeRouterHubContract } from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { FolksChainId } from "../../../../common/types/chain.js";
import type { MessageId } from "../../../../common/types/gmp.js";
import type { AdapterType, MessageToSend } from "../../../../common/types/message.js";
import type { MessageReceived } from "../../common/types/gmp.js";
import type { PrepareRetryMessageCall, PrepareReverseMessageCall } from "../../common/types/module.js";
import type { HubChain } from "../types/chain.js";
import type { HubTokenData } from "../types/token.js";
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
    hubChain: HubChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);

    const gasLimit = await bridgeRouter.estimateGas.retryMessage([adapterId, messageId, message, extraArgs], {
      ...transactionOptions,
      value,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      isHub: true,
      message,
      extraArgs,
      bridgeRouterAddress: hubChain.bridgeRouterAddress,
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
    hubChain: HubChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);

    const gasLimit = await bridgeRouter.estimateGas.reverseMessage([adapterId, messageId, message, extraArgs], {
      ...transactionOptions,
      value,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      isHub: true,
      message,
      extraArgs,
      bridgeRouterAddress: hubChain.bridgeRouterAddress,
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

    const bridgeRouter = getBridgeRouterHubContract(provider, bridgeRouterAddress, signer);

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

    const bridgeRouter = getBridgeRouterHubContract(provider, bridgeRouterAddress, signer);

    return await bridgeRouter.write.reverseMessage([adapterId, messageId, message, extraArgs], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },
};

export async function getSendMessageFee(
  provider: Client,
  toFolksChainId: FolksChainId,
  adapterId: AdapterType,
  gasLimit: bigint,
  hubChain: HubChain,
  hubTokenData: HubTokenData,
): Promise<bigint> {
  const hubBridgeRouter = getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);

  // construct return message
  const message: MessageToSend = {
    params: buildMessageParams({
      adapters: {
        adapterId,
        returnAdapterId: 0 as AdapterType,
      },
      gasLimit,
    }),
    sender: hubChain.hubAddress,
    destinationChainId: toFolksChainId,
    handler: getRandomGenericAddress(),
    payload: getRandomBytes(256),
    finalityLevel: FINALITY.FINALISED,
    extraArgs: buildSendTokenExtraArgsWhenRemoving(getRandomGenericAddress(), hubTokenData.token, 1n),
  };

  // get return adapter fee
  return await hubBridgeRouter.read.getSendFee([message]);
}
