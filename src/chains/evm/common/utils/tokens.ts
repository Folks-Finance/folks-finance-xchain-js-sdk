import { encodeAbiParameters } from "viem";

import { TokenType } from "../../../../common/types/token.js";
import { CONTRACT_SLOT } from "../constants/tokens.js";

import { getAllowanceSlotHash } from "./contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { EvmFolksChainId } from "../types/chain.js";

export function getContractSlot(folksChainId: EvmFolksChainId) {
  const contractSlot = CONTRACT_SLOT[folksChainId];
  if (!contractSlot) {
    throw new Error(
      `Contract slot not found for folksChainId: ${folksChainId}`,
    );
  }
  return contractSlot;
}

export function getFolksTokenContractSlot(
  folksChainId: EvmFolksChainId,
  folksTokenId: FolksTokenId,
) {
  const contractSlot = getContractSlot(folksChainId);

  const folksTokenContractSlot = contractSlot.folksToken[folksTokenId];
  if (!folksTokenContractSlot) {
    throw new Error(`Folks Token not found for folksTokenId: ${folksTokenId}`);
  }
  return folksTokenContractSlot;
}

export function getAllowanceStateOverride(
  owner: EvmAddress,
  spender: EvmAddress,
  folksChainId: EvmFolksChainId,
  folksTokenId: FolksTokenId,
  tokenType: TokenType,
  amount: bigint,
) {
  return tokenType === TokenType.NATIVE
    ? []
    : [
        {
          slot: getAllowanceSlotHash(
            owner,
            spender,
            getFolksTokenContractSlot(folksChainId, folksTokenId).allowance,
          ),
          value: encodeAbiParameters([{ type: "uint256" }], [amount]),
        },
      ];
}
