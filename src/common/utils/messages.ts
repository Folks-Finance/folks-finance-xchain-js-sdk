import {
  bytesToBigInt,
  bytesToBool,
  bytesToHex,
  bytesToNumber,
  hexToBytes,
  hexToNumber,
  parseEventLogs,
  sliceHex,
} from "viem";
import { getTransactionReceipt } from "viem/actions";

import { WormholeDataAdapterAbi } from "../../chains/evm/common/constants/abi/wormhole-data-adapter-abi.js";
import { GAS_LIMIT_ESTIMATE_INCREASE } from "../../chains/evm/common/constants/contract.js";
import {
  buildEvmMessageToSend,
  estimateEvmCcipDataGasLimit,
  estimateEvmWormholeDataGasLimit,
  getSendTokenStateOverride,
} from "../../chains/evm/common/utils/message.js";
import { getHubChainAdapterAddress } from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { BYTES32_LENGTH, BYTES4_LENGTH, UINT16_LENGTH, UINT256_LENGTH, UINT8_LENGTH } from "../constants/bytes.js";
import { REVERSIBLE_HUB_ACTIONS, SEND_TOKEN_ACTIONS } from "../constants/message.js";
import { ChainType } from "../types/chain.js";
import { MessageDirection } from "../types/gmp.js";
import { Action, AdapterType } from "../types/message.js";

import { convertFromGenericAddress } from "./address.js";
import { getFolksChain, getSpokeChainAdapterAddress } from "./chain.js";
import { getCcipData, getWormholeData } from "./gmp.js";
import { waitTransaction } from "./transaction.js";

import type { GenericAddress } from "../types/address.js";
import type { FolksChainId, NetworkType } from "../types/chain.js";
import type { FolksProvider } from "../types/core.js";
import type { AccountId, LoanId, LoanName, Nonce } from "../types/lending.js";
import type {
  MessageAdapters,
  MessageBuilderParams,
  MessageDataMap,
  MessageToSend,
  OptionalFeeParams,
  Payload,
} from "../types/message.js";
import type { Client as EVMProvider, Hex, StateOverride } from "viem";

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

function getAdapterId(messageDirection: MessageDirection, adapters: MessageAdapters): AdapterType {
  if (messageDirection === MessageDirection.SpokeToHub) return adapters.adapterId;
  return adapters.returnAdapterId;
}

