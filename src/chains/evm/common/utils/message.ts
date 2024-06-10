import { concat, isHex } from "viem";

import {
  BYTES32_LENGTH,
  UINT16_LENGTH,
  UINT256_LENGTH,
  UINT8_LENGTH,
} from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { Action } from "../../../../common/types/message.js";
import { TokenType } from "../../../../common/types/token.js";
import {
  isAccountId,
  isGenericAddress,
} from "../../../../common/utils/address.js";
import {
  convertBooleanToByte,
  convertNumberToBytes,
  getRandomBytes,
} from "../../../../common/utils/bytes.js";
import { exhaustiveCheck } from "../../../../utils/exhaustive-check.js";

import {
  getCCIPDataAdapterContract as getCcipDataAdapterContract,
  getWormholeDataAdapterContract,
} from "./contract.js";
import { encodeEvmPayloadWithMetadata } from "./gmp.js";

import type {
  EvmAddress,
  GenericAddress,
} from "../../../../common/types/address.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type {
  MessageAdapters,
  MessageBuilderParams,
  MessageParams,
  MessageToSend,
  OptionalFeeParams,
} from "../../../../common/types/message.js";
import type { SpokeTokenType } from "../../../../common/types/token.js";
import type { CCIPAny2EvmMessage } from "../types/gmp.js";
import type { Client, Hex } from "viem";

export const buildMessageParams = ({
  adapters,
  receiverValue = BigInt(0),
  gasLimit = BigInt(0),
  returnGasLimit = BigInt(0),
}: {
  adapters: MessageAdapters;
  receiverValue?: bigint;
  gasLimit?: bigint;
  returnGasLimit?: bigint;
}): MessageParams => ({
  ...adapters,
  receiverValue,
  gasLimit,
  returnGasLimit,
});

export function buildMessagePayload(
  action: Action,
  accountId: AccountId,
  userAddr: GenericAddress,
  data: Hex,
): Hex {
  if (!isAccountId(accountId)) throw Error("Unknown account id format");
  if (!isGenericAddress(userAddr)) throw Error("Unknown user address format");
  if (!isHex(data)) throw Error("Unknown data format");

  return concat([
    convertNumberToBytes(action, UINT16_LENGTH),
    accountId,
    userAddr,
    data,
  ]);
}

export function extraArgsToBytes(
  tokenAddr: GenericAddress,
  recipientAddr: GenericAddress,
  amount: bigint,
): Hex {
  if (!isGenericAddress(tokenAddr)) throw Error("Unknown token address format");
  if (!isGenericAddress(recipientAddr))
    throw Error("Unknown recipient address format");

  return concat([
    "0x1b366e79",
    tokenAddr,
    recipientAddr,
    convertNumberToBytes(amount, UINT256_LENGTH),
  ]);
}

export function buildSendTokenExtraArgsWhenRemoving(
  tokenType: TokenType,
  spokeAddress: GenericAddress,
  hubTokenAddress: GenericAddress,
  amount: bigint,
): Hex {
  if (tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20)
    return "0x";
  return extraArgsToBytes(hubTokenAddress, spokeAddress, BigInt(amount));
}

export function buildSendTokenExtraArgsWhenAdding(
  spokeTokenType: SpokeTokenType,
  hubPoolAddress: GenericAddress,
  amount: bigint,
): Hex {
  const { type, address } = spokeTokenType;
  if (type === TokenType.NATIVE || type === TokenType.ERC20) return "0x";
  return extraArgsToBytes(address, hubPoolAddress, amount);
}

