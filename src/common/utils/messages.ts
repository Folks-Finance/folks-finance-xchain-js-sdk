import { concat, isHex } from "viem";

import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { UINT16_LENGTH, UINT256_LENGTH } from "../constants/bytes.js";
import { FINALITY } from "../constants/message.js";
import { Action } from "../types/message.js";
import { TokenType } from "../types/token.js";

import { getRandomGenericAddress, isGenericAddress } from "./address.js";
import { convertNumberToBytes } from "./bytes.js";

import type { HubTokenData } from "../../chains/evm/hub/types/token.js";
import type { FolksChainId, GenericAddress } from "../types/chain.js";
import type {
  MessageAdapters,
  MessageParams,
  MessageToSend,
} from "../types/message.js";
import type { SpokeTokenData } from "../types/token.js";
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

export function getSendTokenExtraArgsWhenAdding(
  spokeTokenData: SpokeTokenData,
  hubTokenData: HubTokenData,
  amount: bigint,
): Hex {
  const { tokenType } = spokeTokenData;
  if (tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20)
    return "0x";
  if (spokeTokenData.tokenAddress === null)
    throw Error("Unknown token address");

  return extraArgsToBytes(
    spokeTokenData.tokenAddress,
    hubTokenData.poolAddress,
    amount,
  );
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

export function builMessageToSend(
  accountId: Hex,
  adapters: MessageAdapters,
  action: Action,
  sender: GenericAddress,
  destinationChainId: FolksChainId,
  handler: GenericAddress,
): MessageToSend {
  switch (action) {
    case Action.CreateAccount: {
      // construct message
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
      throw new Error("Not implemented yet: Action.InviteAddress case");
    }
    case Action.AcceptInviteAddress: {
      throw new Error("Not implemented yet: Action.AcceptInviteAddress case");
    }
    case Action.UnregisterAddress: {
      throw new Error("Not implemented yet: Action.UnregisterAddress case");
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
