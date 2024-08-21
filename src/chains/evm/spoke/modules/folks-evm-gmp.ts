import { GAS_LIMIT_ESTIMATE_INCREASE } from "../../common/constants/contract.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { getBridgeRouterSpokeContract } from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { SpokeChain } from "../../../../common/types/chain.js";
import type { MessageId } from "../../../../common/types/gmp.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { MessageReceived } from "../../common/types/gmp.js";
import type { PrepareRetryMessageCall, PrepareReverseMessageCall } from "../../common/types/module.js";
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
      msgValue,
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
      msgValue,
    });
  },
};
