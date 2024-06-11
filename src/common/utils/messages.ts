import {
  buildEvmMessageToSend,
  estimateEvmCcipDataGasLimit,
  estimateEvmWormholeDataGasLimit,
} from "../../chains/evm/common/utils/message.js";
import { getHubChainAdapterAddress } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { ChainType } from "../types/chain.js";
import { MessageDirection } from "../types/gmp.js";
import { AdapterType } from "../types/message.js";

import { convertFromGenericAddress } from "./address.js";
import { getFolksChain, getSpokeChainAdapterAddress } from "./chain.js";
import { getCcipData, getWormholeData } from "./gmp.js";

import type { FolksChainId, NetworkType } from "../types/chain.js";
import type { FolksProvider } from "../types/core.js";
import type {
  MessageAdapters,
  MessageBuilderParams,
  MessageToSend,
  OptionalFeeParams,
} from "../types/message.js";
import type { Client as EVMProvider } from "viem";

export function buildMessageToSend(
  chainType: ChainType,
  messageToSendBuilderParams: MessageBuilderParams,
  feeParams: OptionalFeeParams = {},
): MessageToSend {
  switch (chainType) {
    case ChainType.EVM: {
      return buildEvmMessageToSend(messageToSendBuilderParams, feeParams);
    }
    default:
      return exhaustiveCheck(chainType);
  }
}

function getAdaptersData(
  messageDirection: MessageDirection,
  sourceFolksChainId: FolksChainId,
  destFolksChainId: FolksChainId,
  network: NetworkType,
  adapters: MessageAdapters,
) {
  if (messageDirection === MessageDirection.SpokeToHub)
    return {
      sourceAdapterAddress: getSpokeChainAdapterAddress(
        sourceFolksChainId,
        network,
        adapters.adapterId,
      ),
      destAdapterAddress: getHubChainAdapterAddress(
        network,
        adapters.adapterId,
      ),
      adapterId: adapters.adapterId,
    };
  return {
    sourceAdapterAddress: getHubChainAdapterAddress(
      network,
      adapters.returnAdapterId,
    ),
    destAdapterAddress: getSpokeChainAdapterAddress(
      destFolksChainId,
      network,
      adapters.returnAdapterId,
    ),
    adapterId: adapters.returnAdapterId,
  };
}

export async function estimateAdapterReceiveGasLimit(
  sourceFolksChainId: FolksChainId,
  destFolksChainId: FolksChainId,
  destFolksChainProvider: FolksProvider,
  network: NetworkType,
  messageDirection: MessageDirection,
  messageBuilderParams: MessageBuilderParams,
  receiverValue = BigInt(0),
  returnGasLimit = BigInt(0),
) {
  const destFolksChain = getFolksChain(destFolksChainId, network);
  const { sourceAdapterAddress, destAdapterAddress, adapterId } =
    getAdaptersData(
      messageDirection,
      sourceFolksChainId,
      destFolksChainId,
      network,
      messageBuilderParams.adapters,
    );

  switch (destFolksChain.chainType) {
    case ChainType.EVM:
      switch (adapterId) {
        case AdapterType.WORMHOLE_DATA: {
          const sourceWormholeChainId =
            getWormholeData(sourceFolksChainId).wormholeChainId;
          const wormholeRelayer = convertFromGenericAddress(
            getWormholeData(destFolksChainId).wormholeRelayer,
            ChainType.EVM,
          );

          return await estimateEvmWormholeDataGasLimit(
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            destFolksChainProvider as EVMProvider,
            messageBuilderParams,
            receiverValue,
            returnGasLimit,
            sourceWormholeChainId,
            wormholeRelayer,
            destAdapterAddress,
            sourceAdapterAddress,
          );
        }
        case AdapterType.WORMHOLE_CCTP: {
          throw new Error(
            "Not implemented yet: AdapterType.WORMHOLE_CCTP case",
          );
        }
        case AdapterType.HUB: {
          throw new Error("Not implemented yet: AdapterType.HUB case");
        }
        case AdapterType.CCIP_DATA: {
          const sourceCcipChainId = getCcipData(sourceFolksChainId).ccipChainId;
          const ccipRouter = convertFromGenericAddress(
            getCcipData(destFolksChainId).ccipRouter,
            ChainType.EVM,
          );
          return await estimateEvmCcipDataGasLimit(
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            destFolksChainProvider as EVMProvider,
            messageBuilderParams,
            returnGasLimit,
            sourceCcipChainId,
            ccipRouter,
            destAdapterAddress,
            sourceAdapterAddress,
          );
        }
        case AdapterType.CCIP_TOKEN: {
          throw new Error("Not implemented yet: AdapterType.CCIP_TOKEN case");
        }
        default:
          return exhaustiveCheck(adapterId);
      }

    default:
      return exhaustiveCheck(destFolksChain.chainType);
  }
}
