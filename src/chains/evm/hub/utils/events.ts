import type { FolksChainId } from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type { AcceptInviteAddressEventParams, InviteAddressEventParams } from "../types/account.js";
import type { CreateUserLoanEventParams, DeleteUserLoanEventParams } from "../types/loan.js";

export async function fetchCreateUserLoanEvents(params: CreateUserLoanEventParams) {
  const { loanManager, accountId, loanTypeId, eventParams } = params;
  const logs = await loanManager.getEvents.CreateUserLoan({ accountId }, eventParams);
  return logs
    .filter((log) => loanTypeId === undefined || loanTypeId === log.args.loanTypeId)
    .map((log) => ({
      blockNumber: log.blockNumber,
      loanId: log.args.loanId,
      accountId,
      loanTypeId: log.args.loanTypeId,
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

export async function fetchUserLoanIds(params: CreateUserLoanEventParams) {
  const createdUserLoans = await fetchCreateUserLoanEvents(params);
  const deletedUserLoans = await fetchDeleteUserLoanEvents(params);

  // add created and remove deleted through counting
  const loanIds = new Map<LoanId, number>();
  for (const userLoan of createdUserLoans) {
    const loanId = userLoan.loanId as LoanId;
    const num = loanIds.get(loanId) ?? 0;
    loanIds.set(loanId, num + 1);
  }
  for (const userLoan of deletedUserLoans) {
    const loanId = userLoan.loanId as LoanId;
    const num = loanIds.get(loanId) ?? 1;
    num === 1 ? loanIds.delete(loanId) : loanIds.set(loanId, num - 1);
  }

  return Array.from(loanIds.keys());
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
