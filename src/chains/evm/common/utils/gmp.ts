import { concat } from "viem";

import {
  UINT16_LENGTH,
  UINT256_LENGTH,
} from "../../../../common/constants/bytes.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { AdapterType } from "../../../../common/types/message.js";
import type { Hex } from "viem";

export function encodeWormholeEvmPayloadWithMetadata(
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
