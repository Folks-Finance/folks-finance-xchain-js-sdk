import { concat } from "viem";

import {
  UINT16_LENGTH,
  UINT256_LENGTH,
  UINT32_LENGTH,
  UINT64_LENGTH,
} from "../../../../common/constants/bytes.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { AdapterType } from "../../../../common/types/message.js";
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

export function encodePayloadWithCCTPMetadata(
  returnAdapterId: AdapterType,
  returnGasLimit: bigint,
  sender: GenericAddress,
  handler: GenericAddress,
  payload: Hex,
  sourceDomainId: number,
  amount: bigint,
  nonce: bigint,
  recipientAddr: GenericAddress,
): Hex {
  return concat([
    convertNumberToBytes(sourceDomainId, UINT32_LENGTH),
    convertNumberToBytes(amount, UINT256_LENGTH),
    convertNumberToBytes(nonce, UINT64_LENGTH),
    recipientAddr,
    convertNumberToBytes(returnAdapterId, UINT16_LENGTH),
    convertNumberToBytes(returnGasLimit, UINT256_LENGTH),
    sender,
    handler,
    payload,
  ]);
}
