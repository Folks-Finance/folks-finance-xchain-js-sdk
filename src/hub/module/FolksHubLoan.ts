import { Hex, PublicClient } from "viem";
import { FINALITY, UINT256_LENGTH } from "../../constants/common";
import { Action, FolksChainId, FolksTokenId, MessageAdapters, MessageToSend, NetworkType } from "../../type/common";
import { MessageUtil, SpokeChainUtil, BytesUtil, AddressUtil } from "../../util/common";
import { EVMContractUtil } from "../../util/evm";
import { HubChainUtil } from "../../util/hub";

export class FolksHubLoan {
  static getSendTokenAdapterFees(
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    receiverFolksChainId: FolksChainId,
    adapters: MessageAdapters
  ): () => Promise<bigint> {
    return async (): Promise<bigint> => {
      const hubChain = HubChainUtil.getHubChain(network);
      const hubTokenData = HubChainUtil.getHubTokenData(folksTokenId, network);
      const hubBridgeRouter = EVMContractUtil.getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);

      const spokeChain = SpokeChainUtil.getSpokeChain(receiverFolksChainId, network);
      const spokeTokenData = SpokeChainUtil.getSpokeTokenData(spokeChain, folksTokenId);

      // construct return message
      const { returnAdapterId } = adapters;
      const returnParams = MessageUtil.DEFAULT_MESSAGE_PARAMS({ adapterId: returnAdapterId, returnAdapterId });
      const returnMessage: MessageToSend = {
        params: returnParams,
        sender: hubChain.hubAddress,
        destinationChainId: receiverFolksChainId,
        handler: AddressUtil.getRandomGenericAddress(),
        payload: MessageUtil.buildMessagePayload(
          Action.SendToken,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          BytesUtil.convertNumberToBytes(amount, UINT256_LENGTH)
        ),
        finalityLevel: FINALITY.FINALISED,
        extraArgs: MessageUtil.getSendTokenExtraArgsWhenRemoving(spokeTokenData, hubTokenData, amount),
      };

      // get return adapter fee
      return await hubBridgeRouter.read.getSendFee([returnMessage]);
    };
  }
}
