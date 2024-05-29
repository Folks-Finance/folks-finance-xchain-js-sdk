import { buildEvmMessageToSend } from "../../chains/evm/common/utils/message.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { ChainType } from "../types/chain.js";

import type {
  MessageToSend,
  MessageToSendBuilderParams,
} from "../types/message.js";

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
