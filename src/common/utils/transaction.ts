import { waitForTransactionReceipt } from "viem/actions";

import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { ChainType } from "../types/chain.js";

import type { FolksProvider } from "../types/core.js";
import type { Hex, TransactionReceipt } from "viem";

export async function waitTransaction(
  chainType: ChainType,
  folksProvider: FolksProvider,
  txnHash: Hex,
  confirmations = 1,
): Promise<TransactionReceipt> {
  switch (chainType) {
    case ChainType.EVM: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const receipt = await waitForTransactionReceipt(folksProvider!, {
        hash: txnHash,
        confirmations,
      });
      return receipt;
    }
    default:
      return exhaustiveCheck(chainType);
  }
}
