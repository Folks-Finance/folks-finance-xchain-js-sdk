import { concat, isHex } from "viem";

import { UINT16_LENGTH } from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { ChainType } from "../../../../common/types/chain.js";
import { Action } from "../../../../common/types/message.js";
import {
  convertToGenericAddress,
  getRandomGenericAddress,
  isGenericAddress,
} from "../../../../common/utils/address.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";
import { exhaustiveCheck } from "../../../../utils/exhaustive-check.js";

import type {
  FolksChainId,
  GenericAddress,
} from "../../../../common/types/chain.js";
import type {
  InviteAddressMessageData,
  MessageAdapters,
  MessageData,
  MessageParams,
  MessageToSend,
  UnregisterAddressMessageData,
} from "../../../../common/types/message.js";
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

export function buildEvmMessageToSend(
  accountId: Hex,
  adapters: MessageAdapters,
  action: Action,
  sender: GenericAddress,
  destinationChainId: FolksChainId,
  handler: GenericAddress,
  data: MessageData = "0x",
): MessageToSend {
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
          "0x",
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };
      return message;
    }
    case Action.InviteAddress: {
      const inviteAddressMessageData = data as InviteAddressMessageData;

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
            convertNumberToBytes(
              inviteAddressMessageData.folksChainIdToInvite,
              UINT16_LENGTH,
            ),
            convertToGenericAddress<ChainType.EVM>(
              inviteAddressMessageData.addressToInvite,
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
          "0x",
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };
      return message;
    }
    case Action.UnregisterAddress: {
      const unregisterAddressMessageData = data as UnregisterAddressMessageData;

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
          convertNumberToBytes(
            unregisterAddressMessageData.folksChainIdToUnregister,
            UINT16_LENGTH,
          ),
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
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
      throw new Error("Not implemented yet: Action.CreateLoan case");
    }
    case Action.DeleteLoan: {
      throw new Error("Not implemented yet: Action.DeleteLoan case");
    }
    case Action.Deposit: {
      throw new Error("Not implemented yet: Action.Deposit case");
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