export function buildEvmMessageData(
  messageToSendBuilderParams: MessageBuilderParams,
): Hex {
  const { action, data } = messageToSendBuilderParams;
  switch (action) {
    case Action.CreateAccount: {
      return data.refAccountId;
    }
    case Action.InviteAddress: {
      return concat([
        convertNumberToBytes(data.folksChainIdToInvite, UINT16_LENGTH),
        data.addressToInvite,
        data.refAccountId,
      ]);
    }
    case Action.AcceptInviteAddress: {
      return data;
    }
    case Action.UnregisterAddress: {
      return convertNumberToBytes(data.folksChainIdToUnregister, UINT16_LENGTH);
    }
    case Action.AddDelegate: {
      throw new Error("Not implemented yet: Action.AddDelegate case");
    }
    case Action.RemoveDelegate: {
      throw new Error("Not implemented yet: Action.RemoveDelegate case");
    }
    case Action.CreateLoan: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.loanTypeId, UINT16_LENGTH),
      ]);
    }
    case Action.DeleteLoan: {
      return data.loanId;
    }
    case Action.Deposit: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.poolId, UINT8_LENGTH),
        convertNumberToBytes(data.amount, UINT256_LENGTH),
      ]);
    }
    case Action.DepositFToken: {
      throw new Error("Not implemented yet: Action.DepositFToken case");
    }
    case Action.Withdraw: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.poolId, UINT8_LENGTH),
        convertNumberToBytes(data.receiverFolksChainId, UINT16_LENGTH),
        convertNumberToBytes(data.amount, UINT256_LENGTH),
        convertBooleanToByte(data.isFAmount),
      ]);
    }
    case Action.WithdrawFToken: {
      throw new Error("Not implemented yet: Action.WithdrawFToken case");
    }
    case Action.Borrow: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.poolId, UINT8_LENGTH),
        convertNumberToBytes(data.receiverFolksChainId, UINT16_LENGTH),
        convertNumberToBytes(data.amount, UINT256_LENGTH),
        convertNumberToBytes(data.maxStableRate, UINT256_LENGTH),
      ]);
    }
    case Action.Repay: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.poolId, UINT8_LENGTH),
        convertNumberToBytes(data.amount, UINT256_LENGTH),
        convertNumberToBytes(data.maxOverRepayment, UINT256_LENGTH),
      ]);
    }
    case Action.RepayWithCollateral: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.poolId, UINT8_LENGTH),
        convertNumberToBytes(data.amount, UINT256_LENGTH),
      ]);
    }
    case Action.Liquidate: {
      throw new Error("Not implemented yet: Action.Liquidate case");
    }
    case Action.SwitchBorrowType: {
      return concat([
        data.loanId,
        convertNumberToBytes(data.poolId, UINT8_LENGTH),
        convertNumberToBytes(data.maxStableRate, UINT256_LENGTH),
      ]);
    }
    case Action.SendToken: {
      throw new Error("Not implemented yet: Action.SendToken case");
    }
    default:
      return exhaustiveCheck(action);
  }
}

export function buildEvmMessageToSend(
  messageToSendBuilderParams: MessageBuilderParams,
  feeParams: OptionalFeeParams,
): MessageToSend {
  const {
    userAddress,
    accountId,
    adapters,
    sender,
    destinationChainId,
    handler,
    action,
    extraArgs,
  } = messageToSendBuilderParams;
  const data = buildEvmMessageData(messageToSendBuilderParams);
  const params = buildMessageParams({ adapters, ...feeParams });
  switch (action) {
    case Action.CreateAccount: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.CreateAccount,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.InviteAddress: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.InviteAddress,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };
      return message;
    }
    case Action.AcceptInviteAddress: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.AcceptInviteAddress,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.UnregisterAddress: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.UnregisterAddress,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.AddDelegate: {
      throw new Error("Not implemented yet: Action.AddDelegate case");
    }
    case Action.RemoveDelegate: {
      throw new Error("Not implemented yet: Action.RemoveDelegate case");
    }
    case Action.CreateLoan: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.CreateLoan,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.DeleteLoan: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.DeleteLoan,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.Deposit: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.Deposit,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.FINALISED,
        extraArgs: buildSendTokenExtraArgsWhenAdding(
          extraArgs.token,
          extraArgs.hubPoolAddress,
          extraArgs.amount,
        ),
      };
      return message;
    }
    case Action.DepositFToken: {
      throw new Error("Not implemented yet: Action.DepositFToken case");
    }
    case Action.Withdraw: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.Withdraw,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.WithdrawFToken: {
      throw new Error("Not implemented yet: Action.WithdrawFToken case");
    }
    case Action.Borrow: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.Borrow,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.Repay: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.Repay,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.FINALISED,
        extraArgs: buildSendTokenExtraArgsWhenAdding(
          extraArgs.token,
          extraArgs.hubPoolAddress,
          extraArgs.amount,
        ),
      };
      return message;
    }
    case Action.RepayWithCollateral: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.RepayWithCollateral,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.Liquidate: {
      throw new Error("Not implemented yet: Action.Liquidate case");
    }
    case Action.SwitchBorrowType: {
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.SwitchBorrowType,
          accountId,
          userAddress,
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.SendToken: {
      throw new Error("Not implemented yet: Action.SendToken case");
    }
    default:
      return exhaustiveCheck(action);
  }
}

