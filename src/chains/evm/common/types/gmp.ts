import type { GenericAddress } from "../../../../common/types/chain.js";
import type { Hex } from "viem";

type CCIPTokenAmount = {
  token: GenericAddress;
  amount: bigint;
};

export type CCIPMessageReceived = {
  messageId: Hex;
  sourceChainSelector: bigint;
  sender: GenericAddress;
  data: Hex;
  destTokenAmounts: Array<CCIPTokenAmount>;
};
