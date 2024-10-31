import { SEND_TOKEN_ACTION_RETURN_GAS_LIMIT } from "../../chains/evm/common/constants/contract.js";
import { FolksHubLoan } from "../../chains/evm/hub/modules/index.js";
import {
  assertLoanTypeSupported,
  getHubChain,
  getHubTokenData,
  getHubTokensData,
} from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmLoan } from "../../chains/evm/spoke/modules/index.js";
import { ChainType } from "../../common/types/chain.js";
import { MessageDirection } from "../../common/types/gmp.js";
import { Action } from "../../common/types/message.js";
import { TokenType } from "../../common/types/token.js";
import { assertAdapterSupportsDataMessage, assertAdapterSupportsTokenMessage } from "../../common/utils/adapter.js";
import { convertFromGenericAddress } from "../../common/utils/address.js";
import {
  assertHubChainSelected,
  assertSpokeChainSupportFolksToken,
  assertSpokeChainSupported,
  getFolksChain,
  getSignerGenericAddress,
  getSpokeChain,
  getSpokeTokenData,
} from "../../common/utils/chain.js";
import { buildMessageToSend, estimateAdapterReceiveGasLimit } from "../../common/utils/messages.js";
import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import { FolksCore } from "../core/folks-core.js";

import type { LoanChange, LoanManagerUserLoan, LoanTypeInfo, UserLoanInfo } from "../../chains/evm/hub/types/loan.js";
import type { OraclePrice, OraclePrices } from "../../chains/evm/hub/types/oracle.js";
import type { PoolInfo } from "../../chains/evm/hub/types/pool.js";
import type { TokenRateLimit } from "../../chains/evm/spoke/types/pool.js";
import type { FolksChainId } from "../../common/types/chain.js";
import type { AccountId, LoanId, LoanName, Nonce } from "../../common/types/lending.js";
import type {
  BorrowMessageData,
  CreateLoanAndDepositMessageData,
  CreateLoanMessageData,
  DeleteLoanMessageData,
  DepositExtraArgs,
  DepositMessageData,
  LiquidateMessageData,
  MessageAdapters,
  MessageBuilderParams,
  OptionalFeeParams,
  OverrideTokenData,
  RepayExtraArgs,
  RepayMessageData,
  RepayWithCollateralMessageData,
  SendTokenExtraArgs,
  SendTokenMessageData,
  SwitchBorrowTypeMessageData,
  WithdrawMessageData,
} from "../../common/types/message.js";
import type {
  LoanTypeId,
  PrepareBorrowCall,
  PrepareCreateLoanAndDepositCall,
  PrepareCreateLoanCall,
  PrepareDepositCall,
  PrepareLiquidateCall,
  PrepareRepayCall,
  PrepareRepayWithCollateralCall,
  PrepareSwitchBorrowTypeCall,
  PrepareUpdateUserLoanPoolPoints,
  PrepareWithdrawCall,
} from "../../common/types/module.js";
import type { FolksTokenId } from "../../common/types/token.js";
import type { Dnum } from "dnum";