function getAdaptersAddresses(
  messageDirection: MessageDirection,
  sourceFolksChainId: FolksChainId,
  destFolksChainId: FolksChainId,
  network: NetworkType,
  adapterId: AdapterType,
) {
  if (messageDirection === MessageDirection.SpokeToHub)
    return {
      sourceAdapterAddress: getSpokeChainAdapterAddress(sourceFolksChainId, network, adapterId),
      destAdapterAddress: getHubChainAdapterAddress(network, adapterId),
    };
  return {
    sourceAdapterAddress: getHubChainAdapterAddress(network, adapterId),
    destAdapterAddress: getSpokeChainAdapterAddress(destFolksChainId, network, adapterId),
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

  const adapterId = getAdapterId(messageDirection, messageBuilderParams.adapters);
  const { sourceAdapterAddress, destAdapterAddress } = getAdaptersAddresses(
    messageDirection,
    sourceFolksChainId,
    destFolksChainId,
    network,
    adapterId,
  );

  switch (destFolksChain.chainType) {
    case ChainType.EVM: {
      let stateOverride: StateOverride = [];
      if (messageBuilderParams.action === Action.SendToken) {
        stateOverride = stateOverride.concat(
          getSendTokenStateOverride(destFolksChainId, messageBuilderParams.overrideData),
        );
      }
      switch (adapterId) {
        case AdapterType.HUB: {
          return 0n;
        }
        case AdapterType.WORMHOLE_DATA: {
          const sourceWormholeChainId = getWormholeData(sourceFolksChainId).wormholeChainId;
          const wormholeRelayer = convertFromGenericAddress(
            getWormholeData(destFolksChainId).wormholeRelayer,
            ChainType.EVM,
          );

          const gasLimitEstimation = await estimateEvmWormholeDataGasLimit(
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            destFolksChainProvider as EVMProvider,
            messageBuilderParams,
            receiverValue,
            returnGasLimit,
            sourceWormholeChainId,
            wormholeRelayer,
            destAdapterAddress,
            sourceAdapterAddress,
            stateOverride,
          );
          return gasLimitEstimation + GAS_LIMIT_ESTIMATE_INCREASE;
        }
        case AdapterType.WORMHOLE_CCTP: {
          const { sourceAdapterAddress, destAdapterAddress } = getAdaptersAddresses(
            messageDirection,
            sourceFolksChainId,
            destFolksChainId,
            network,
            AdapterType.WORMHOLE_DATA,
          );
          const sourceWormholeChainId = getWormholeData(sourceFolksChainId).wormholeChainId;
          const wormholeRelayer = convertFromGenericAddress(
            getWormholeData(destFolksChainId).wormholeRelayer,
            ChainType.EVM,
          );

          // Due to ERC20 transfer and additional checks in the Wormhole CCTP Adapter
          const ADAPTER_EXTRA_GAS_LIMIT = 150_000n;

          const gasLimitEstimation = await estimateEvmWormholeDataGasLimit(
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            destFolksChainProvider as EVMProvider,
            messageBuilderParams,
            receiverValue,
            returnGasLimit,
            sourceWormholeChainId,
            wormholeRelayer,
            destAdapterAddress,
            sourceAdapterAddress,
            stateOverride,
          );
          return gasLimitEstimation + ADAPTER_EXTRA_GAS_LIMIT + GAS_LIMIT_ESTIMATE_INCREASE;
        }
        case AdapterType.CCIP_DATA: {
          const sourceCcipChainId = getCcipData(sourceFolksChainId).ccipChainId;
          const ccipRouter = convertFromGenericAddress(getCcipData(destFolksChainId).ccipRouter, ChainType.EVM);

          const gasLimitEstimation = await estimateEvmCcipDataGasLimit(
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            destFolksChainProvider as EVMProvider,
            messageBuilderParams,
            returnGasLimit,
            sourceCcipChainId,
            ccipRouter,
            destAdapterAddress,
            sourceAdapterAddress,
          );
          return gasLimitEstimation + GAS_LIMIT_ESTIMATE_INCREASE;
        }
        case AdapterType.CCIP_TOKEN: {
          const { sourceAdapterAddress, destAdapterAddress } = getAdaptersAddresses(
            messageDirection,
            sourceFolksChainId,
            destFolksChainId,
            network,
            AdapterType.CCIP_DATA,
          );
          const sourceCcipChainId = getCcipData(sourceFolksChainId).ccipChainId;
          const ccipRouter = convertFromGenericAddress(getCcipData(destFolksChainId).ccipRouter, ChainType.EVM);

          // Due to ERC20 transfer and additional checks in the CCIP Token Adapter
          const ADAPTER_EXTRA_GAS_LIMIT = 150_000n;

          const gasLimitEstimation = await estimateEvmCcipDataGasLimit(
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            destFolksChainProvider as EVMProvider,
            messageBuilderParams,
            returnGasLimit,
            sourceCcipChainId,
            ccipRouter,
            destAdapterAddress,
            sourceAdapterAddress,
          );
          return gasLimitEstimation + ADAPTER_EXTRA_GAS_LIMIT + GAS_LIMIT_ESTIMATE_INCREASE;
        }
        default:
          return exhaustiveCheck(adapterId);
      }
    }
    default:
      return exhaustiveCheck(destFolksChain.chainType);
  }
}

export async function getOperationIdsByTransaction(chainType: ChainType, folksProvider: FolksProvider, txnHash: Hex) {
  switch (chainType) {
    case ChainType.EVM: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const receipt = await getTransactionReceipt(folksProvider!, {
        hash: txnHash,
      });
      const logs = parseEventLogs({
        abi: WormholeDataAdapterAbi,
        logs: receipt.logs,
        eventName: "SendMessage",
      });
      return logs.map((log) => log.args.operationId);
    }
    default:
      return exhaustiveCheck(chainType);
  }
}

export async function waitOperationIds(
  chainType: ChainType,
  folksProvider: FolksProvider,
  txnHash: Hex,
  confirmations = 1,
) {
  switch (chainType) {
    case ChainType.EVM: {
      const receipt = await waitTransaction(chainType, folksProvider, txnHash, confirmations);
      return await getOperationIdsByTransaction(chainType, folksProvider, receipt.transactionHash);
    }
    default:
      return exhaustiveCheck(chainType);
  }
}

