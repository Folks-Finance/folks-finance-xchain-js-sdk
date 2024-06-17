import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { getBridgeRouterHubContract } from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type {
  MessageId,
  ReverseMessageExtraAgrs,
} from "../../../../common/types/gmp.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type {
  PrepareRetryMessageCall,
  PrepareReverseMessageCall,
} from "../../common/types/module.js";
import type { HubChain } from "../types/chain.js";
import type { Client, EstimateGasParameters, WalletClient } from "viem";

export const prepare = {
  async retryMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
    value: bigint,
    hubChain: HubChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterHubContract(
      provider,
      hubChain.bridgeRouterAddress,
    );

    const gasLimit = await bridgeRouter.estimateGas.retryMessage(
      [adapterId, messageId],
      {
        ...transactionOptions,
        value,
      },
    );

    return {
      gasLimit,
      msgValue: value,
      bridgeRouterAddress: hubChain.bridgeRouterAddress,
    };
  },

  async reverseMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
    extraArgs: ReverseMessageExtraAgrs,
    value: bigint,
    hubChain: HubChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareRetryMessageCall> {
    const bridgeRouter = getBridgeRouterHubContract(
      provider,
      hubChain.bridgeRouterAddress,
    );

    const gasLimit = await bridgeRouter.estimateGas.reverseMessage(
      [adapterId, messageId, extraArgs],
      {
        ...transactionOptions,
        value,
      },
    );

    return {
      gasLimit,
      msgValue: value,
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
    const { gasLimit, msgValue, bridgeRouterAddress } = prepareCall;

    const bridgeRouter = getBridgeRouterHubContract(
      provider,
      bridgeRouterAddress,
      signer,
    );

    return await bridgeRouter.write.retryMessage([adapterId, messageId], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gasLimit,
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

    const bridgeRouter = getBridgeRouterHubContract(
      provider,
      bridgeRouterAddress,
      signer,
    );

    return await bridgeRouter.write.reverseMessage(
      [adapterId, messageId, extraArgs],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit,
        msgValue,
      },
    );
  },
};
