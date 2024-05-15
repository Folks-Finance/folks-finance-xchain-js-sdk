import { Address, EstimateGasParameters, Hex, PublicClient, WalletClient, concat } from "viem";
import { FINALITY, UINT16_LENGTH } from "../../../constants/common";
import {
  Action,
  ChainType,
  FolksChainId,
  MessageAdapters,
  MessageParams,
  MessageToSend,
  NetworkType,
  SpokeChain,
} from "../../../type/common";
import {
  PrepareAcceptInviteAddressCall,
  PrepareCreateAccountCall,
  PrepareInviteAddressCall,
  PrepareUnregisterAddressCall,
} from "../../../type/evm";
import { MessageUtil, SpokeChainUtil, BytesUtil, AddressUtil } from "../../../util/common";
import { EVMContractUtil, getSignerAddress } from "../../../util/evm";
import { HubChainUtil } from "../../../util/hub";

export class FolksEVMAccount {
  static prepare = {
    async createAccount(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      adapters: MessageAdapters
    ): Promise<PrepareCreateAccountCall> {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMAccount.prepareRaw.createAccount(provider, network, accountId, adapters, spokeChain);
    },

    async inviteAddress(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      folksChainIdToInvite: number,
      addressToInvite: Address,
      adapters: MessageAdapters
    ): Promise<PrepareInviteAddressCall> {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMAccount.prepareRaw.inviteAddress(
        provider,
        network,
        accountId,
        folksChainIdToInvite,
        addressToInvite,
        adapters,
        spokeChain
      );
    },

    async acceptInvite(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      adapters: MessageAdapters
    ) {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMAccount.prepareRaw.acceptInvite(provider, network, accountId, adapters, spokeChain);
    },

    async unregisterAddress(
      folksChainId: FolksChainId,
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      folksChainIdToUnregister: FolksChainId,
      adapters: MessageAdapters
    ) {
      // get intended spoke
      const spokeChain = SpokeChainUtil.getSpokeChain(folksChainId, network);

      // use raw function
      return FolksEVMAccount.prepareRaw.unregisterAddress(
        provider,
        network,
        accountId,
        folksChainIdToUnregister,
        adapters,
        spokeChain
      );
    },
  };
  static prepareRaw = {
    async createAccount(
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      adapters: MessageAdapters,
      spokeChain: SpokeChain,
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareCreateAccountCall> {
      const spokeCommonAddress = spokeChain.spokeCommonAddress;

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.CreateAccount,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          "0x"
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.createAccount([params, accountId], transactionOptions);
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

    async inviteAddress(
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      folksChainIdToInvite: number,
      addressToInvite: Address,
      adapters: MessageAdapters,
      spokeChain: SpokeChain,
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareInviteAddressCall> {
      const spokeCommonAddress = spokeChain.spokeCommonAddress;

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.InviteAddress,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          concat([
            BytesUtil.convertNumberToBytes(folksChainIdToInvite, UINT16_LENGTH),
            AddressUtil.convertToGenericAddress<ChainType.EVM>(addressToInvite, ChainType.EVM),
          ])
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.inviteAddress(
        [params, accountId, folksChainIdToInvite, addressToInvite],
        transactionOptions
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

    async acceptInvite(
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      adapters: MessageAdapters,
      spokeChain: SpokeChain,
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareAcceptInviteAddressCall> {
      const spokeCommonAddress = spokeChain.spokeCommonAddress;

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.AcceptInviteAddress,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          "0x"
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);

      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.acceptInviteAddress([params, accountId], transactionOptions);
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

    async unregisterAddress(
      provider: PublicClient,
      network: NetworkType,
      accountId: Hex,
      folksChainIdToUnregister: FolksChainId,
      adapters: MessageAdapters,
      spokeChain: SpokeChain,
      transactionOptions: EstimateGasParameters = {}
    ): Promise<PrepareUnregisterAddressCall> {
      const spokeCommonAddress = spokeChain.spokeCommonAddress;

      const spokeCommon = EVMContractUtil.getSpokeCommonContract(provider, spokeCommonAddress);
      const bridgeRouter = EVMContractUtil.getBridgeRouterSpokeContract(provider, spokeChain.bridgeRouterAddress);

      const hubChain = HubChainUtil.getHubChain(network);

      // construct message
      const params = MessageUtil.DEFAULT_MESSAGE_PARAMS(adapters);
      const message: MessageToSend = {
        params,
        sender: spokeCommonAddress,
        destinationChainId: hubChain.folksChainId,
        handler: hubChain.hubAddress,
        payload: MessageUtil.buildMessagePayload(
          Action.UnregisterAddress,
          accountId,
          AddressUtil.getRandomGenericAddress(),
          BytesUtil.convertNumberToBytes(folksChainIdToUnregister, UINT16_LENGTH)
        ),
        finalityLevel: FINALITY.IMMEDIATE,
        extraArgs: "0x",
      };

      // get adapter fees
      const returnAdapterFee = BigInt(0);
      const adapterFee = await bridgeRouter.read.getSendFee([message]);
      // get gas limits
      const gasLimit = await spokeCommon.estimateGas.unregisterAddress(
        [params, accountId, folksChainIdToUnregister],
        transactionOptions
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
  };

  static write = {
    async createAccount(
      provider: PublicClient,
      signer: WalletClient,
      accountId: Hex,
      prepareCall: PrepareCreateAccountCall
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

      return await spokeCommon.write.createAccount([params, accountId], {
        account: getSignerAddress(signer),
        chain: signer.chain,
        gas: gasLimit,
        value: adapterFee,
      });
    },

    async inviteAddress(
      provider: PublicClient,
      signer: WalletClient,
      accountId: Hex,
      folksChainIdToInvite: number,
      addressToInvite: Address,
      prepareCall: PrepareInviteAddressCall
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

      return await spokeCommon.write.inviteAddress([params, accountId, folksChainIdToInvite, addressToInvite], {
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      });
    },

    async acceptInvite(
      provider: PublicClient,
      signer: WalletClient,
      accountId: Hex,
      prepareCall: PrepareAcceptInviteAddressCall
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

      return await spokeCommon.write.acceptInviteAddress([params, accountId], {
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      });
    },

    async unregisterAddress(
      provider: PublicClient,
      signer: WalletClient,
      accountId: Hex,
      folksChainIdToUnregister: FolksChainId,
      prepareCall: PrepareUnregisterAddressCall
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

      return await spokeCommon.write.unregisterAddress([params, accountId, folksChainIdToUnregister], {
        account: getSignerAddress(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      });
    },
  };
}
