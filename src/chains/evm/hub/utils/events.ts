import type { FolksChainId } from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { AcceptInviteAddressEventParams, InviteAddressEventParams } from "../types/account.js";
import type { CreateUserLoanEventParams, DeleteUserLoanEventParams } from "../types/loan.js";

export async function fetchCreateUserLoanEvents(params: CreateUserLoanEventParams) {
  const { loanManager, accountId, loanTypeIds, eventParams } = params;
  const logs = await loanManager.getEvents.CreateUserLoan({ accountId }, eventParams);
  return logs
    .filter((log) => loanTypeIds === undefined || (log.args.loanTypeId && loanTypeIds.includes(log.args.loanTypeId)))
    .map((log) => ({
      blockNumber: log.blockNumber,
      loanId: log.args.loanId as LoanId,
      accountId,
      loanTypeId: log.args.loanTypeId as LoanTypeId,
    }));
}

export async function fetchDeleteUserLoanEvents(params: DeleteUserLoanEventParams) {
  const { loanManager, accountId, eventParams } = params;
  const logs = await loanManager.getEvents.DeleteUserLoan({ accountId }, eventParams);
  return logs.map((log) => ({
    blockNumber: log.blockNumber,
    loanId: log.args.loanId,
    accountId,
  }));
}

export async function fetchUserLoanIds(params: CreateUserLoanEventParams): Promise<Map<LoanTypeId, Array<LoanId>>> {
  const createdUserLoans = await fetchCreateUserLoanEvents(params);
  const deletedUserLoans = await fetchDeleteUserLoanEvents(params);

  // add created and remove deleted through counting
  const loanIdsMap = new Map<LoanId, { loanTypeId: LoanTypeId; count: number }>();
  for (const userLoan of createdUserLoans) {
    const loanId = userLoan.loanId;
    const loanIdCount = loanIdsMap.get(loanId);
    if (!loanIdCount) loanIdsMap.set(loanId, { loanTypeId: userLoan.loanTypeId, count: 1 });
    else loanIdCount.count++;
  }
  for (const userLoan of deletedUserLoans) {
    const loanId = userLoan.loanId as LoanId;
    const loanIdCount = loanIdsMap.get(loanId);
    if (loanIdCount)
      if (loanIdCount.count === 1) loanIdsMap.delete(loanId);
      else loanIdCount.count--;
  }

  const loanTypeMap = new Map<LoanTypeId, Array<LoanId>>();

  for (const [loanId, { loanTypeId }] of loanIdsMap.entries()) {
    const loanTypeIds = loanTypeMap.get(loanTypeId);
    if (!loanTypeIds) loanTypeMap.set(loanTypeId, [loanId]);
    else loanTypeIds.push(loanId);
  }

  return loanTypeMap;
}

async function fetchReceivedInvitationEventByAddress(params: InviteAddressEventParams) {
  const { eventParams, accountManager, address, folksChainId } = params;

  const logs = await accountManager.getEvents.InviteAddress(
    { inviteeAddr: address, inviteeChainId: folksChainId },
    eventParams,
  );
  return logs.map((log) => ({
    blockNumber: log.blockNumber,
    accountId: log.args.accountId,
    folksChainId: log.args.inviteeChainId,
    id: `${log.args.accountId ?? ""}${log.args.inviteeChainId ?? ""}`,
  }));
}

async function fetchAcceptedInvitationEventByAddress(params: AcceptInviteAddressEventParams) {
  const { eventParams, accountManager, address, folksChainId } = params;

  const logs = await accountManager.getEvents.AcceptInviteAddress(eventParams);
  return logs
    .filter((log) => log.args.addr === address && (folksChainId ? log.args.chainId === folksChainId : true))
    .map((log) => ({
      blockNumber: log.blockNumber,
      accountId: log.args.accountId,
      folksChainId: log.args.chainId,
      id: `${log.args.accountId ?? ""}${log.args.chainId ?? ""}`,
    }));
}

export async function fetchInvitationByAddress(params: InviteAddressEventParams) {
  const receivedInvitations = await fetchReceivedInvitationEventByAddress(params);
  const acceptedInvitations = await fetchAcceptedInvitationEventByAddress(params);

  const allEvents = [...receivedInvitations, ...acceptedInvitations];
  allEvents.sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  const accountStatus = new Map();

  for (const event of allEvents)
    if (receivedInvitations.includes(event)) accountStatus.set(event.id, true);
    else if (acceptedInvitations.includes(event)) accountStatus.set(event.id, false);

  return {
    address: params.address,
    invitations: allEvents
      .filter((log) => accountStatus.get(log.id))
      .map((log) => ({
        accountId: log.accountId as AccountId,
        folksChainId: log.folksChainId as FolksChainId,
      })),
  };
}