export async function estimateEvmWormholeDataGasLimit(
  provider: Client,
  messageBuilderParams: MessageBuilderParams,
  receiverValue: bigint,
  returnGasLimit: bigint,
  sourceWormholeChainId: number,
  wormholeRelayer: EvmAddress,
  wormholeDataAdapterAddress: GenericAddress,
  sourceWormholeDataAdapterAddress: GenericAddress,
) {
  const messageId = getRandomBytes(BYTES32_LENGTH);
  const wormholeDataAdapter = getWormholeDataAdapterContract(
    provider,
    wormholeDataAdapterAddress,
  );
  return await wormholeDataAdapter.estimateGas.receiveWormholeMessages(
    [
      encodeEvmPayloadWithMetadata(
        messageBuilderParams.adapters.returnAdapterId,
        returnGasLimit,
        messageBuilderParams.sender,
        messageBuilderParams.handler,
        buildMessagePayload(
          messageBuilderParams.action,
          messageBuilderParams.accountId,
          messageBuilderParams.userAddress,
          buildEvmMessageData(messageBuilderParams),
        ),
      ),
      [],
      sourceWormholeDataAdapterAddress,
      sourceWormholeChainId,
      messageId,
    ],
    {
      value: receiverValue,
      account: wormholeRelayer,
      stateOverride: [{ address: wormholeRelayer, balance: receiverValue }],
    },
  );
}

export async function estimateEvmCcipDataGasLimit(
  provider: Client,
  messageBuilderParams: MessageBuilderParams,
  returnGasLimit: bigint,
  sourceCcipChainId: bigint,
  ccipRouter: EvmAddress,
  ccipDataAdapterAddress: GenericAddress,
  sourceCcipDataAdapterAddress: GenericAddress,
) {
  const messageId = getRandomBytes(BYTES32_LENGTH);

  const ccipMessage: CCIPAny2EvmMessage = {
    messageId,
    sourceChainSelector: sourceCcipChainId,
    sender: sourceCcipDataAdapterAddress,
    data: encodeEvmPayloadWithMetadata(
      messageBuilderParams.adapters.returnAdapterId,
      returnGasLimit,
      messageBuilderParams.sender,
      messageBuilderParams.handler,
      buildMessagePayload(
        messageBuilderParams.action,
        messageBuilderParams.accountId,
        messageBuilderParams.userAddress,
        buildEvmMessageData(messageBuilderParams),
      ),
    ),
    destTokenAmounts: [],
  };

  const ccipDataAdapter = getCcipDataAdapterContract(
    provider,
    ccipDataAdapterAddress,
  );
  return await ccipDataAdapter.estimateGas.ccipReceive([ccipMessage], {
    account: ccipRouter,
  });
}
