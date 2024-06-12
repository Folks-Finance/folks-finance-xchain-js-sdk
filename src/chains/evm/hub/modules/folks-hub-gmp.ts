import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { getBridgeRouterHubContract } from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { MessageId } from "../../../../common/types/gmp.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { PrepareRetryMessageCall } from "../../common/types/module.js";
import type { HubChain } from "../types/chain.js";
import type { Client, EstimateGasParameters, WalletClient } from "viem";

export const prepare = {
  async retryMessage(
    provider: Client,
    sender: EvmAddress,
    adapterId: AdapterType,
    messageId: MessageId,
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
        value: undefined,
      },
    );

    return {
      gasLimit,
      bridgeRouterAddress: hubChain.bridgeRouterAddress,
    };
  },
};

export const write = {
  async retryMessage(
    provider: Client,
    signer: WalletClient,
    messageId: MessageId,
    adapterId: AdapterType,
    prepareCall: PrepareRetryMessageCall,
  ) {
    const { gasLimit, bridgeRouterAddress } = prepareCall;

    const bridgeRouter = getBridgeRouterHubContract(
      provider,
      bridgeRouterAddress,
      signer,
    );

    return await bridgeRouter.write.retryMessage([adapterId, messageId], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
    });
  },
};
