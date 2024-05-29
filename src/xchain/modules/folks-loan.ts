import { FolksHubLoan } from "../../chains/evm/hub/modules/index.js";
import {
  assertLoanTypeSupported,
  getHubChain,
  getHubTokenData,
} from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmLoan } from "../../chains/evm/spoke/modules/index.js";
import { ChainType } from "../../common/types/chain.js";
import { Action } from "../../common/types/message.js";
import {
  assertAdapterSupportsDataMessage,
  assertAdapterSupportsTokenMessage,
} from "../../common/utils/adapter.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";
import {
  assertSpokeChainSupportFolksToken,
  assertSpokeChainSupported,
  getSignerGenericAddress,
  getSpokeChain,
  getSpokeTokenData,
  getSpokeTokenDataTokenAddress,
} from "../../common/utils/chain.js";
import { buildMessageToSend } from "../../common/utils/messages.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type { FolksChainId } from "../../common/types/chain.js";
import type {
  CreateLoanMessageData,
  DeleteLoanMessageData,
  DepositExtraArgs,
  DepositMessageData,
  MessageAdapters,
  OptionalMessageParams,
  WithdrawMessageData,
} from "../../common/types/message.js";
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
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: CreateLoanMessageData = {
      loanId,
      loanTypeId,
    };
    const messageToSend = buildMessageToSend(folksChain.chainType, {
      userAddress,
      accountId,
      adapters,
      action: Action.CreateLoan,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    });

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.createLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          loanTypeId,
          adapters,
          spokeChain,
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
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: DeleteLoanMessageData = {
      accountId,
      loanId,
    };
    const messageToSend = buildMessageToSend(folksChain.chainType, {
      userAddress,
      accountId,
      adapters,
      action: Action.DeleteLoan,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    });

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.deleteLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          adapters,
          spokeChain,
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
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
    const hubTokenData = getHubTokenData(folksTokenId, folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: DepositMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      amount,
    };
    const extraArgs: DepositExtraArgs = {
      tokenType: spokeTokenData.tokenType,
      spokeTokenAddress: getSpokeTokenDataTokenAddress(spokeTokenData),
      hubPoolAddress: hubTokenData.poolAddress,
      amount,
    };
    const messageToSend = buildMessageToSend(folksChain.chainType, {
      userAddress,
      accountId,
      adapters,
      action: Action.Deposit,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs,
    });

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.deposit(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          amount,
          adapters,
          spokeChain,
          spokeTokenData,
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

    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const hubChain = getHubChain(folksChain.network);

    const hubTokenData = getHubTokenData(folksTokenId, folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const feeParams: OptionalMessageParams = {
      receiverValue: await getReturnAdapterFees(),
    };

    const data: WithdrawMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      receiverFolksChainId: receiverFolksChainId,
      amount,
      isFAmount,
    };
    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      {
        userAddress,
        accountId,
        adapters,
        action: Action.Withdraw,
        sender: spokeChain.spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        data,
        extraArgs: "0x",
      },
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.withdraw(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          folksChain.network,
          accountId,
          loanId,
          folksTokenId,
          amount,
          isFAmount,
          receiverFolksChainId,
          adapters,
          spokeChain,
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
