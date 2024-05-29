import { concat } from "viem";

import {
  UINT16_LENGTH,
  UINT8_LENGTH,
  UINT256_LENGTH,
} from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { Action } from "../../../../common/types/message.js";
import { TokenType } from "../../../../common/types/token.js";
import { getRandomGenericAddress } from "../../../../common/utils/address.js";
import {
  convertNumberToBytes,
  convertBooleanToByte,
} from "../../../../common/utils/bytes.js";
import {
  getSpokeChain,
  getSpokeTokenData,
} from "../../../../common/utils/chain.js";
import { getSendTokenExtraArgsWhenAdding } from "../../../../common/utils/messages.js";
import { getSignerAccount } from "../../common/utils/chain.js";
import { sendERC20Approve } from "../../common/utils/contract.js";
import {
  DEFAULT_MESSAGE_PARAMS,
  buildMessagePayload,
} from "../../common/utils/message.js";
import { getHubChain, getHubTokenData } from "../../hub/utils/chain.js";
import {
  getBridgeRouterSpokeContract,
  getSpokeCommonContract,
  getSpokeTokenContract,
} from "../utils/contract.js";

import type {
  FolksChainId,
  NetworkType,
  SpokeChain,
} from "../../../../common/types/chain.js";
import type {
  MessageAdapters,
  MessageToSend,
  MessageParams,
} from "../../../../common/types/message.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type {
  PrepareCreateLoanCall,
  PrepareDeleteLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../common/types/module.js";
import type {
  Address,
  EstimateGasParameters,
  Hex,
  Client,
  WalletClient,
} from "viem";

export const prepare = {
  async createLoan(
    provider: Client,
    sender: Address,
    messageToSend: MessageToSend,
    accountId: Hex,
    loanId: Hex,
    loanTypeId: number,
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
    folksChainId: FolksChainId,
    provider: Client,
    sender: Address,
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
      sender,
      network,
      accountId,
      loanId,
      adapters,
      spokeChain,
    );
  },

  async deposit(
    folksChainId: FolksChainId,
    provider: Client,
    sender: Address,
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
      sender,
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
    provider: Client,
    sender: Address,
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
      sender,
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
  async deleteLoan(
    provider: Client,
    sender: Address,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
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
    sender: Address,
    network: NetworkType,
    accountId: Hex,
    loanId: Hex,
    folksTokenId: FolksTokenId,
    amount: bigint,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
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
    provider: Client,
    sender: Address,
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
    transactionOptions: EstimateGasParameters = { account: sender },
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
      sender: spokeTokenData.spokeAddress,
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
    provider: Client,
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
        account: getSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      },
    );
  },

  async deleteLoan(
    provider: Client,
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
      account: getSignerAccount(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
  },

  async deposit(
    provider: Client,
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
      account: getSignerAccount(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
  },

  async withdraw(
    provider: Client,
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
        account: getSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      },
    );
  },
};
