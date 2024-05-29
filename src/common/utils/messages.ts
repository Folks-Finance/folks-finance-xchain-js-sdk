import { concat } from "viem";

import { buildEvmMessageToSend } from "../../chains/evm/common/utils/message.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { UINT256_LENGTH } from "../constants/bytes.js";
import { ChainType } from "../types/chain.js";
import { TokenType } from "../types/token.js";

import { isGenericAddress } from "./address.js";
import { convertNumberToBytes } from "./bytes.js";

import type { HubTokenData } from "../../chains/evm/hub/types/token.js";
import type { GenericAddress } from "../types/chain.js";
import type {
  MessageToSend,
  MessageToSendBuilderParams,
} from "../types/message.js";
import type { SpokeTokenData } from "../types/token.js";
import type { Hex } from "viem";

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

export function buildMessageToSend(
  chainType: ChainType,
  messageToSendBuilderParams: MessageToSendBuilderParams,
): MessageToSend {
  switch (chainType) {
    case ChainType.EVM: {
      return buildEvmMessageToSend(messageToSendBuilderParams);
    }
    default:
      return exhaustiveCheck(chainType);
  }
}
