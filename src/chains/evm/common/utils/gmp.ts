import { concat } from "viem";

import { UINT16_LENGTH, UINT256_LENGTH } from "../../../../common/constants/bytes.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { RetryMessageExtraArgs, ReverseMessageExtraArgs } from "../types/gmp.js";
import type { Hex } from "viem";

export function encodeEvmPayloadWithMetadata(
  returnAdapterId: AdapterType,
  returnGasLimit: bigint,
  sender: GenericAddress,
  handler: GenericAddress,
  payload: Hex,
): Hex {
  return concat([
    convertNumberToBytes(returnAdapterId, UINT16_LENGTH),
    convertNumberToBytes(returnGasLimit, UINT256_LENGTH),
    sender,
    handler,
    payload,
  ]);
}

export function encodeRetryMessageExtraArgs(extraArgs?: RetryMessageExtraArgs): Hex {
  if (extraArgs === undefined) return "0x";
  const { returnAdapterId, returnGasLimit } = extraArgs;
  return concat([
    convertNumberToBytes(returnAdapterId, UINT16_LENGTH),
    convertNumberToBytes(returnGasLimit, UINT256_LENGTH),
  ]);
}

export function encodeReverseMessageExtraArgs(extraArgs?: ReverseMessageExtraArgs): Hex {
  if (extraArgs === undefined) return "0x";
  const { accountId, returnAdapterId, returnGasLimit } = extraArgs;
  return concat([
    accountId,
    convertNumberToBytes(returnAdapterId, UINT16_LENGTH),
    convertNumberToBytes(returnGasLimit, UINT256_LENGTH),
  ]);
}
