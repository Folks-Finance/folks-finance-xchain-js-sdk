import { concat } from "viem";

import {
  FINALITY,
  UINT16_LENGTH,
  UINT256_LENGTH,
  UINT8_LENGTH,
} from "../../../../common/constants/index.js";
import { Action, TokenType } from "../../../../common/types/index.js";
import { getRandomGenericAddress } from "../../../../common/utils/address.js";
import {
  convertNumberToBytes,
  convertBooleanToByte,
} from "../../../../common/utils/bytes.js";
import {
  getSpokeChain,
  getSpokeTokenData,
} from "../../../../common/utils/chain.js";
import {
  DEFAULT_MESSAGE_PARAMS,
  buildMessagePayload,
  getSendTokenExtraArgsWhenAdding,
} from "../../../../common/utils/messages.js";
import {
  getSignerAddress,
  sendERC20Approve,
} from "../../common/utils/index.js";
import { getHubChain, getHubTokenData } from "../../hub/utils/chain.js";
import {
  getBridgeRouterSpokeContract,
  getSpokeCommonContract,
  getSpokeTokenContract,
} from "../utils/contract.js";

import type {
  FolksChainId,
  MessageAdapters,
  MessageParams,
  MessageToSend,
  SpokeChain,
  FolksTokenId,
  NetworkType,
} from "../../../../common/types/index.js";
import type {
  PrepareCreateLoanCall,
  PrepareDeleteLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../common/types/index.js";
import type {
  EstimateGasParameters,
  Hex,
  PublicClient,
  WalletClient,
} from "viem";

export const prepare = {
  async createLoan(
    folksChainId: FolksChainId,
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    loanTypeId: number,
    adapters: MessageAdapters,
  ): Promise<PrepareCreateLoanCall> {
    // get intended spoke
    const spokeChain = getSpokeChain(folksChainId, network);

    // use raw function
    return prepareRaw.createLoan(
      provider,
      network,
      accountId,
      loanId,
      loanTypeId,
      adapters,
      spokeChain,
    );
  },

  async deleteLoan(
    folksChainId: FolksChainId,
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    adapters: MessageAdapters,
  ) {
    // get intended spoke
    const spokeChain = getSpokeChain(folksChainId, network);

    // use raw function
    return prepareRaw.deleteLoan(
      provider,
      network,
      accountId,
      loanId,
      adapters,
      spokeChain,
    );
  },

  async deposit(
    folksChainId: FolksChainId,
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
  ) {
    // get intended spoke
    const spokeChain = getSpokeChain(folksChainId, network);

    // use raw function
    return prepareRaw.deposit(
      provider,
      network,
      accountId,
      loanId,
      folksTokenId,
      amount,
      adapters,
      spokeChain,
    );
  },

  async withdraw(
    folksChainId: FolksChainId,
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    isFAmount: boolean,
    receiverFolksChainId: FolksChainId,
    adapters: MessageAdapters,
    returnAdapterFees: bigint,
  ) {
    // get intended spoke
    const spokeChain = getSpokeChain(folksChainId, network);

    // use raw function
    return prepareRaw.withdraw(
      provider,
      network,
      accountId,
      loanId,
      folksTokenId,
      amount,
      isFAmount,
      receiverFolksChainId,
      adapters,
      returnAdapterFees,
      spokeChain,
    );
  },
};

export const prepareRaw = {
  async createLoan(
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    loanTypeId: number,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {},
  ): Promise<PrepareCreateLoanCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    const hubChain = getHubChain(network);

    // construct message
    const params = DEFAULT_MESSAGE_PARAMS(adapters);
    const message: MessageToSend = {
      params,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      payload: buildMessagePayload(
        Action.CreateLoan,
        accountId,
        getRandomGenericAddress(),
        concat([loanId, convertNumberToBytes(loanTypeId, UINT16_LENGTH)]),
      ),
      finalityLevel: FINALITY.IMMEDIATE,
      extraArgs: "0x",
    };

    // get adapter fees
    const returnAdapterFee = BigInt(0);
    const adapterFee = await bridgeRouter.read.getSendFee([message]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.createLoan(
      [params, accountId, loanId, loanTypeId],
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
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
  ): Promise<PrepareDeleteLoanCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    const hubChain = getHubChain(network);

    // construct message
    const params = DEFAULT_MESSAGE_PARAMS(adapters);
    const message: MessageToSend = {
      params,
      sender: spokeChain.spokeCommonAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      payload: buildMessagePayload(
        Action.DeleteLoan,
        accountId,
        getRandomGenericAddress(),
        loanId,
      ),
      finalityLevel: FINALITY.IMMEDIATE,
      extraArgs: "0x",
    };

    // get adapter fees
    const returnAdapterFee = BigInt(0);
    const adapterFee = await bridgeRouter.read.getSendFee([message]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.deleteLoan(
      [params, accountId, loanId],
      {
        value: adapterFee,
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
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {},
  ): Promise<PrepareDepositCall> {
    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeToken = getSpokeTokenContract(
      provider,
      spokeTokenData.spokeAddress,
    );
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    const hubChain = getHubChain(network);

    // construct message
    const params = DEFAULT_MESSAGE_PARAMS(adapters);
    const message: MessageToSend = {
      params,
      sender: spokeToken.address,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      payload: buildMessagePayload(
        Action.Deposit,
        accountId,
        getRandomGenericAddress(),
        concat([
          loanId,
          convertNumberToBytes(hubTokenData.poolId, UINT8_LENGTH),
          convertNumberToBytes(amount, UINT256_LENGTH),
        ]),
      ),
      finalityLevel: FINALITY.FINALISED,
      extraArgs: getSendTokenExtraArgsWhenAdding(
        spokeTokenData,
        hubTokenData,
        amount,
      ),
    };

    // get adapter fees
    const returnAdapterFee = BigInt(0);
    const adapterFee = await bridgeRouter.read.getSendFee([message]);

    // get gas limits
    const gasLimit = await spokeToken.estimateGas.deposit(
      [params, accountId, loanId, amount],
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
    provider: PublicClient,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    isFAmount: boolean,
    receiverFolksChainId: FolksChainId,
    adapters: MessageAdapters,
    returnAdapterFee: bigint,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = {},
  ): Promise<PrepareWithdrawCall> {
    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);
    const hubTokenData = getHubTokenData(folksTokenId, network);

    const spokeCommonAddress = spokeChain.spokeCommonAddress;
    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const spokeBridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    const hubChain = getHubChain(network);

    // construct message incl return adapter fee needed
    const params = DEFAULT_MESSAGE_PARAMS(adapters);
    params.receiverValue = returnAdapterFee;
    const message: MessageToSend = {
      params,
      sender: spokeTokenData.tokenAddress,
      destinationChainId: hubChain.folksChainId,
      handler: hubChain.hubAddress,
      payload: buildMessagePayload(
        Action.Withdraw,
        accountId,
        getRandomGenericAddress(),
        concat([
          loanId,
          convertNumberToBytes(hubTokenData.poolId, UINT8_LENGTH),
          convertNumberToBytes(receiverFolksChainId, UINT16_LENGTH),
          convertNumberToBytes(amount, UINT256_LENGTH),
          convertBooleanToByte(isFAmount),
        ]),
      ),
      finalityLevel: FINALITY.IMMEDIATE,
      extraArgs: "0x",
    };

    // get adapter fee
    const adapterFee = await spokeBridgeRouter.read.getSendFee([message]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.withdraw(
      [
        params,
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
      returnAdapterFee,
      gasLimit,
      receiveGasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress,
    };
  },
};

export const write = {
  async createLoan(
    provider: PublicClient,
    signer: WalletClient,
    accountId: Hex,
    loanId: Hex,
    loanTypeId: number,
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
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      },
    );
  },

  async deleteLoan(
    provider: PublicClient,
    signer: WalletClient,
    accountId: Hex,
    loanId: Hex,
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
      account: getSignerAddress(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
  },

  async deposit(
    provider: PublicClient,
    signer: WalletClient,
    accountId: Hex,
    loanId: Hex,
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

    const sender = getSignerAddress(signer);

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
        spokeToken.address,
        amount,
      );

    const params: MessageParams = {
      ...adapters,
      receiverValue: returnAdapterFee,
      gasLimit: receiveGasLimit,
      returnGasLimit: returnReceiveGasLimit,
    };

    return await spokeToken.write.deposit([params, accountId, loanId, amount], {
      account: sender,
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
  },

  async withdraw(
    provider: PublicClient,
    signer: WalletClient,
    accountId: Hex,
    loanId: Hex,
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
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      },
    );
  },
};
