import { encodeAbiParameters } from "viem";

import { TokenType } from "../../../../common/types/token.js";
import { CONTRACT_SLOT } from "../constants/tokens.js";

import { getAllowanceSlotHash } from "./contract.js";

import type { FolksTokenId } from "../../../../common/types/token.js";
import type { EvmFolksChainId } from "../types/chain.js";
import type { AllowanceStateOverride } from "../types/tokens.js";

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

  const folksTokenContractSlot = contractSlot.erc20[folksTokenId];
  if (!folksTokenContractSlot) {
    throw new Error(
      `Contract slot not found for folksTokenId: ${folksTokenId}`,
    );
  }
  return folksTokenContractSlot;
}

export function getAllowanceStateOverride(
  allowanceStatesOverride: Array<AllowanceStateOverride>,
) {
  return allowanceStatesOverride
    .filter(
      (aso) =>
        aso.tokenType == TokenType.ERC20 || aso.tokenType == TokenType.CIRCLE,
    )
    .map((aso) => ({
      slot: getAllowanceSlotHash(
        aso.owner,
        aso.spender,
        getFolksTokenContractSlot(aso.folksChainId, aso.folksTokenId).allowance,
      ),
      value: encodeAbiParameters([{ type: "uint256" }], [aso.amount]),
    }));
}
