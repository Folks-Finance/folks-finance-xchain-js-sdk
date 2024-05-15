import type { Hex } from "viem";
import * as FolksHubLoan from "../../hub/module/FolksHubLoan.js";
import * as FolksEVMLoan from "../../spoke/evm/module/FolksEVMLoan.js";
import { ChainType, FolksTokenId, LoanType } from "../../type/common/index.js";
import type {
  FolksChainId,
  MessageAdapters,
  PrepareCreateLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../type/common/index.js";
import { FolksCore } from "../core/FolksCore.js";
import { checkAdapterSupportsDataMessage, checkAdapterSupportsTokenMessage } from "../../util/common/adapter.js";
import { checkSpokeChainSupportFolksToken, checkSpokeChainSupported } from "../../util/common/chain.js";
import { checkLoanTypeSupported, getHubTokenData } from "../../util/hub/chain.js";

export const prepare = {
  async createLoan(accountId: Hex, loanId: Hex, loanTypeId: LoanType, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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

    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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

    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
    checkSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
    checkLoanTypeSupported(loanType, folksTokenId, folksChain.network);

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

    checkAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
    checkAdapterSupportsTokenMessage(receiverFolksChainId, adapters.returnAdapterId);
    checkSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
    checkSpokeChainSupportFolksToken(receiverFolksChainId, folksTokenId, folksChain.network);

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

export const write = {
  async createLoan(accountId: Hex, loanId: Hex, loanTypeId: LoanType, prepareCall: PrepareCreateLoanCall) {
    const folksChain = FolksCore.getSelectedFolksChain();

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

    checkSpokeChainSupported(folksChain.folksChainId, folksChain.network);

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

    const { poolId } = getHubTokenData(folksTokenId, folksChain.network);

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

export const read = {};
