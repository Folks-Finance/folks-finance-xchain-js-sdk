import { Hex } from "viem";
import { FolksHubLoan } from "../../hub/module/FolksHubLoan";
import { FolksEVMLoan } from "../../spoke/evm/module/FolksEVMLoan";
import {
  ChainType,
  FolksChainId,
  FolksTokenId,
  LoanType,
  MessageAdapters,
  PrepareCreateLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../type/common";
import { AdapterUtil, SpokeChainUtil } from "../../util/common";
import { FolksCore } from "../core/FolksCore";
import { HubChainUtil } from "../../util/hub";

export class FolksLoan {
  static prepare = {
    async createLoan(accountId: Hex, loanId: Hex, loanTypeId: LoanType, adapters: MessageAdapters) {
      const folksChain = FolksCore.getSelectedFolksChain();

      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.prepare.createLoan(
            folksChain.folksChainId,
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            folksChain.network,
            accountId,
            loanId,
            loanTypeId,
            adapters
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },

    async deleteLoan(accountId: Hex, loanId: Hex, adapters: MessageAdapters) {
      const folksChain = FolksCore.getSelectedFolksChain();

      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.prepare.deleteLoan(
            folksChain.folksChainId,
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            folksChain.network,
            accountId,
            loanId,
            adapters
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },

    async deposit(
      accountId: Hex,
      loanId: Hex,
      loanType: LoanType,
      folksTokenId: FolksTokenId,
      amount: bigint,
      adapters: MessageAdapters
    ) {
      const folksChain = FolksCore.getSelectedFolksChain();

      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
      SpokeChainUtil.checkSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
      HubChainUtil.checkLoanTypeSupported(loanType, folksTokenId, folksChain.network);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.prepare.deposit(
            folksChain.folksChainId,
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            folksChain.network,
            accountId,
            loanId,
            folksTokenId,
            amount,
            adapters
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },

    async withdraw(
      accountId: Hex,
      loanId: Hex,
      folksTokenId: FolksTokenId,
      amount: bigint,
      isFAmount: boolean,
      receiverFolksChainId: FolksChainId,
      adapters: MessageAdapters
    ) {
      const folksChain = FolksCore.getSelectedFolksChain();

      AdapterUtil.checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
      AdapterUtil.checkAdapterSupportsTokenMessage(receiverFolksChainId, adapters.returnAdapterId);
      SpokeChainUtil.checkSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
      SpokeChainUtil.checkSpokeChainSupportFolksToken(receiverFolksChainId, folksTokenId, folksChain.network);

      const getReturnAdapterFees = FolksHubLoan.getSendTokenAdapterFees(
        FolksCore.getHubProvider(),
        folksChain.network,
        accountId,
        folksTokenId,
        amount,
        receiverFolksChainId,
        adapters
      );

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.prepare.withdraw(
            folksChain.folksChainId,
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            folksChain.network,
            accountId,
            loanId,
            folksTokenId,
            amount,
            isFAmount,
            receiverFolksChainId,
            adapters,
            await getReturnAdapterFees()
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },
  };

  static write = {
    async createLoan(accountId: Hex, loanId: Hex, loanTypeId: LoanType, prepareCall: PrepareCreateLoanCall) {
      const folksChain = FolksCore.getSelectedFolksChain();

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.write.createLoan(
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            FolksCore.getSigner<ChainType.EVM>(),
            accountId,
            loanId,
            loanTypeId,
            prepareCall
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },

    async deleteLoan(accountId: Hex, loanId: Hex, prepareCall: PrepareCreateLoanCall) {
      const folksChain = FolksCore.getSelectedFolksChain();

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.write.deleteLoan(
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            FolksCore.getSigner<ChainType.EVM>(),
            accountId,
            loanId,
            prepareCall
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },

    async deposit(
      accountId: Hex,
      loanId: Hex,
      amount: bigint,
      includeApproval: boolean,
      prepareCall: PrepareDepositCall
    ) {
      const folksChain = FolksCore.getSelectedFolksChain();

      SpokeChainUtil.checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.write.deposit(
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            FolksCore.getSigner<ChainType.EVM>(),
            accountId,
            loanId,
            amount,
            includeApproval,
            prepareCall
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },

    async withdraw(
      accountId: Hex,
      loanId: Hex,
      folksTokenId: FolksTokenId,
      amount: bigint,
      isFAmount: boolean,
      receiverFolksChainId: FolksChainId,
      prepareCall: PrepareWithdrawCall
    ) {
      const folksChain = FolksCore.getSelectedFolksChain();

      const { poolId } = HubChainUtil.getHubTokenData(folksTokenId, folksChain.network);

      switch (folksChain.chainType) {
        case ChainType.EVM:
          return await FolksEVMLoan.write.withdraw(
            FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
            FolksCore.getSigner<ChainType.EVM>(),
            accountId,
            loanId,
            poolId,
            amount,
            isFAmount,
            receiverFolksChainId,
            prepareCall
          );
        default:
          throw new Error(`Unsupported chain type: ${folksChain.chainType}`);
      }
    },
  };

  static read = {};
}
