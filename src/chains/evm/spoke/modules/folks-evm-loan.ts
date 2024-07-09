import { multicall, waitForTransactionReceipt } from "viem/actions";

import { ChainType } from "../../../../common/types/chain.js";
import { TokenType } from "../../../../common/types/token.js";
import { convertFromGenericAddress } from "../../../../common/utils/address.js";
import { calcNextPeriodReset, calcPeriodNumber } from "../../../../common/utils/formulae.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import { sendERC20Approve } from "../../common/utils/contract.js";
import { getAllowanceStateOverride } from "../../common/utils/tokens.js";
import { getHubTokenData } from "../../hub/utils/chain.js";
import { getBridgeRouterSpokeContract, getSpokeCommonContract, getSpokeTokenContract } from "../utils/contract.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { FolksChainId, NetworkType, SpokeChain } from "../../../../common/types/chain.js";
import type { AccountId, LoanId, LoanName } from "../../../../common/types/lending.js";
import type { MessageToSend } from "../../../../common/types/message.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { FolksTokenId, SpokeTokenData } from "../../../../common/types/token.js";
import type {
  PrepareBorrowCall,
  PrepareCreateLoanAndDepositCall,
  PrepareCreateLoanCall,
  PrepareDeleteLoanCall,
  PrepareDepositCall,
  PrepareRepayCall,
  PrepareRepayWithCollateralCall,
  PrepareSwitchBorrowTypeCall,
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
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareCreateLoanCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.createLoan(
      [messageToSend.params, accountId, loanId, loanTypeId, loanName],
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
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.deleteLoan([messageToSend.params, accountId, loanId], {
      value: msgValue,
      ...transactionOptions,
    });

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeCommonAddress,
    };
  },

  async createLoanAndDeposit(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    amount: bigint,
    spokeChain: SpokeChain,
    spokeTokenData: SpokeTokenData,
    transactionOptions: EstimateGasParameters = { account: sender },
  ) {
    const spokeToken = getSpokeTokenContract(provider, spokeTokenData.spokeAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const spender = convertFromGenericAddress(spokeTokenData.spokeAddress, ChainType.EVM);

    // get state override
    let stateOverride;
    if (spokeTokenData.token.type === TokenType.ERC20 || spokeTokenData.token.type === TokenType.CIRCLE) {
      const erc20Address = convertFromGenericAddress(spokeTokenData.token.address, ChainType.EVM);
      stateOverride = getAllowanceStateOverride([
        {
          erc20Address,
          stateDiff: [
            {
              owner: sender,
              spender,
              folksChainId: spokeChain.folksChainId,
              folksTokenId: spokeTokenData.folksTokenId,
              tokenType: spokeTokenData.token.type,
              amount,
            },
          ],
        },
      ]);
    }

    // get adapter fees
    const adapterFees = await bridgeRouter.read.getSendFee([messageToSend]);
    const value = spokeTokenData.token.type === TokenType.NATIVE ? amount : BigInt(0);
    const msgValue = adapterFees + value;

    // get gas limits
    const gasLimit = await spokeToken.estimateGas.createLoanAndDeposit(
      [messageToSend.params, accountId, loanId, amount, loanTypeId, loanName],
      {
        value: msgValue,
        ...transactionOptions,
        stateOverride,
      },
    );

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeTokenData: spokeTokenData,
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
    const spokeToken = getSpokeTokenContract(provider, spokeTokenData.spokeAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const spender = convertFromGenericAddress(spokeTokenData.spokeAddress, ChainType.EVM);

    // get state override
    let stateOverride;
    if (spokeTokenData.token.type === TokenType.ERC20 || spokeTokenData.token.type === TokenType.CIRCLE) {
      const erc20Address = convertFromGenericAddress(spokeTokenData.token.address, ChainType.EVM);
      stateOverride = getAllowanceStateOverride([
        {
          erc20Address,
          stateDiff: [
            {
              owner: sender,
              spender,
              folksChainId: spokeChain.folksChainId,
              folksTokenId: spokeTokenData.folksTokenId,
              tokenType: spokeTokenData.token.type,
              amount,
            },
          ],
        },
      ]);
    }

    // get adapter fees
    const adapterFees = await bridgeRouter.read.getSendFee([messageToSend]);
    const value = spokeTokenData.token.type === TokenType.NATIVE ? amount : BigInt(0);
    const msgValue = adapterFees + value;

    // get gas limits
    const gasLimit = await spokeToken.estimateGas.deposit([messageToSend.params, accountId, loanId, amount], {
      value: msgValue,
      ...transactionOptions,
      stateOverride,
    });

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeTokenData: spokeTokenData,
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
    const spokeBridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    // get adapter fee
    const msgValue = await spokeBridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.withdraw(
      [messageToSend.params, accountId, loanId, hubTokenData.poolId, receiverFolksChainId, amount, isFAmount],
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

  async borrow(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    network: NetworkType,
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    maxStableRate: bigint,
    receiverFolksChainId: FolksChainId,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareBorrowCall> {
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeCommonAddress = spokeChain.spokeCommonAddress;
    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const spokeBridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    // get adapter fee
    const msgValue = await spokeBridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.borrow(
      [messageToSend.params, accountId, loanId, hubTokenData.poolId, receiverFolksChainId, amount, maxStableRate],
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

  async repay(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    loanId: LoanId,
    amount: bigint,
    maxOverRepayment: bigint,
    spokeChain: SpokeChain,
    spokeTokenData: SpokeTokenData,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareRepayCall> {
    const spokeToken = getSpokeTokenContract(provider, spokeTokenData.spokeAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    const spender = convertFromGenericAddress(spokeTokenData.spokeAddress, ChainType.EVM);

    // get state override
    let stateOverride;
    if (spokeTokenData.token.type === TokenType.ERC20 || spokeTokenData.token.type === TokenType.CIRCLE) {
      const erc20Address = convertFromGenericAddress(spokeTokenData.token.address, ChainType.EVM);
      stateOverride = getAllowanceStateOverride([
        {
          erc20Address,
          stateDiff: [
            {
              owner: sender,
              spender,
              folksChainId: spokeChain.folksChainId,
              folksTokenId: spokeTokenData.folksTokenId,
              tokenType: spokeTokenData.token.type,
              amount,
            },
          ],
        },
      ]);
    }

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeToken.estimateGas.repay(
      [messageToSend.params, accountId, loanId, amount, maxOverRepayment],
      {
        value: msgValue,
        ...transactionOptions,
        stateOverride,
      },
    );

    return {
      msgValue,
      gasLimit,
      messageParams: messageToSend.params,
      spokeTokenData: spokeTokenData,
    };
  },

  async repayWithCollateral(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    network: NetworkType,
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    amount: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareRepayWithCollateralCall> {
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.repayWithCollateral(
      [messageToSend.params, accountId, loanId, hubTokenData.poolId, amount],
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

  async switchBorrowType(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    network: NetworkType,
    accountId: AccountId,
    loanId: LoanId,
    folksTokenId: FolksTokenId,
    maxStableRate: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareSwitchBorrowTypeCall> {
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.switchBorrowType(
      [messageToSend.params, accountId, loanId, hubTokenData.poolId, maxStableRate],
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
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    prepareCall: PrepareCreateLoanCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } = prepareCall;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress, signer);

    return await spokeCommon.write.createLoan([messageParams, accountId, loanId, loanTypeId, loanName], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },

  async deleteLoan(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    prepareCall: PrepareDeleteLoanCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } = prepareCall;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress, signer);

    return await spokeCommon.write.deleteLoan([messageParams, accountId, loanId], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },

  async createLoanAndDeposit(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    loanTypeId: LoanTypeId,
    loanName: LoanName,
    amount: bigint,
    includeApprove = true,
    prepareCall: PrepareCreateLoanAndDepositCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeTokenData } = prepareCall;
    const { token } = spokeTokenData;

    const spokeToken = getSpokeTokenContract(provider, spokeTokenData.spokeAddress, signer);

    if (includeApprove && (token.type === TokenType.CIRCLE || token.type === TokenType.ERC20)) {
      const approveTxId = await sendERC20Approve(
        provider,
        token.address,
        signer,
        convertFromGenericAddress(spokeTokenData.spokeAddress, ChainType.EVM),
        amount,
      );
      if (approveTxId !== null) await waitForTransactionReceipt(provider, { hash: approveTxId });
    }

    return await spokeToken.write.createLoanAndDeposit(
      [messageParams, accountId, loanId, amount, loanTypeId, loanName],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
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
    const { msgValue, gasLimit, messageParams, spokeTokenData } = prepareCall;
    const { token } = spokeTokenData;

    const spokeToken = getSpokeTokenContract(provider, spokeTokenData.spokeAddress, signer);

    if (includeApprove && (token.type === TokenType.CIRCLE || token.type === TokenType.ERC20)) {
      const approveTxId = await sendERC20Approve(
        provider,
        token.address,
        signer,
        convertFromGenericAddress(spokeTokenData.spokeAddress, ChainType.EVM),
        amount,
      );
      if (approveTxId !== null) await waitForTransactionReceipt(provider, { hash: approveTxId });
    }

    return await spokeToken.write.deposit([messageParams, accountId, loanId, amount], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
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
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } = prepareCall;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress, signer);

    return await spokeCommon.write.withdraw(
      [messageParams, accountId, loanId, poolId, receiverChainId, amount, isFAmount],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
        value: msgValue,
      },
    );
  },

  async borrow(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    poolId: number,
    amount: bigint,
    maxStableRate: bigint,
    receiverChainId: FolksChainId,
    prepareCall: PrepareBorrowCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } = prepareCall;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress, signer);

    return await spokeCommon.write.borrow(
      [messageParams, accountId, loanId, poolId, receiverChainId, amount, maxStableRate],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
        value: msgValue,
      },
    );
  },

  async repay(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    amount: bigint,
    maxOverRepayment: bigint,
    includeApprove = true,
    prepareCall: PrepareRepayCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeTokenData } = prepareCall;
    const { token } = spokeTokenData;

    const spokeToken = getSpokeTokenContract(provider, spokeTokenData.spokeAddress, signer);

    if (includeApprove && (token.type === TokenType.CIRCLE || token.type === TokenType.ERC20)) {
      const approveTxId = await sendERC20Approve(
        provider,
        token.address,
        signer,
        convertFromGenericAddress(spokeTokenData.spokeAddress, ChainType.EVM),
        amount,
      );
      if (approveTxId !== null) await waitForTransactionReceipt(provider, { hash: approveTxId });
    }

    return await spokeToken.write.repay([messageParams, accountId, loanId, amount, maxOverRepayment], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },

  async repayWithCollateral(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    poolId: number,
    amount: bigint,
    prepareCall: PrepareRepayWithCollateralCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } = prepareCall;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress, signer);

    return await spokeCommon.write.repayWithCollateral([messageParams, accountId, loanId, poolId, amount], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },

  async switchBorrowType(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    loanId: LoanId,
    poolId: number,
    maxStableRate: bigint,
    prepareCall: PrepareSwitchBorrowTypeCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } = prepareCall;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress, signer);

    return await spokeCommon.write.switchBorrowType([messageParams, accountId, loanId, poolId, maxStableRate], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      value: msgValue,
    });
  },
};

export const read = {
  async rateLimitInfo(provider: Client, token: SpokeTokenData): Promise<TokenRateLimit> {
    const spokeToken = getSpokeTokenContract(provider, token.spokeAddress);

    // get rate limit data
    const [bucketConfig, oldPeriodNumber, oldCurrentCapacity] = await multicall(provider, {
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
    });

    // TODO consider min limit
    const [periodLength, periodOffset, periodLimit] = bucketConfig;
    const newPeriodNumber = calcPeriodNumber(BigInt(periodOffset), BigInt(periodLength));
    const isNewPeriod = newPeriodNumber !== BigInt(oldPeriodNumber);
    const currentCapacity = isNewPeriod ? periodLimit : oldCurrentCapacity;
    const nextPeriodReset = calcNextPeriodReset(newPeriodNumber, BigInt(periodOffset), BigInt(periodLength));

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
