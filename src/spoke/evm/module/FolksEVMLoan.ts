import { EstimateGasParameters, Hex, PublicClient, WalletClient, concat } from "viem";
import { FINALITY, UINT16_LENGTH, UINT256_LENGTH, UINT8_LENGTH } from "../../../constants/common";
import {
  Action,
  FolksChainId,
  FolksTokenId,
  MessageAdapters,
  MessageParams,
  MessageToSend,
  NetworkType,
  SpokeChain,
  TokenType,
} from "../../../type/common";
import {
  PrepareCreateLoanCall,
  PrepareDeleteLoanCall,
  PrepareDepositCall,
  PrepareWithdrawCall,
} from "../../../type/evm";
import { MessageUtil, SpokeChainUtil, BytesUtil, AddressUtil } from "../../../util/common";
import { EVMContractUtil, getSignerAddress } from "../../../util/evm";
import { HubChainUtil } from "../../../util/hub";

export class FolksEVMLoan {
  static prepare = {
    async createLoan(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      loanId: Hex,
      loanTypeId: number,
      adapters: MessageAdapters
    ): Promise<PrepareCreateLoanCall> {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMLoan.prepareRaw.createLoan(provider, network, accountId, loanId, loanTypeId, adapters, spokeChain);
    },

    async deleteLoan(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      loanId: Hex,
      adapters: MessageAdapters
    ) {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMLoan.prepareRaw.deleteLoan(provider, network, accountId, loanId, adapters, spokeChain);
    },

    async deposit(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      loanId: Hex,
      folksTokenId: FolksTokenId,
      amount: bigint,
      adapters: MessageAdapters
    ) {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMLoan.prepareRaw.deposit(
        provider,
        network,
        accountId,
        loanId,
        folksTokenId,
        amount,
        adapters,
        spokeChain
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
      returnAdapterFees: bigint
    ) {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMLoan.prepareRaw.withdraw(
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
        spokeChain
      );
    },
  };

  static prepareRaw = {
    async createLoan(
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      loanId: Hex,
      loanTypeId: number,
      adapters: MessageAdapters,
      spokeChain: SpokeChain,
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareCreateLoanCall> {
      const spokeCommonAddress = spokeChain.spokeCommonAddress;

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeChain.spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.CreateLoan,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          concat([loanId, BytesUtil.convertNumberToBytes(loanTypeId, UINT16_LENGTH)])
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.createLoan([params, accountId, loanId, loanTypeId], {
        value: adapterFee,
        ...transactionOptions,
      });
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
      spokeChain: SpokeChain
    ): Promise<PrepareDeleteLoanCall> {
      const spokeCommonAddress = spokeChain.spokeCommonAddress;

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeChain.spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.DeleteLoan,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          loanId
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.deleteLoan([params, accountId, loanId], {
        value: adapterFee,
      });
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
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareDepositCall> {
      const spokeTokenData = SpokeChainUtil.getSpokeTokenData(spokeChain, folksTokenId);
      const hubTokenData = HubChainUtil.getHubTokenData(folksTokenId, network);

      const spokeToken = EVMContractUtil.getSpokeTokenContract(provider, spokeTokenData.spokeAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeToken.address,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.Deposit,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          concat([
            loanId,
            BytesUtil.convertNumberToBytes(hubTokenData.poolId, UINT8_LENGTH),
            BytesUtil.convertNumberToBytes(amount, UINT256_LENGTH),
          ])
        ),
        finalityLevel: FINALITY.FINALISED,
        extraArgs: MessageUtil.getSendTokenExtraArgsWhenAdding(spokeTokenData, hubTokenData, amount),
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeToken.estimateGas.deposit([params, accountId, loanId, amount], {
        value: adapterFee,
        ...transactionOptions,
      });
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
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareWithdrawCall> {
      const spokeTokenData = SpokeChainUtil.getSpokeTokenData(spokeChain, folksTokenId);
      const hubTokenData = HubChainUtil.getHubTokenData(folksTokenId, network);

      const spokeCommonAddress = spokeChain.spokeCommonAddress;
      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const spokeBridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message incl return adapter fee needed
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      params.receiverValue = returnAdapterFee;
      const message: MessageToSend = {
        params,
        sender: spokeTokenData.tokenAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.Withdraw,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          concat([
            loanId,
            BytesUtil.convertNumberToBytes(hubTokenData.poolId, UINT8_LENGTH),
            BytesUtil.convertNumberToBytes(receiverFolksChainId, UINT16_LENGTH),
            BytesUtil.convertNumberToBytes(amount, UINT256_LENGTH),
            BytesUtil.convertBooleanToByte(isFAmount),
          ])
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fee
      const adapterFee = await spokeBridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.withdraw(
        [params, accountId, loanId, hubTokenData.poolId, receiverFolksChainId, amount, isFAmount],
        {
          value: adapterFee,
          ...transactionOptions,
        }
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

  static write = {
    async createLoan(
      provider: PublicClient,
      signer: WalletClient,
      accountId: Hex,
      loanId: Hex,
      loanTypeId: number,
      prepareCall: PrepareCreateLoanCall
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

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress, signer);

      const params: MessageParams = {
        ...adapters,
        receiverValue: returnAdapterFee,
        gasLimit: receiveGasLimit,
        returnGasLimit: returnReceiveGasLimit,
      };

      return await spokeCommon.write.createLoan([params, accountId, loanId, loanTypeId], {
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      });
    },

    async deleteLoan(
      provider: PublicClient,
      signer: WalletClient,
      accountId: Hex,
      loanId: Hex,
      prepareCall: PrepareDeleteLoanCall
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

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress, signer);

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
      includeApprove: boolean = true,
      prepareCall: PrepareDepositCall
    ) {
      const { adapters, adapterFee, returnAdapterFee, gasLimit, receiveGasLimit, returnReceiveGasLimit, token } =
        prepareCall;

      const sender = getSignerAddress(signer);

      const spokeToken = EVMContractUtil.getSpokeTokenContract(provider, token.spokeAddress, signer);

      if (includeApprove && token.tokenType !== TokenType.NATIVE)
        await EVMContractUtil.sendERC20Approve(provider, token.spokeAddress, signer, spokeToken.address, amount);

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
      prepareCall: PrepareWithdrawCall
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

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress, signer);
      const params: MessageParams = {
        ...adapters,
        receiverValue: returnAdapterFee,
        gasLimit: receiveGasLimit,
        returnGasLimit: returnReceiveGasLimit,
      };

      return await spokeCommon.write.withdraw([params, accountId, loanId, poolId, receiverChainId, amount, isFAmount], {
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      });
    },
  };
}
