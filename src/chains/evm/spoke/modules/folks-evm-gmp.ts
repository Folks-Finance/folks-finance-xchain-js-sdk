import { GAS_LIMIT_ESTIMATE_INCREASE } from "../../common/constants/contract.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { getBridgeRouterSpokeContract } from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { SpokeChain } from "../../../../common/types/chain.js";
import type { MessageId, ReverseMessageExtraAgrs } from "../../../../common/types/gmp.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { PrepareRetryMessageCall, PrepareReverseMessageCall } from "../../common/types/module.js";
import type { Client, EstimateGasParameters, WalletClient } from "viem";

export const prepare = {
  async retryMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
    value: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const gasLimit = await bridgeRouter.estimateGas.retryMessage([adapterId, messageId], {
      ...transactionOptions,
      value,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      isHub: false,
      bridgeRouterAddress: spokeChain.bridgeRouterAddress,
    };
  },

  async reverseMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
    extraArgs: ReverseMessageExtraAgrs,
    value: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const gasLimit = await bridgeRouter.estimateGas.reverseMessage([adapterId, messageId, extraArgs], {
      ...transactionOptions,
      value,
    });

    return {
      gasLimit: gasLimit + GAS_LIMIT_ESTIMATE_INCREASE,
      msgValue: value,
      isHub: false,
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
    const { gasLimit, msgValue, bridgeRouterAddress } = prepareCall;

    const bridgeRouter = getBridgeRouterSpokeContract(provider, bridgeRouterAddress, signer);

    return await bridgeRouter.write.retryMessage([adapterId, messageId], {
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
    extraArgs: ReverseMessageExtraAgrs,
    prepareCall: PrepareReverseMessageCall,
  ) {
    const { gasLimit, msgValue, bridgeRouterAddress } = prepareCall;

    const bridgeRouter = getBridgeRouterSpokeContract(provider, bridgeRouterAddress, signer);

    return await bridgeRouter.write.reverseMessage([adapterId, messageId, extraArgs], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      msgValue,
    });
  },
};