export function isReversibleAction(action: Action, messageDirection: MessageDirection) {
  // @ts-expect-error: ts(2345)
  return messageDirection === MessageDirection.HubToSpoke && REVERSIBLE_HUB_ACTIONS.includes(action);
}

export function assertReversibleAction(action: Action, messageDirection: MessageDirection) {
  if (!isReversibleAction(action, messageDirection))
    throw new Error(`Action ${action} is not reversible for message direction ${messageDirection}`);
}

export function isRetryableAction(action: Action, messageDirection: MessageDirection) {
  // @ts-expect-error: ts(2345)
  return messageDirection === MessageDirection.HubToSpoke || SEND_TOKEN_ACTIONS.includes(action);
}

export function assertRetryableAction(action: Action, messageDirection: MessageDirection) {
  if (!isRetryableAction(action, messageDirection))
    throw new Error(`Action ${action} is not retryable for message direction ${messageDirection}`);
}

export function decodeMessagePayload(payload: Hex): Payload {
  return {
    action: hexToNumber(sliceHex(payload, 0, UINT16_LENGTH)) as Action,
    accountId: sliceHex(payload, UINT16_LENGTH, UINT16_LENGTH + BYTES32_LENGTH) as AccountId,
    userAddr: sliceHex(
      payload,
      UINT16_LENGTH + BYTES32_LENGTH,
      UINT16_LENGTH + BYTES32_LENGTH + BYTES32_LENGTH,
    ) as GenericAddress,
    data: sliceHex(payload, UINT16_LENGTH + BYTES32_LENGTH + BYTES32_LENGTH),
  };
}

