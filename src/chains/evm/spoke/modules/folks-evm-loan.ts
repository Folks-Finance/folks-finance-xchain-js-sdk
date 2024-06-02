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
import type {
  MessageAdapters,
  MessageParams,
  MessageToSend,
} from "../../../../common/types/message.js";
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
    adapters: MessageAdapters,
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
    const returnAdapterFee = BigInt(0);
    const adapterFee = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.createLoan(
      [messageToSend.params, accountId, loanId, loanTypeId],
      {
        value: adapterFee,
        ...transactionOptions,
      },
    );
    const returnReceiveGasLimit = BigInt(0);
    const receiveGasLimit = BigInt(300000); // TODO

    return {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress,
    };
  },

  async deleteLoan(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ) {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const returnAdapterFee = BigInt(0);
    const adapterFee = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.deleteLoan(
      [messageToSend.params, accountId, loanId],
      {
        value: adapterFee,
        ...transactionOptions,
      },
    );
    const returnReceiveGasLimit = BigInt(0);
    const receiveGasLimit = BigInt(300000); // TODO

    return {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress: spokeChain.spokeCommonAddress,
    };
  },

  async deposit(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    amount: bigint,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    spokeTokenData: SpokeTokenData,
    transactionOptions: EstimateGasParameters = { account: sender },
  ) {
    const spokeToken = getSpokeTokenContract(
      provider,
      spokeTokenData.spokeAddress,
    );
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const returnAdapterFee = BigInt(0);
    const adapterFee = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeToken.estimateGas.deposit(
      [messageToSend.params, accountId, loanId, amount],
      {
        value: adapterFee,
        ...transactionOptions,
      },
    );
    const returnReceiveGasLimit = BigInt(0);
    const receiveGasLimit = BigInt(500000); // TODO

    return {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
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
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ) {
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeCommonAddress = spokeChain.spokeCommonAddress;
    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const spokeBridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fee
    const adapterFee = await spokeBridgeRouter.read.getSendFee([messageToSend]);

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
        value: adapterFee,
        ...transactionOptions,
      },
    );
    const returnReceiveGasLimit = BigInt(300000); // TODO
    const receiveGasLimit = BigInt(500000); // TODO

    return {
      adapters,
      adapterFee,
      returnAdapterFee: messageToSend.params.receiverValue,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
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
    const {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress,
    } = prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    const params: MessageParams = {
      ...adapters,
      receiverValue: returnAdapterFee,
      gasLimit: receiveGasLimit,
      returnGasLimit: returnReceiveGasLimit,
    };

    return await spokeCommon.write.createLoan(
      [params, accountId, loanId, loanTypeId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
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
    const {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress,
    } = prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    const params: MessageParams = {
      ...adapters,
      receiverValue: returnAdapterFee,
      gasLimit: receiveGasLimit,
      returnGasLimit: returnReceiveGasLimit,
    };

    return await spokeCommon.write.deleteLoan([params, accountId, loanId], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
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
    const {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      token,
    } = prepareCall;

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

    const params: MessageParams = {
      ...adapters,
      receiverValue: returnAdapterFee,
      gasLimit: receiveGasLimit,
      returnGasLimit: returnReceiveGasLimit,
    };

    return await spokeToken.write.deposit([params, accountId, loanId, amount], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
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
    const {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress,
    } = prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );
    const params: MessageParams = {
      ...adapters,
      receiverValue: returnAdapterFee,
      gasLimit: receiveGasLimit,
      returnGasLimit: returnReceiveGasLimit,
    };

    return await spokeCommon.write.withdraw(
      [params, accountId, loanId, poolId, receiverChainId, amount, isFAmount],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
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
