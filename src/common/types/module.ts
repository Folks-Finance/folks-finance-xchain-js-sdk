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
  PrepareBorrowCall as PrepareBorrowEVMCall,
  PrepareRepayCall as PrepareRepayEVMCall,
  PrepareRepayWithCollateralCall as PrepareRepayWithCollateralEVMCall,
  PrepareSwitchBorrowTypeCall as PrepareSwitchBorrowTypeEVMCall,
  PrepareLiquidateCall as PrepareLiquidateEVMCall,
  PrepareRetryMessageCall as PrepareRetryMessageEVMCall,
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
export type PrepareBorrowCall = PrepareBorrowEVMCall;
export type PrepareRepayCall = PrepareRepayEVMCall;
export type PrepareRepayWithCollateralCall = PrepareRepayWithCollateralEVMCall;
export type PrepareSwitchBorrowTypeCall = PrepareSwitchBorrowTypeEVMCall;
export type PrepareLiquidateCall = PrepareLiquidateEVMCall;
export type PrepareRetryMessageCall = PrepareRetryMessageEVMCall;
