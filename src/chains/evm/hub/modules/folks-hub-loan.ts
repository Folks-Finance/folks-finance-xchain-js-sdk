import { UINT256_LENGTH } from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { Action } from "../../../../common/types/message.js";
import { getRandomGenericAddress } from "../../../../common/utils/address.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";
import {
  getSpokeChain,
  getSpokeTokenData,
} from "../../../../common/utils/chain.js";
import {
  DEFAULT_MESSAGE_PARAMS,
  buildMessagePayload,
  getSendTokenExtraArgsWhenRemoving,
} from "../../../../common/utils/messages.js";
import { getHubChain, getHubTokenData } from "../utils/chain.js";
import { getBridgeRouterHubContract } from "../utils/contract.js";

import type {
  NetworkType,
  FolksChainId,
} from "../../../../common/types/chain.js";
import type {
  MessageAdapters,
  MessageToSend,
} from "../../../../common/types/message.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Hex, PublicClient } from "viem";

export function getSendTokenAdapterFees(
  provider: PublicClient,
  network: NetworkType,
  accountId: Hex,
  folksTokenId: FolksTokenId,
  amount: bigint,
  receiverFolksChainId: FolksChainId,
  adapters: MessageAdapters,
): () => Promise<bigint> {
  return async (): Promise<bigint> => {
    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);
    const hubBridgeRouter = getBridgeRouterHubContract(
      provider,
      hubChain.bridgeRouterAddress,
    );

    const spokeChain = getSpokeChain(receiverFolksChainId, network);
    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

    // construct return message
    const { returnAdapterId } = adapters;
    const returnParams = DEFAULT_MESSAGE_PARAMS({
      adapterId: returnAdapterId,
      returnAdapterId,
    });
    const returnMessage: MessageToSend = {
      params: returnParams,
      sender: hubChain.hubAddress,
      destinationChainId: receiverFolksChainId,
      handler: getRandomGenericAddress(),
      payload: buildMessagePayload(
        Action.SendToken,
        accountId,
        getRandomGenericAddress(),
        convertNumberToBytes(amount, UINT256_LENGTH),
      ),
      finalityLevel: FINALITY.FINALISED,
      extraArgs: getSendTokenExtraArgsWhenRemoving(
        spokeTokenData,
        hubTokenData,
        amount,
      ),
    };

    // get return adapter fee
    return await hubBridgeRouter.read.getSendFee([returnMessage]);
  };
}
