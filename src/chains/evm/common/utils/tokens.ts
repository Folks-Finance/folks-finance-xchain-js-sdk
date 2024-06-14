import { encodeAbiParameters } from "viem";

import { CONTRACT_SLOT } from "../constants/tokens.js";

import { getAllowanceSlotHash } from "./contract.js";

import type { FolksTokenId } from "../../../../common/types/token.js";
import type { EvmFolksChainId } from "../types/chain.js";
import type { AllowanceStateOverride } from "../types/tokens.js";
import type { StateOverride } from "viem";

export function getContractSlot(folksChainId: EvmFolksChainId) {
  const contractSlot = CONTRACT_SLOT[folksChainId];
  if (!contractSlot) {
    throw new Error(`Contract slot not found for folksChainId: ${folksChainId}`);
  }
  return contractSlot;
}

export function getFolksTokenContractSlot(folksChainId: EvmFolksChainId, folksTokenId: FolksTokenId) {
  const contractSlot = getContractSlot(folksChainId);

  const folksTokenContractSlot = contractSlot.erc20[folksTokenId];
  if (!folksTokenContractSlot) {
    throw new Error(`Contract slot not found for folksTokenId: ${folksTokenId}`);
  }
  return folksTokenContractSlot;
}

export function getAllowanceStateOverride(allowanceStatesOverride: Array<AllowanceStateOverride>): StateOverride {
  return allowanceStatesOverride.map((aso) => ({
    address: aso.erc20Address,
    stateDiff: aso.stateDiff.map((sd) => ({
      slot: getAllowanceSlotHash(
        sd.owner,
        sd.spender,
        getFolksTokenContractSlot(sd.folksChainId, sd.folksTokenId).allowance,
      ),
      value: encodeAbiParameters([{ type: "uint256" }], [sd.amount]),
    })),
  }));
}
