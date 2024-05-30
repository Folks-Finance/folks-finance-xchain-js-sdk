import type {
  EvmAddress,
  GenericAddress,
} from "../../../../common/types/address.js";
import type { Hex } from "viem";

type CCIPTokenAmount = {
  token: EvmAddress;
  amount: bigint;
};

export type CCIPAny2EvmMessage = {
  messageId: Hex;
  sourceChainSelector: bigint;
  sender: GenericAddress;
  data: Hex;
  destTokenAmounts: Array<CCIPTokenAmount>;
};
