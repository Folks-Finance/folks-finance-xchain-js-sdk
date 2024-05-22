import { concat, isHex } from "viem";

import { UINT16_LENGTH, UINT256_LENGTH } from "../constants/bytes.js";
import { TokenType } from "../types/token.js";

import { isGenericAddress } from "./address.js";
import { convertNumberToBytes } from "./bytes.js";

import type { HubTokenData } from "../../chains/evm/hub/types/token.js";
import type { GenericAddress } from "../types/chain.js";
import type {
  MessageAdapters,
  MessageParams,
  Action,
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
