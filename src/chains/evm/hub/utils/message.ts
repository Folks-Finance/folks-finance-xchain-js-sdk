import { MessageDirection } from "../../../../common/types/gmp.js";
import { Action, AdapterType } from "../../../../common/types/message.js";
import { getSpokeChain, getSpokeTokenData } from "../../../../common/utils/chain.js";
import { decodeMessagePayloadData, estimateAdapterReceiveGasLimit } from "../../../../common/utils/messages.js";
import { getFolksTokenIdFromPool } from "../../../../common/utils/token.js";
import { FolksCore } from "../../../../xchain/core/folks-core.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { NetworkType } from "../../../../common/types/chain.js";
import type {
  MessageBuilderParams,
  Payload,
  ReversibleHubAction,
  SendTokenExtraArgs,
  SendTokenMessageData,
} from "../../../../common/types/message.js";
import type {
  MessageReceived,
  ReverseMessageExtraArgs,
  ReverseMessageExtraArgsParams,
} from "../../common/types/gmp.js";
import type { HubChain } from "../types/chain.js";

export async function getHubReverseMessageExtraArgs(
  hubChain: HubChain,
  network: NetworkType,
  userAddress: GenericAddress,
  message: MessageReceived,
  extraArgs: ReverseMessageExtraArgsParams,
  payload: Payload,
): Promise<ReverseMessageExtraArgs | undefined> {
  if (!extraArgs) return undefined;

  const { accountId, action, data } = payload;
  return {
    returnAdapterId: extraArgs.returnAdapterId ?? message.returnAdapterId,
    accountId: extraArgs.accountId ?? accountId,
    returnGasLimit: await (async () => {
      const payloadData = decodeMessagePayloadData(action as ReversibleHubAction, data);

      const folksTokenId = getFolksTokenIdFromPool(payloadData.poolId);

      const spokeChain = getSpokeChain(message.sourceChainId, network);
      const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

      const returnData: SendTokenMessageData = {
        amount: payloadData.amount,
      };
      const returnExtraArgs: SendTokenExtraArgs = {
        folksTokenId,
        token: spokeTokenData.token,
        recipient: spokeTokenData.spokeAddress,
        amount: payloadData.amount,
      };
      const returnMessageBuilderParams: MessageBuilderParams = {
        userAddress,
        accountId,
        adapters: {
          adapterId: AdapterType.HUB,
          returnAdapterId: extraArgs.returnAdapterId ?? message.returnAdapterId,
        },
        action: Action.SendToken,
        sender: hubChain.hubAddress,
        destinationChainId: message.sourceChainId,
        handler: spokeTokenData.spokeAddress,
        data: returnData,
        extraArgs: returnExtraArgs,
      };
      return await estimateAdapterReceiveGasLimit(
        hubChain.folksChainId,
        message.sourceChainId,
        FolksCore.getEVMProvider(message.sourceChainId),
        network,
        MessageDirection.HubToSpoke,
        returnMessageBuilderParams,
      );
    })(),
  };
}
