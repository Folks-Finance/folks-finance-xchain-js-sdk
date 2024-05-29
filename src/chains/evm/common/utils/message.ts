import { concat, isHex } from "viem";

import {
  UINT16_LENGTH,
  UINT256_LENGTH,
  UINT8_LENGTH,
} from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { ChainType } from "../../../../common/types/chain.js";
import { Action } from "../../../../common/types/message.js";
import { TokenType } from "../../../../common/types/token.js";
import {
  convertToGenericAddress,
  getRandomGenericAddress,
  isGenericAddress,
} from "../../../../common/utils/address.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";
import { exhaustiveCheck } from "../../../../utils/exhaustive-check.js";

import type { GenericAddress } from "../../../../common/types/chain.js";
import type {
  MessageAdapters,
  MessageParams,
  MessageToSend,
  MessageToSendBuilderParams,
} from "../../../../common/types/message.js";
import type { SpokeTokenData } from "../../../../common/types/token.js";
import type { HubTokenData } from "../../hub/types/token.js";
import type { Hex } from "viem";

export const DEFAULT_MESSAGE_PARAMS = (
  adapters: MessageAdapters,
): MessageParams => ({
  ...adapters,
  receiverValue: BigInt(0),
  gasLimit: BigInt(30000),
  returnGasLimit: BigInt(0),
});

export function buildMessagePayload(
  action: Action,
  accountId: Hex,
  userAddr: GenericAddress,
  data: string,
): Hex {
  if (!isGenericAddress(accountId)) throw Error("Unknown account id format");
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

export function getSendTokenExtraArgsWhenRemoving(
  spokeTokenData: SpokeTokenData,
  hubTokenData: HubTokenData,
  amount: bigint,
): Hex {
  const { tokenType } = hubTokenData;
  if (tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20)
    return "0x";
  if (hubTokenData.tokenAddress === null) throw Error("Unknown token address");

  return extraArgsToBytes(
    hubTokenData.tokenAddress,
    spokeTokenData.spokeAddress,
    BigInt(amount),
  );
}

export function buildSendTokenExtraArgsWhenAdding(
  tokenType: TokenType,
  spokeTokenAddress: GenericAddress,
  hubPoolAddress: GenericAddress,
  amount: bigint,
): Hex {
  if (tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20)
    return "0x";
  return extraArgsToBytes(spokeTokenAddress, hubPoolAddress, amount);
}

export function buildEvmMessageToSend(
  messageToSendBuilderParams: MessageToSendBuilderParams,
): MessageToSend {
  const {
    accountId,
    adapters,
    sender,
    destinationChainId,
    handler,
    action,
    data,
    extraArgs,
  } = messageToSendBuilderParams;
  switch (action) {
    case Action.CreateAccount: {
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.CreateAccount,
          accountId,
          getRandomGenericAddress(),
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.InviteAddress: {
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.InviteAddress,
          accountId,
          getRandomGenericAddress(),
          concat([
            convertNumberToBytes(data.folksChainIdToInvite, UINT16_LENGTH),
            convertToGenericAddress<ChainType.EVM>(
              data.addressToInvite,
              ChainType.EVM,
            ),
          ]),
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };
      return message;
    }
    case Action.AcceptInviteAddress: {
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.AcceptInviteAddress,
          accountId,
          getRandomGenericAddress(),
          data,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.UnregisterAddress: {
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.UnregisterAddress,
          accountId,
          getRandomGenericAddress(),
          convertNumberToBytes(data.folksChainIdToUnregister, UINT16_LENGTH),
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
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.CreateLoan,
          accountId,
          getRandomGenericAddress(),
          concat([
            data.loanId,
            convertNumberToBytes(data.loanTypeId, UINT16_LENGTH),
          ]),
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.DeleteLoan: {
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.DeleteLoan,
          data.accountId,
          getRandomGenericAddress(),
          data.loanId,
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs,
      };
      return message;
    }
    case Action.Deposit: {
      const params = DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender,
        destinationChainId,
        handler,
        payload: buildMessagePayload(
          Action.Deposit,
          accountId,
          getRandomGenericAddress(),
          concat([
            data.loanId,
            convertNumberToBytes(data.poolId, UINT8_LENGTH),
            convertNumberToBytes(data.amount, UINT256_LENGTH),
          ]),
        ),
        finalityLevel: FINALITY.FINALISED,
        extraArgs: buildSendTokenExtraArgsWhenAdding(
          extraArgs.tokenType,
          extraArgs.spokeTokenAddress,
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
      throw new Error("Not implemented yet: Action.Withdraw case");
    }
    case Action.WithdrawFToken: {
      throw new Error("Not implemented yet: Action.WithdrawFToken case");
    }
    case Action.Borrow: {
      throw new Error("Not implemented yet: Action.Borrow case");
    }
    case Action.Repay: {
      throw new Error("Not implemented yet: Action.Repay case");
    }
    case Action.RepayWithCollateral: {
      throw new Error("Not implemented yet: Action.RepayWithCollateral case");
    }
    case Action.Liquidate: {
      throw new Error("Not implemented yet: Action.Liquidate case");
    }
    case Action.SwitchBorrowType: {
      throw new Error("Not implemented yet: Action.SwitchBorrowType case");
    }
    case Action.SendToken: {
      throw new Error("Not implemented yet: Action.SendToken case");
    }
    default:
      return exhaustiveCheck(action);
  }
}