export const prepare = {
  async createLoan(
    accountId: AccountId,
    nonce: Nonce,
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
    const spokeChain = getSpokeChain(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: CreateLoanMessageData = {
      nonce,
      loanTypeId,
      loanName,
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

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.createLoan(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          nonce,
          loanTypeId,
          loanName,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deleteLoan(accountId: AccountId, loanId: LoanId, adapters: MessageAdapters) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
    const spokeChain = getSpokeChain(folksChain.folksChainId, folksChain.network);
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

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

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

  async createLoanAndDeposit(
    accountId: AccountId,
    nonce: Nonce,
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
    assertLoanTypeSupported(loanTypeId, folksTokenId, folksChain.network);
    const spokeChain = getSpokeChain(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
    const hubTokenData = getHubTokenData(folksTokenId, folksChain.network);

    if (spokeTokenData.token.type === TokenType.CIRCLE)
      assertAdapterSupportsTokenMessage(folksChain.folksChainId, adapters.adapterId);
    else assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: CreateLoanAndDepositMessageData = {
      nonce,
      poolId: hubTokenData.poolId,
      amount,
      loanTypeId,
      loanName,
    };
    const extraArgs: DepositExtraArgs = {
      token: spokeTokenData.token,
      recipient: hubTokenData.poolAddress,
      amount,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.CreateLoanAndDeposit,
      sender: getSpokeTokenData(spokeChain, folksTokenId).spokeAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs,
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );
    feeParams.returnGasLimit = SEND_TOKEN_ACTION_RETURN_GAS_LIMIT;

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.createLoanAndDeposit(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          nonce,
          loanTypeId,
          loanName,
          amount,
          spokeChain,
          spokeTokenData,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deposit(
    accountId: AccountId,
    loanId: LoanId,
    loanTypeId: LoanTypeId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
    assertLoanTypeSupported(loanTypeId, folksTokenId, folksChain.network);
    const spokeChain = getSpokeChain(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
    const hubTokenData = getHubTokenData(folksTokenId, folksChain.network);

    if (spokeTokenData.token.type === TokenType.CIRCLE)
      assertAdapterSupportsTokenMessage(folksChain.folksChainId, adapters.adapterId);
    else assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

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
      token: spokeTokenData.token,
      recipient: hubTokenData.poolAddress,
      amount,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.Deposit,
      sender: getSpokeTokenData(spokeChain, folksTokenId).spokeAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs,
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );
    feeParams.returnGasLimit = SEND_TOKEN_ACTION_RETURN_GAS_LIMIT;

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

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

    const spokeChain = getSpokeChain(folksChain.folksChainId, network);
    const receiverSpokeChain = getSpokeChain(receiverFolksChainId, network);
    const receiverSpokeTokenData = getSpokeTokenData(receiverSpokeChain, folksTokenId);

    assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
    if (receiverSpokeTokenData.token.type === TokenType.CIRCLE)
      assertAdapterSupportsTokenMessage(receiverFolksChainId, adapters.returnAdapterId);
    else assertAdapterSupportsDataMessage(receiverFolksChainId, adapters.returnAdapterId);

    assertSpokeChainSupportFolksToken(receiverFolksChainId, folksTokenId, network);

    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const feeParams: OptionalFeeParams = {};

    const returnData: SendTokenMessageData = {
      amount,
    };
    const returnExtraArgs: SendTokenExtraArgs = {
      folksTokenId,
      token: hubTokenData.token,
      recipient: receiverSpokeTokenData.spokeAddress,
      amount,
    };
    const overrideData: OverrideTokenData = {
      folksTokenId,
      token: receiverSpokeTokenData.token,
      address: receiverSpokeTokenData.spokeAddress,
      amount,
    };
    const returnMessageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.SendToken,
      sender: hubChain.hubAddress,
      destinationChainId: receiverFolksChainId,
      handler: receiverSpokeTokenData.spokeAddress,
      data: returnData,
      extraArgs: returnExtraArgs,
      overrideData,
    };
    feeParams.returnGasLimit = await estimateAdapterReceiveGasLimit(
      hubChain.folksChainId,
      receiverFolksChain.folksChainId,
      FolksCore.getEVMProvider(receiverFolksChain.folksChainId),
      folksChain.network,
      MessageDirection.HubToSpoke,
      returnMessageBuilderParams,
    );

    const data: WithdrawMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      receiverFolksChainId,
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
    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
      feeParams.receiverValue,
    );

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

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

  async borrow(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    maxStableRate: bigint,
    receiverFolksChainId: FolksChainId,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const network = folksChain.network;
    const receiverFolksChain = getFolksChain(receiverFolksChainId, network);

    const spokeChain = getSpokeChain(folksChain.folksChainId, network);
    const receiverSpokeChain = getSpokeChain(receiverFolksChainId, network);
    const receiverSpokeTokenData = getSpokeTokenData(receiverSpokeChain, folksTokenId);

    assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);
    if (receiverSpokeTokenData.token.type === TokenType.CIRCLE)
      assertAdapterSupportsTokenMessage(receiverFolksChainId, adapters.returnAdapterId);
    else assertAdapterSupportsDataMessage(receiverFolksChainId, adapters.returnAdapterId);
    assertSpokeChainSupportFolksToken(receiverFolksChainId, folksTokenId, network);

    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const feeParams: OptionalFeeParams = {};

    const returnData: SendTokenMessageData = {
      amount,
    };
    const returnExtraArgs: SendTokenExtraArgs = {
      folksTokenId,
      token: hubTokenData.token,
      recipient: receiverSpokeTokenData.spokeAddress,
      amount,
    };
    const overrideData: OverrideTokenData = {
      folksTokenId,
      token: receiverSpokeTokenData.token,
      address: receiverSpokeTokenData.spokeAddress,
      amount,
    };
    const returnMessageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.SendToken,
      sender: hubChain.hubAddress,
      destinationChainId: receiverFolksChainId,
      handler: receiverSpokeTokenData.spokeAddress,
      data: returnData,
      extraArgs: returnExtraArgs,
      overrideData,
    };
    feeParams.returnGasLimit = await estimateAdapterReceiveGasLimit(
      hubChain.folksChainId,
      receiverFolksChain.folksChainId,
      FolksCore.getEVMProvider(receiverFolksChain.folksChainId),
      folksChain.network,
      MessageDirection.HubToSpoke,
      returnMessageBuilderParams,
    );

    const data: BorrowMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      receiverFolksChainId,
      amount,
      maxStableRate,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.Borrow,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
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
    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
      feeParams.receiverValue,
    );

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.borrow(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          network,
          accountId,
          loanId,
          folksTokenId,
          amount,
          maxStableRate,
          receiverFolksChainId,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async repay(
    accountId: AccountId,
    loanId: LoanId,
    loanTypeId: LoanTypeId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    maxOverRepayment: bigint,
    adapters: MessageAdapters,
  ): Promise<PrepareRepayCall> {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
    assertLoanTypeSupported(loanTypeId, folksTokenId, folksChain.network);
    const spokeChain = getSpokeChain(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
    const hubTokenData = getHubTokenData(folksTokenId, folksChain.network);

    if (spokeTokenData.token.type === TokenType.CIRCLE)
      assertAdapterSupportsTokenMessage(folksChain.folksChainId, adapters.adapterId);
    else assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: RepayMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      amount,
      maxOverRepayment,
    };
    const extraArgs: RepayExtraArgs = {
      token: spokeTokenData.token,
      recipient: hubTokenData.poolAddress,
      amount,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.Repay,
      sender: getSpokeTokenData(spokeChain, folksTokenId).spokeAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs,
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );
    feeParams.returnGasLimit = SEND_TOKEN_ACTION_RETURN_GAS_LIMIT;

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.repay(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          accountId,
          loanId,
          amount,
          maxOverRepayment,
          spokeChain,
          spokeTokenData,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async repayWithCollateral(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const network = folksChain.network;

    assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeChain = getSpokeChain(folksChain.folksChainId, network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: RepayWithCollateralMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      amount,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.RepayWithCollateral,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.repayWithCollateral(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          network,
          accountId,
          loanId,
          folksTokenId,
          amount,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async switchBorrowType(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    maxStableRate: bigint,
    adapters: MessageAdapters,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const network = folksChain.network;

    assertAdapterSupportsDataMessage(folksChain.folksChainId, adapters.adapterId);

    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeChain = getSpokeChain(folksChain.folksChainId, network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: SwitchBorrowTypeMessageData = {
      loanId,
      poolId: hubTokenData.poolId,
      maxStableRate,
    };
    const messageBuilderParams: MessageBuilderParams = {
      userAddress,
      accountId,
      adapters,
      action: Action.SwitchBorrowType,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      data,
      extraArgs: "0x",
    };
    const feeParams: OptionalFeeParams = {};

    feeParams.gasLimit = await estimateAdapterReceiveGasLimit(
      folksChain.folksChainId,
      hubChain.folksChainId,
      FolksCore.getHubProvider(),
      folksChain.network,
      MessageDirection.SpokeToHub,
      messageBuilderParams,
    );

    const messageToSend = buildMessageToSend(folksChain.chainType, messageBuilderParams, feeParams);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.prepare.switchBorrowType(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          convertFromGenericAddress(userAddress, folksChain.chainType),
          messageToSend,
          network,
          accountId,
          loanId,
          folksTokenId,
          maxStableRate,
          spokeChain,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async liquidate(
    accountId: AccountId,
    liquidatorLoanId: LoanId,
    violatorLoanId: LoanId,
    folksTokenIdToLiq: FolksTokenId,
    folksTokenIdToSeize: FolksTokenId,
    repayingAmount: bigint,
    minSeizedAmount: bigint,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const hubTokenToLiquidateData = getHubTokenData(folksTokenIdToLiq, folksChain.network);
    const hubTokenToSeizeData = getHubTokenData(folksTokenIdToSeize, folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    const data: LiquidateMessageData = {
      liquidatorLoanId,
      violatorLoanId,
      colPoolId: hubTokenToSeizeData.poolId,
      borPoolId: hubTokenToLiquidateData.poolId,
      repayingAmount,
      minSeizedAmount,
    };

    return await FolksHubLoan.prepare.liquidate(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      convertFromGenericAddress(userAddress, folksChain.chainType),
      data,
      accountId,
      hubChain,
    );
  },

  async updateUserLoanPoolPoints(loanIds: Array<LoanId>): Promise<PrepareUpdateUserLoanPoolPoints> {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);
    const hubChain = getHubChain(folksChain.network);

    const userAddress = getSignerGenericAddress({
      signer: FolksCore.getFolksSigner().signer,
      chainType: folksChain.chainType,
    });

    return await FolksHubLoan.prepare.updateUserLoanPoolPoints(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      convertFromGenericAddress(userAddress, folksChain.chainType),
      loanIds,
      hubChain,
    );
  },
};

export const write = {
  async createLoan(
    accountId: AccountId,
    nonce: Nonce,
    loanTypeId: LoanTypeId,
    loanName: LoanName,
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
          nonce,
          loanTypeId,
          loanName,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async deleteLoan(accountId: AccountId, loanId: LoanId, prepareCall: PrepareCreateLoanCall) {
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

  async createLoanAndDeposit(
    accountId: AccountId,
    nonce: Nonce,
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    amount: bigint,
    includeApproval: boolean,
    prepareCall: PrepareCreateLoanAndDepositCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.write.createLoanAndDeposit(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          nonce,
          loanTypeId,
          loanName,
          amount,
          includeApproval,
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

  async borrow(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    maxStableRate: bigint,
    receiverFolksChainId: FolksChainId,
    prepareCall: PrepareBorrowCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    const { poolId } = getHubTokenData(folksTokenId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.write.borrow(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          poolId,
          amount,
          maxStableRate,
          receiverFolksChainId,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async repay(
    accountId: AccountId,
    loanId: LoanId,
    amount: bigint,
    maxOverRepayment: bigint,
    includeApproval: boolean,
    prepareCall: PrepareRepayCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertSpokeChainSupported(folksChain.folksChainId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.write.repay(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          amount,
          maxOverRepayment,
          includeApproval,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async repayWithCollateral(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    prepareCall: PrepareRepayWithCollateralCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    const { poolId } = getHubTokenData(folksTokenId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.write.repayWithCollateral(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          poolId,
          amount,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async switchBorrowType(
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    maxStableRate: bigint,
    prepareCall: PrepareSwitchBorrowTypeCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    const { poolId } = getHubTokenData(folksTokenId, folksChain.network);

    switch (folksChain.chainType) {
      case ChainType.EVM:
        return await FolksEvmLoan.write.switchBorrowType(
          FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
          FolksCore.getSigner<ChainType.EVM>(),
          accountId,
          loanId,
          poolId,
          maxStableRate,
          prepareCall,
        );
      default:
        return exhaustiveCheck(folksChain.chainType);
    }
  },

  async liquidate(accountId: AccountId, prepareCall: PrepareLiquidateCall) {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubLoan.write.liquidate(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      FolksCore.getSigner<ChainType.EVM>(),
      accountId,
      prepareCall,
    );
  },

  async updateUserLoanPoolPoints(loanIds: Array<LoanId>, prepareCall: PrepareUpdateUserLoanPoolPoints) {
    const folksChain = FolksCore.getSelectedFolksChain();
    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubLoan.write.updateUserLoanPoolPoints(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      FolksCore.getSigner<ChainType.EVM>(),
      loanIds,
      prepareCall,
    );
  },
};

export const read = {
  async rateLimit(folksTokenId: FolksTokenId, folksChainId: FolksChainId): Promise<TokenRateLimit> {
    const network = FolksCore.getSelectedNetwork();
    const folksChain = getFolksChain(folksChainId, network);

    assertSpokeChainSupportFolksToken(folksChain.folksChainId, folksTokenId, folksChain.network);
    const spokeChain = getSpokeChain(folksChain.folksChainId, folksChain.network);
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

  async loanTypeInfo(loanTypeId: LoanTypeId): Promise<LoanTypeInfo> {
    const network = FolksCore.getSelectedNetwork();

    // filter for all tokens supported in loan type
    const tokensData = Object.values(getHubTokensData(network)).filter((tokenData) =>
      tokenData.supportedLoanTypes.has(loanTypeId),
    );

    return await FolksHubLoan.getLoanTypeInfo(FolksCore.getHubProvider(), network, loanTypeId, tokensData);
  },

  async userLoansIds(
    accountId: AccountId,
    loanTypeIdsFilter?: Array<LoanTypeId>,
  ): Promise<Map<LoanTypeId, Array<LoanId>>> {
    const network = FolksCore.getSelectedNetwork();
    // get active user loans ids
    return await FolksHubLoan.getUserLoanIds(FolksCore.getHubProvider(), network, accountId, loanTypeIdsFilter);
  },

  async userLoans(loanIds: Array<LoanId>): Promise<Map<LoanId, LoanManagerUserLoan>> {
    const network = FolksCore.getSelectedNetwork();
    // get user loans
    return await FolksHubLoan.getUserLoans(FolksCore.getHubProvider(), network, loanIds);
  },
};

export const util = {
  userLoansInfo(
    userLoansMap: Map<LoanId, LoanManagerUserLoan>,
    poolsInfo: Partial<Record<FolksTokenId, PoolInfo>>,
    loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
    oraclePrices: OraclePrices,
  ): Record<LoanId, UserLoanInfo> {
    // get info of each user loan
    return FolksHubLoan.getUserLoansInfo(userLoansMap, poolsInfo, loanTypesInfo, oraclePrices);
  },

  emptyLoanForSimulate(accountId: AccountId, loanTypeId: LoanTypeId): LoanManagerUserLoan {
    return { accountId, loanTypeId, colPools: [], borPools: [], userLoanCollateral: [], userLoanBorrow: [] };
  },

  simulateLoanChanges(loan: LoanManagerUserLoan, changes: Array<LoanChange>): LoanManagerUserLoan {
    return FolksHubLoan.simulateLoanChanges(loan, changes);
  },

  maxReduceBorrowForBorrowUtilisationRatio(
    loan: UserLoanInfo,
    reduceFolksTokenId: FolksTokenId,
    depositInterestIndex: Dnum,
    targetBorrowUtilisationRatio: Dnum,
  ) {
    return FolksHubLoan.maxReduceBorrowForBorrowUtilisationRatio(
      loan,
      reduceFolksTokenId,
      depositInterestIndex,
      targetBorrowUtilisationRatio,
    );
  },

  maxBorrowForBorrowUtilisationRatio(
    loan: UserLoanInfo,
    borrowFactor: Dnum,
    oraclePrice: OraclePrice,
    targetBorrowUtilisationRatio: Dnum,
  ) {
    return FolksHubLoan.maxBorrowForBorrowUtilisationRatio(
      loan,
      borrowFactor,
      oraclePrice,
      targetBorrowUtilisationRatio,
    );
  },
};