export function decodeMessagePayloadData<A extends Action>(action: A, data: Hex): MessageDataMap[A] {
  const bytes = hexToBytes(data);
  switch (action) {
    case Action.CreateAccount: {
      return {
        nonce: bytesToHex(bytes.slice(0, BYTES4_LENGTH)) as Nonce,
        refAccountId: bytesToHex(bytes.slice(-BYTES32_LENGTH)) as AccountId,
      } as MessageDataMap[A];
    }
    case Action.InviteAddress: {
      return {
        folksChainIdToInvite: bytesToNumber(bytes.slice(0, UINT16_LENGTH)) as FolksChainId,
        addressToInvite: bytesToHex(bytes.slice(UINT16_LENGTH, -BYTES32_LENGTH)) as GenericAddress,
        refAccountId: bytesToHex(bytes.slice(-BYTES32_LENGTH)) as AccountId,
      } as MessageDataMap[A];
    }
    case Action.UnregisterAddress: {
      return {
        folksChainIdToUnregister: bytesToNumber(bytes.slice(0, UINT16_LENGTH)) as FolksChainId,
      } as MessageDataMap[A];
    }
    case Action.CreateLoan: {
      return {
        nonce: bytesToHex(bytes.slice(0, BYTES4_LENGTH)) as Nonce,
        loanTypeId: bytesToNumber(bytes.slice(BYTES4_LENGTH, BYTES4_LENGTH + UINT16_LENGTH)),
        loanName: bytesToHex(bytes.slice(BYTES4_LENGTH + UINT16_LENGTH)) as LoanName,
      } as MessageDataMap[A];
    }
    case Action.CreateLoanAndDeposit: {
      return {
        nonce: bytesToHex(bytes.slice(0, BYTES4_LENGTH)) as Nonce,
        poolId: bytesToNumber(bytes.slice(BYTES4_LENGTH, BYTES4_LENGTH + UINT8_LENGTH)),
        amount: bytesToBigInt(bytes.slice(BYTES4_LENGTH + UINT8_LENGTH, BYTES4_LENGTH + UINT8_LENGTH + UINT256_LENGTH)),
        loanTypeId: bytesToNumber(
          bytes.slice(
            BYTES4_LENGTH + UINT8_LENGTH + UINT256_LENGTH,
            BYTES4_LENGTH + UINT8_LENGTH + UINT256_LENGTH + UINT16_LENGTH,
          ),
        ),
        loanName: bytesToHex(bytes.slice(BYTES4_LENGTH + UINT8_LENGTH + UINT256_LENGTH + UINT16_LENGTH)) as LoanName,
      } as MessageDataMap[A];
    }
    case Action.Deposit: {
      return {
        loanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        poolId: bytesToNumber(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH + UINT8_LENGTH)),
        amount: bytesToBigInt(bytes.slice(BYTES32_LENGTH + UINT8_LENGTH)),
      } as MessageDataMap[A];
    }
    case Action.Withdraw: {
      return {
        loanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        poolId: bytesToNumber(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH + UINT8_LENGTH)),
        receiverFolksChainId: bytesToNumber(
          bytes.slice(BYTES32_LENGTH + UINT8_LENGTH, BYTES32_LENGTH + UINT8_LENGTH + UINT16_LENGTH),
        ) as FolksChainId,
        amount: bytesToBigInt(bytes.slice(BYTES32_LENGTH + UINT8_LENGTH + UINT16_LENGTH, -1)),
        isFAmount: bytesToBool(bytes.slice(-1)),
      } as MessageDataMap[A];
    }
    case Action.Borrow: {
      return {
        loanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        poolId: bytesToNumber(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH + UINT8_LENGTH)),
        receiverFolksChainId: bytesToNumber(
          bytes.slice(BYTES32_LENGTH + UINT8_LENGTH, BYTES32_LENGTH + UINT8_LENGTH + UINT16_LENGTH),
        ) as FolksChainId,
        amount: bytesToBigInt(
          bytes.slice(
            BYTES32_LENGTH + UINT8_LENGTH + UINT16_LENGTH,
            BYTES32_LENGTH + UINT8_LENGTH + UINT16_LENGTH + UINT256_LENGTH,
          ),
        ),
        maxStableRate: bytesToBigInt(bytes.slice(BYTES32_LENGTH + UINT8_LENGTH + UINT16_LENGTH + UINT256_LENGTH)),
      } as MessageDataMap[A];
    }
    case Action.Repay: {
      return {
        loanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        poolId: bytesToNumber(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH + UINT8_LENGTH)),
        amount: bytesToBigInt(
          bytes.slice(BYTES32_LENGTH + UINT8_LENGTH, BYTES32_LENGTH + UINT8_LENGTH + UINT256_LENGTH),
        ),
        maxOverRepayment: bytesToBigInt(bytes.slice(BYTES32_LENGTH + UINT8_LENGTH + UINT256_LENGTH)),
      } as MessageDataMap[A];
    }
    case Action.RepayWithCollateral: {
      return {
        loanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        poolId: bytesToNumber(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH + UINT8_LENGTH)),
        amount: bytesToBigInt(bytes.slice(BYTES32_LENGTH + UINT8_LENGTH)),
      } as MessageDataMap[A];
    }
    case Action.Liquidate: {
      return {
        violatorLoanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        liquidatorLoanId: bytesToHex(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH * 2)) as LoanId,
        colPoolId: bytesToNumber(bytes.slice(BYTES32_LENGTH * 2, BYTES32_LENGTH * 2 + UINT8_LENGTH)),
        borPoolId: bytesToNumber(bytes.slice(BYTES32_LENGTH * 2 + UINT8_LENGTH, BYTES32_LENGTH * 2 + UINT8_LENGTH * 2)),
        repayingAmount: bytesToBigInt(
          bytes.slice(BYTES32_LENGTH * 2 + UINT8_LENGTH * 2, BYTES32_LENGTH * 2 + UINT8_LENGTH * 2 + UINT256_LENGTH),
        ),
        minSeizedAmount: bytesToBigInt(bytes.slice(BYTES32_LENGTH * 2 + UINT8_LENGTH * 2 + UINT256_LENGTH)),
      } as MessageDataMap[A];
    }
    case Action.SwitchBorrowType: {
      return {
        loanId: bytesToHex(bytes.slice(0, BYTES32_LENGTH)) as LoanId,
        poolId: bytesToNumber(bytes.slice(BYTES32_LENGTH, BYTES32_LENGTH + UINT8_LENGTH)),
        maxStableRate: bytesToBigInt(bytes.slice(BYTES32_LENGTH + UINT8_LENGTH)),
      } as MessageDataMap[A];
    }
    case Action.SendToken: {
      return {
        amount: bytesToBigInt(bytes),
      } as MessageDataMap[A];
    }
    case Action.AcceptInviteAddress:
    case Action.AddDelegate:
    case Action.RemoveDelegate:
    case Action.DeleteLoan:
    case Action.DepositFToken:
    case Action.WithdrawFToken:
      throw new Error("No data to decode for this action");
    default:
      return exhaustiveCheck(action);
  }
}
