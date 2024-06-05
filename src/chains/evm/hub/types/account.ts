import type { GenericAddress } from "../../../../common/types/address.js";
import type { FolksChainId } from "../../../../common/types/chain.js";
import type { AccountId } from "../../../../common/types/lending.js";

export type AccountInfo = {
  registered: Map<FolksChainId, GenericAddress>;
  invited: Map<FolksChainId, GenericAddress>;
};

export type AccountIdByAddress = Array<{
  accountId: AccountId;
  folksChainId: FolksChainId;
}>;
