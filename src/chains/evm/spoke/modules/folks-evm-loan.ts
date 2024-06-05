import { multicall } from "viem/actions";

import { TokenType } from "../../../../common/types/token.js";
import {
  calcNextPeriodReset,
  calcPeriodNumber,
} from "../../../../common/utils/formulae.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { sendERC20Approve } from "../../common/utils/contract.js";
import { getHubTokenData } from "../../hub/utils/chain.js";
import {
  getBridgeRouterSpokeContract,
  getSpokeCommonContract,
  getSpokeTokenContract,
} from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type {
  FolksChainId,
  NetworkType,
  SpokeChain,
} from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type { MessageToSend } from "../../../../common/types/message.js";
import type { LoanType } from "../../../../common/types/module.js";
import type {
  FolksTokenId,
  SpokeTokenData,
} from "../../../../common/types/token.js";
import type {
  PrepareCreateLoanCall,
  PrepareDeleteLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../common/types/module.js";
import type { TokenRateLimit } from "../types/pool.js";
import type { Client, EstimateGasParameters, WalletClient } from "viem";

export const prepare = {
  async createLoan(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    loanTypeId: LoanType,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareCreateLoanCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.createLoan(
      [messageToSend.params, accountId, loanId, loanTypeId],
      {
        value: msgValue,
        ...transactionOptions,
      },
    );

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeCommonAddress,
    };
  },

  async deleteLoan(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareDeleteLoanCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.deleteLoan(
      [messageToSend.params, accountId, loanId],
      {
        value: msgValue,
        ...transactionOptions,
      },
    );

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeCommonAddress,
    };
  },

  async deposit(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    amount: bigint,
    spokeChain: SpokeChain,
    spokeTokenData: SpokeTokenData,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareDepositCall> {
    const spokeToken = getSpokeTokenContract(
      provider,
      spokeTokenData.spokeAddress,
    );
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeToken.estimateGas.deposit(
      [messageToSend.params, accountId, loanId, amount],
      {
        value: msgValue,
        ...transactionOptions,
      },
    );

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      token: spokeTokenData,
    };
  },

  async withdraw(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    network: NetworkType,
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    isFAmount: boolean,
    receiverFolksChainId: FolksChainId,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareWithdrawCall> {
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeCommonAddress = spokeChain.spokeCommonAddress;
    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const spokeBridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fee
    const msgValue = await spokeBridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.withdraw(
      [
        messageToSend.params,
        accountId,
        loanId,
        hubTokenData.poolId,
        receiverFolksChainId,
        amount,
        isFAmount,
      ],
      {
        value: msgValue,
        ...transactionOptions,
      },
    );

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeCommonAddress,
    };
  },
};

export const write = {
  async createLoan(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    loanTypeId: LoanType,
    prepareCall: PrepareCreateLoanCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.createLoan(
      [messageParams, accountId, loanId, loanTypeId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },

  async deleteLoan(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    prepareCall: PrepareDeleteLoanCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.deleteLoan(
      [messageParams, accountId, loanId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },

  async deposit(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    amount: bigint,
    includeApprove = true,
    prepareCall: PrepareDepositCall,
  ) {
    const { msgValue, gasLimit, messageParams, token } = prepareCall;

    const spokeToken = getSpokeTokenContract(
      provider,
      token.spokeAddress,
      signer,
    );

    if (includeApprove && token.tokenType !== TokenType.NATIVE)
      await sendERC20Approve(
        provider,
        token.spokeAddress,
        signer,
        spokeToken.address as EvmAddress,
        amount,
      );

    return await spokeToken.write.deposit(
      [messageParams, accountId, loanId, amount],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },

  async withdraw(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    poolId: number,
    amount: bigint,
    isFAmount: boolean,
    receiverChainId: FolksChainId,
    prepareCall: PrepareWithdrawCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.withdraw(
      [
        messageParams,
        accountId,
        loanId,
        poolId,
        receiverChainId,
        amount,
        isFAmount,
      ],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },
};

export const read = {
  async rateLimitInfo(
    provider: Client,
    token: SpokeTokenData,
  ): Promise<TokenRateLimit> {
    const spokeToken = getSpokeTokenContract(provider, token.spokeAddress);

    // get rate limit data
    const [bucketConfig, oldPeriodNumber, oldCurrentCapacity] = await multicall(
      provider,
      {
        contracts: [
          {
            address: spokeToken.address,
            abi: spokeToken.abi,
            functionName: "bucketConfig",
          },
          {
            address: spokeToken.address,
            abi: spokeToken.abi,
            functionName: "currentPeriodNumber",
          },
          {
            address: spokeToken.address,
            abi: spokeToken.abi,
            functionName: "currentCapacity",
          },
        ],
        allowFailure: false,
      },
    );

    // TODO consider min limit
    const [periodLength, periodOffset, periodLimit] = bucketConfig;
    const newPeriodNumber = calcPeriodNumber(
      BigInt(periodOffset),
      BigInt(periodLength),
    );
    const isNewPeriod = newPeriodNumber !== BigInt(oldPeriodNumber);
    const currentCapacity = isNewPeriod ? periodLimit : oldCurrentCapacity;
    const nextPeriodReset = calcNextPeriodReset(
      newPeriodNumber,
      BigInt(periodOffset),
      BigInt(periodLength),
    );

    // build rate limit info
    return {
      periodLength: BigInt(periodLength),
      periodOffset: BigInt(periodOffset),
      periodLimit: BigInt(periodLimit),
      currentCapacity,
      nextPeriodReset,
    };
  },
};
