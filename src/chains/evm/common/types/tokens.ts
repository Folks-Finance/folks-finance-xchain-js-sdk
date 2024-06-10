import type { EvmFolksChainId } from "./chain.js";
import type { EvmAddress } from "../../../../common/types/address.js";
import type {
  FolksTokenId,
  TokenType,
} from "../../../../common/types/token.js";

export type Erc20ContractSlot = {
  balanceOf: bigint;
  allowance: bigint;
};

export type AllowanceStateOverride = {
  owner: EvmAddress;
  spender: EvmAddress;
  folksChainId: EvmFolksChainId;
  folksTokenId: FolksTokenId;
  tokenType: TokenType;
  amount: bigint;
};
