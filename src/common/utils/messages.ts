import {
  buildEvmMessageToSend,
  estimateEvmCcipDataGasLimit,
  estimateEvmWormholeDataGasLimit,
} from "../../chains/evm/common/utils/message.js";
import { getHubChainAdapterAddress } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { ChainType } from "../types/chain.js";
import { AdapterType } from "../types/message.js";

import {
  getGasLimitIncrease,
  transformAdapterForEstimation,
} from "./adapter.js";
import { convertFromGenericAddress } from "./address.js";
import { getFolksChain, getSpokeChainAdapterAddress } from "./chain.js";
import { getCcipData, getWormholeData } from "./gmp.js";

import type { HubChain } from "../../chains/evm/hub/types/chain.js";
import type { GenericAddress } from "../types/address.js";
import type { FolksChain, FolksChainId, NetworkType } from "../types/chain.js";
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

async function estimateAdapterReceiveGasLimit(
  sourceFolksChainId: FolksChainId,
  destFolksChainId: FolksChainId,
  destFolksChainProvider: FolksProvider,
  network: NetworkType,
  adapterId: AdapterType,
  sourceAdapterAddress: GenericAddress,
  destAdapterAddress: GenericAddress,
  messageBuilderParams: MessageBuilderParams,
  receiverValue: bigint,
  returnGasLimit: bigint,
) {
  const destFolksChain = getFolksChain(destFolksChainId, network);
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
            "Not implemented: use WORMHOLE_DATA for estimate instead",
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

export async function estimateReceiveGasLimit(
  hubProvider: FolksProvider,
  hubChain: HubChain,
  folksChain: FolksChain,
  adapters: MessageAdapters,
  messageBuilderParams: MessageBuilderParams,
  receiverValue = BigInt(0),
  returnGasLimit = BigInt(0),
) {
  const estimationAdapters = transformAdapterForEstimation(adapters);
  const gasLimitIncrease = getGasLimitIncrease(adapters);

  const sourceAdapterAddress = getSpokeChainAdapterAddress(
    folksChain.folksChainId,
    folksChain.network,
    estimationAdapters.adapterId,
  );
  const destAdapterAddress = getHubChainAdapterAddress(
    folksChain.network,
    estimationAdapters.adapterId,
  );

  const gasLimitEstimation = await estimateAdapterReceiveGasLimit(
    folksChain.folksChainId,
    hubChain.folksChainId,
    hubProvider,
    folksChain.network,
    estimationAdapters.adapterId,
    sourceAdapterAddress,
    destAdapterAddress,
    messageBuilderParams,
    receiverValue,
    returnGasLimit,
  );
  return gasLimitEstimation + gasLimitIncrease;
}

export async function estimateReturnReceiveGasLimit(
  receiverFolksChainProvider: FolksProvider,
  receiverFolksChain: FolksChain,
  hubChain: HubChain,
  adapters: MessageAdapters,
  messageBuilderParams: MessageBuilderParams,
) {
  const estimationAdapters = transformAdapterForEstimation(adapters);
  const gasLimitIncrease = getGasLimitIncrease(adapters);

  const sourceAdapterAddress = getHubChainAdapterAddress(
    receiverFolksChain.network,
    estimationAdapters.returnAdapterId,
  );
  const destAdapterAddress = getSpokeChainAdapterAddress(
    receiverFolksChain.folksChainId,
    receiverFolksChain.network,
    estimationAdapters.returnAdapterId,
  );

  const gasLimitEstimation = await estimateAdapterReceiveGasLimit(
    hubChain.folksChainId,
    receiverFolksChain.folksChainId,
    receiverFolksChainProvider,
    receiverFolksChain.network,
    estimationAdapters.returnAdapterId,
    sourceAdapterAddress,
    destAdapterAddress,
    messageBuilderParams,
    BigInt(0),
    BigInt(0),
  );
  return gasLimitEstimation + gasLimitIncrease;
}
