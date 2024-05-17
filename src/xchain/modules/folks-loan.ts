import type { Hex } from "viem";
import * as FolksHubLoan from "../../chains/evm/hub/modules/folks-hub-loan.js";
import * as FolksEVMLoan from "../../chains/evm/spoke/modules/folks-evm-loan.js";
import { ChainType } from "../../common/types/index.js";
import type {
  FolksChainId,
  MessageAdapters,
  PrepareCreateLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
  FolksTokenId,
  LoanType,
} from "../../common/types/index.js";
import { FolksCore } from "../core/folks-core.js";
import {
  assertAdapterSupportsDataMessage,
  assertAdapterSupportsTokenMessage,
} from "../../common/utils/adapter.js";
import {
  assertSpokeChainSupportFolksToken,
  assertSpokeChainSupported,
} from "../../common/utils/chain.js";
import {
  assertLoanTypeSupported,
  getHubTokenData,
} from "../../chains/evm/hub/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";

export const prepare = {
  async createLoan(
    accountId: Hex,
    loanId: Hex,
    loanTypeId: LoanType,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMLoan.prepare.createLoan(
          folksChain.folksChainId,
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          folksChain.network,
          accountId,
          loanId,
          loanTypeId,
          adapters,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deleteLoan(accountId: Hex, loanId: Hex, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMLoan.prepare.deleteLoan(
          folksChain.folksChainId,
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          folksChain.network,
          accountId,
          loanId,
          adapters,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deposit(
    accountId: Hex,
    loanId: Hex,
    loanType: LoanType,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    assertSpokeChainSupportFolksToken(
      folksChain.folksChainId,
      folksTokenId,
      folksChain.network,
    );
    assertLoanTypeSupported(loanType, folksTokenId, folksChain.network);

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
          adapters,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async withdraw(
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    isFAmount: boolean,
    receiverFolksChainId: FolksChainId,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    assertAdapterSupportsTokenMessage(
      receiverFolksChainId,
      adapters.returnAdapterId,
    );
    assertSpokeChainSupportFolksToken(
      folksChain.folksChainId,
      folksTokenId,
      folksChain.network,
    );
    assertSpokeChainSupportFolksToken(
      receiverFolksChainId,
      folksTokenId,
      folksChain.network,
    );

    const getReturnAdapterFees = FolksHubLoan.getSendTokenAdapterFees(
      FolksCore.getHubProvider(),
      folksChain.network,
      accountId,
      folksTokenId,
      amount,
      receiverFolksChainId,
      adapters,
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
          await getReturnAdapterFees(),
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },
};

export const write = {
  async createLoan(
    accountId: Hex,
    loanId: Hex,
    loanTypeId: LoanType,
    prepareCall: PrepareCreateLoanCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMLoan.write.createLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          loanTypeId,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deleteLoan(
    accountId: Hex,
    loanId: Hex,
    prepareCall: PrepareCreateLoanCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMLoan.write.deleteLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deposit(
    accountId: Hex,
    loanId: Hex,
    amount: bigint,
    includeApproval: boolean,
    prepareCall: PrepareDepositCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEVMLoan.write.deposit(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          amount,
          includeApproval,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async withdraw(
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    isFAmount: boolean,
    receiverFolksChainId: FolksChainId,
    prepareCall: PrepareWithdrawCall,
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
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },
};

export const read = {};
