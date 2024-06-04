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
  buildMessageParams,
  buildMessagePayload,
  buildSendTokenExtraArgsWhenRemoving,
} from "../../common/utils/message.js";
import {
  getHubChain,
  getHubTokenAddress,
  getHubTokenData,
} from "../utils/chain.js";
import { getBridgeRouterHubContract } from "../utils/contract.js";

import type {
  FolksChainId,
  NetworkType,
} from "../../../../common/types/chain.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type {
  MessageAdapters,
  MessageToSend,
  OptionalFeeParams,
  AdapterType,
} from "../../../../common/types/message.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Client } from "viem";

export async function getSendTokenAdapterFees(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  folksTokenId: FolksTokenId,
  amount: bigint,
  receiverFolksChainId: FolksChainId,
  adapters: MessageAdapters,
  feeParams: OptionalFeeParams = {},
): Promise<bigint> {
  const hubChain = getHubChain(network);
  const hubTokenData = getHubTokenData(folksTokenId, network);
  const hubBridgeRouter = getBridgeRouterHubContract(
    provider,
    hubChain.bridgeRouterAddress,
  );

  const spokeChain = getSpokeChain(receiverFolksChainId, network);
  const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

  // construct return message
  const returnParams = buildMessageParams({
    adapters: {
      adapterId: adapters.returnAdapterId,
      returnAdapterId: 0 as AdapterType,
    },
    gasLimit: feeParams.returnGasLimit,
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
    extraArgs: buildSendTokenExtraArgsWhenRemoving(
      hubTokenData.tokenType,
      spokeTokenData.spokeAddress,
      getHubTokenAddress(hubTokenData),
      amount,
    ),
  };

  // get return adapter fee
  return await hubBridgeRouter.read.getSendFee([returnMessage]);
}
