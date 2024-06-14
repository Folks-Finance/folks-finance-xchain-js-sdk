import type { GenericAddress } from "../../../../common/types/address.js";
import type { FolksChainId } from "../../../../common/types/chain.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type { GetEventParams, GetReadContractReturnType } from "../../common/types/contract.js";
import type { AccountManagerAbi } from "../constants/abi/account-manager-abi.js";

export type AccountInfo = {
  registered: Map<FolksChainId, GenericAddress>;
  invited: Map<FolksChainId, GenericAddress>;
};

export type AccountIdByAddress = Array<{
  accountId: AccountId;
  folksChainId: FolksChainId;
}>;

export type InviteAddressEventParams = GetEventParams & {
  accountManager: GetReadContractReturnType<typeof AccountManagerAbi>;
  address: GenericAddress;
  folksChainId?: FolksChainId;
};

export type AcceptInviteAddressEventParams = GetEventParams & {
  accountManager: GetReadContractReturnType<typeof AccountManagerAbi>;
  address: GenericAddress;
  folksChainId?: FolksChainId;
};
