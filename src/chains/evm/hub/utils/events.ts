import type { LoanId } from "../../../../common/types/lending.js";
import type {
  CreateUserLoanEventParams,
  DeleteUserLoanEventParams,
} from "../types/loan.js";

export async function fetchCreateUserLoanEvents(
  params: CreateUserLoanEventParams,
) {
  const { loanManager, accountId, loanTypeId, eventParams } = params;
  const logs = await loanManager.getEvents.CreateUserLoan(
    { accountId },
    eventParams,
  );
  return logs
    .filter(
      (log) => loanTypeId === undefined || loanTypeId === log.args.loanTypeId,
    )
    .map((log) => ({
      blockNumber: log.blockNumber,
      loanId: log.args.loanId,
      accountId,
      loanTypeId: log.args.loanTypeId,
    }));
}

export async function fetchDeleteUserLoanEvents(
  params: DeleteUserLoanEventParams,
) {
  const { loanManager, accountId, eventParams } = params;
  const logs = await loanManager.getEvents.DeleteUserLoan(
    { accountId },
    eventParams,
  );
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
