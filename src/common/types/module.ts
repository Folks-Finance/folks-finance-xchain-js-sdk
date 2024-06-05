import type {
  PrepareCreateAccountCall as PrepareCreateAccountEVMCall,
  PrepareInviteAddressCall as PrepareInviteAddressEVMCall,
  PrepareAcceptInviteAddressCall as PrepareAcceptInviteAddressEVMCall,
  PrepareUnregisterAddressCall as PrepareUnregisterAddressEVMCall,
  PrepareCreateLoanCall as PrepareCreateLoanEVMCall,
  PrepareDeleteLoanCall as PrepareDeleteLoanEVMCall,
  PrepareDepositCall as PrepareDepositEVMCall,
  PrepareWithdrawCall as PrepareWithdrawEVMCall,
  PrepareCall as PrepareEVMCall,
  PrepareRepayWithCollateralCall as PrepareRepayWithCollateralEVMCall,
} from "../../chains/evm/common/types/module.js";

export enum LoanType {
  DEPOSIT = 1, // no support for borrows
  GENERAL = 2,
}

export type PrepareCall = PrepareEVMCall;

export type PrepareCreateAccountCall = PrepareCreateAccountEVMCall;
export type PrepareInviteAddressCall = PrepareInviteAddressEVMCall;
export type PrepareAcceptInviteAddressCall = PrepareAcceptInviteAddressEVMCall;
export type PrepareUnregisterAddressCall = PrepareUnregisterAddressEVMCall;

export type PrepareCreateLoanCall = PrepareCreateLoanEVMCall;
export type PrepareDeleteLoanCall = PrepareDeleteLoanEVMCall;
export type PrepareDepositCall = PrepareDepositEVMCall;
export type PrepareWithdrawCall = PrepareWithdrawEVMCall;
export type PrepareRepayWithCollateralCall = PrepareRepayWithCollateralEVMCall;
