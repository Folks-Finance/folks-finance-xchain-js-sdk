import { FolksHubLoan } from "../../chains/evm/hub/modules/index.js";
import {
  assertLoanTypeSupported,
  getHubChain,
  getHubTokenData,
  getHubTokensData,
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
  getFolksChain,
  getSignerGenericAddress,
  getSpokeChain,
  getSpokeTokenData,
  getSpokeTokenDataTokenAddress,
} from "../../common/utils/chain.js";
import {
  buildMessageToSend,
  estimateReceiveGasLimit,
  estimateReturnReceiveGasLimit,
} from "../../common/utils/messages.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type { LoanTypeInfo } from "../../chains/evm/hub/types/loan.js";
import type { OraclePrices } from "../../chains/evm/hub/types/oracle.js";
import type { PoolInfo } from "../../chains/evm/hub/types/pool.js";
import type { TokenRateLimit } from "../../chains/evm/spoke/types/pool.js";
import type { FolksChainId } from "../../common/types/chain.js";
import type { AccountId, LoanId } from "../../common/types/lending.js";
import type {
  CreateLoanMessageData,
  DeleteLoanMessageData,
  DepositExtraArgs,
  DepositMessageData,
  MessageAdapters,
  MessageBuilderParams,
  OptionalFeeParams,
  WithdrawMessageData,
} from "../../common/types/message.js";
import type {
  LoanType,
  PrepareCreateLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../common/types/module.js";
import type { FolksTokenId } from "../../common/types/token.js";

export const prepare = {
  async createLoan(
    accountId: AccountId,
    loanId: LoanId,
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
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.CreateLoan,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.createLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          loanTypeId,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deleteLoan(
    accountId: AccountId,
    loanId: LoanId,
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

    const data: DeleteLoanMessageData = {
      accountId,
      loanId,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.DeleteLoan,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.deleteLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deposit(
    accountId: AccountId,
    loanId: LoanId,
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
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.Deposit,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs,
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.deposit(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          amount,
          spokeChain,
          spokeTokenData,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async withdraw(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    isFAmount: boolean,
    receiverFolksChainId: FolksChainId,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const network = folksChain.network;
    const receiverFolksChain = getFolksChain(receiverFolksChainId, network);

    assertAdapterSupportsDataMessage(
      folksChain.folksChainId,
      adapters.adapterId,
    );
    assertAdapterSupportsTokenMessage(
      receiverFolksChainId,
      adapters.returnAdapterId,
    );
    assertSpokeChainSupportFolksToken(
      receiverFolksChainId,
      folksTokenId,
      network,
    );

    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeChain = getSpokeChain(folksChain.folksChainId, network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: WithdrawMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      receiverFolksChainId: receiverFolksChainId,
      amount,
      isFAmount,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.Withdraw,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.returnGasLimit = await estimateReturnReceiveGasLimit(
      FolksCore.getProvider(receiverFolksChainId),
      receiverFolksChain,
      hubChain,
      adapters,
      messageBuilderParams,
    );
    feeParams.receiverValue = await FolksHubLoan.getSendTokenAdapterFees(
      FolksCore.getHubProvider(),
      network,
      accountId,
      folksTokenId,
      amount,
      receiverFolksChainId,
      adapters,
      feeParams,
    );
    feeParams.gasLimit = await estimateReceiveGasLimit(
      FolksCore.getHubProvider(),
      hubChain,
      folksChain,
      adapters,
      messageBuilderParams,
      feeParams.receiverValue,
      feeParams.returnGasLimit,
    );

    const messageToSend = buildMessageToSend(
      folksChain.chainType,
      messageBuilderParams,
      feeParams,
    );

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.withdraw(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          network,
          accountId,
          loanId,
          folksTokenId,
          amount,
          isFAmount,
          receiverFolksChainId,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },
};

export const write = {
  async createLoan(
    accountId: AccountId,
    loanId: LoanId,
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
    accountId: AccountId,
    loanId: LoanId,
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
    accountId: AccountId,
    loanId: LoanId,
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
    accountId: AccountId,
    loanId: LoanId,
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

export const read = {
  async rateLimit(
    folksTokenId: FolksTokenId,
    folksChainId: FolksChainId,
  ): Promise<TokenRateLimit> {
    const network = FolksCore.getSelectedNetwork();
    const folksChain = getFolksChain(folksChainId, network);

    assertSpokeChainSupportFolksToken(
      folksChain.folksChainId,
      folksTokenId,
      folksChain.network,
    );
    const spokeChain = getSpokeChain(
      folksChain.folksChainId,
      folksChain.network,
    );
    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.read.rateLimitInfo(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          spokeTokenData,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async loanTypeInfo(loanTypeId: LoanType): Promise<LoanTypeInfo> {
    const network = FolksCore.getSelectedNetwork();

    // filter for all tokens supported in loan type
    const tokensData = Object.values(getHubTokensData(network)).filter(
      (tokenData) => tokenData.supportedLoanTypes.has(loanTypeId),
    );

    return await FolksHubLoan.getLoanTypeInfo(
      FolksCore.getHubProvider(),
      network,
      loanTypeId,
      tokensData,
    );
  },

  async userLoansInfo(
    accountId: AccountId,
    poolsInfo: Partial<Record<FolksTokenId, PoolInfo>>,
    loanTypesInfo: Partial<Record<LoanType, LoanTypeInfo>>,
    oraclePrices: OraclePrices,
    loanTypeIdFilter?: LoanType,
  ) {
    const network = FolksCore.getSelectedNetwork();

    // get active user loans
    const loanIds = await FolksHubLoan.getUserLoanIds(
      FolksCore.getHubProvider(),
      network,
      accountId,
      loanTypeIdFilter,
    );

    // get info of each user loan
    return await FolksHubLoan.getUserLoansInfo(
      FolksCore.getHubProvider(),
      network,
      loanIds,
      poolsInfo,
      loanTypesInfo,
      oraclePrices,
    );
  },
};
