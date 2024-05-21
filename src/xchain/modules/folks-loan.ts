import { FolksHubLoan } from "../../chains/evm/hub/modules/index.js";
import {
  assertLoanTypeSupported,
  getHubTokenData,
} from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmLoan } from "../../chains/evm/spoke/modules/index.js";
import { ChainType } from "../../common/types/chain.js";
import {
  assertAdapterSupportsDataMessage,
  assertAdapterSupportsTokenMessage,
} from "../../common/utils/adapter.js";
import {
  assertSpokeChainSupportFolksToken,
  assertSpokeChainSupported,
} from "../../common/utils/chain.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type { FolksChainId } from "../../common/types/chain.js";
import type { MessageAdapters } from "../../common/types/message.js";
import type {
  LoanType,
  PrepareCreateLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../common/types/module.js";
import type { FolksTokenId } from "../../common/types/token.js";
import type { Hex } from "viem";

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
        return await FolksEvmLoan.prepare.createLoan(
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
        return await FolksEvmLoan.prepare.deleteLoan(
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
        return await FolksEvmLoan.prepare.deposit(
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
        return await FolksEvmLoan.prepare.withdraw(
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
        return await FolksEvmLoan.write.createLoan(
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
        return await FolksEvmLoan.write.deleteLoan(
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
        return await FolksEvmLoan.write.deposit(
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
        return await FolksEvmLoan.write.withdraw(
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
