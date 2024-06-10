import { encodeAbiParameters } from "viem";

import { ChainType } from "../../../../common/types/chain.js";
import { TokenType } from "../../../../common/types/token.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { CONTRACT_SLOT } from "../constants/tokens.js";

import { getAllowanceSlotHash } from "./contract.js";

import type { GenericAddress } from "../../../../common/types/address.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { EvmFolksChainId } from "../types/chain.js";
import type { AllowanceStateOverride } from "../types/tokens.js";
import type { StateOverride } from "viem";

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
  contractAddress: GenericAddress | null,
  allowanceStatesOverride: Array<AllowanceStateOverride>,
): StateOverride {
  if (contractAddress === null) return [];
  return [
    {
      address: convertFromGenericAddress(contractAddress, ChainType.EVM),
      stateDiff: allowanceStatesOverride
        .filter(
          (aso) =>
            aso.tokenType == TokenType.ERC20 ||
            aso.tokenType == TokenType.CIRCLE,
        )
        .map((aso) => ({
          slot: getAllowanceSlotHash(
            aso.owner,
            aso.spender,
            getFolksTokenContractSlot(aso.folksChainId, aso.folksTokenId)
              .allowance,
          ),
          value: encodeAbiParameters([{ type: "uint256" }], [aso.amount]),
        })),
    },
  ];
}
