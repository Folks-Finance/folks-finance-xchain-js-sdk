import { getEvmSignerAccount } from "../../common/utils/chain.js";
import {
  getBridgeRouterSpokeContract,
  getSpokeCommonContract,
} from "../utils/contract.js";

import type {
  EvmAddress,
  GenericAddress,
} from "../../../../common/types/address.js";
import type {
  FolksChainId,
  SpokeChain,
} from "../../../../common/types/chain.js";
import type { AccountId } from "../../../../common/types/lending.js";
import type {
  MessageAdapters,
  MessageParams,
  MessageToSend,
} from "../../../../common/types/message.js";
import type {
  PrepareAcceptInviteAddressCall,
  PrepareCreateAccountCall,
  PrepareInviteAddressCall,
  PrepareUnregisterAddressCall,
} from "../../common/types/module.js";
import type { Client, EstimateGasParameters, WalletClient } from "viem";

export const prepare = {
  async createAccount(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    refAccountId: AccountId,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareCreateAccountCall> {
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
    const gasLimit = await spokeCommon.estimateGas.createAccount(
      [messageToSend.params, accountId, refAccountId],
      {
        value: adapterFee,
        ...transactionOptions,
      },
    );
    const returnReceiveGasLimit = BigInt(0);

    return {
      adapters,
      adapterFee,
      returnAdapterFee,
      gasLimit,
      receiveGasLimit: messageToSend.params.gasLimit,
      returnReceiveGasLimit,
      spokeCommonAddress,
    };
  },

  async inviteAddress(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    folksChainIdToInvite: number,
    addressToInvite: GenericAddress,
    refAccountId: AccountId,
    adapters: MessageAdapters,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareInviteAddressCall> {
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
    const gasLimit = await spokeCommon.estimateGas.inviteAddress(
      [
        messageToSend.params,
        accountId,
        folksChainIdToInvite,
        addressToInvite,
        refAccountId,
      ],
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

  async acceptInvite(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
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
    const gasLimit = await spokeCommon.estimateGas.acceptInviteAddress(
      [messageToSend.params, accountId],
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

  async unregisterAddress(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    folksChainIdToUnregister: FolksChainId,
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
    const gasLimit = await spokeCommon.estimateGas.unregisterAddress(
      [messageToSend.params, accountId, folksChainIdToUnregister],
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
};

export const write = {
  async createAccount(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    refAccountId: AccountId,
    prepareCall: PrepareCreateAccountCall,
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

    return await spokeCommon.write.createAccount(
      [params, accountId, refAccountId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
        value: adapterFee,
      },
    );
  },

  async inviteAddress(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    folksChainIdToInvite: FolksChainId,
    addressToInvite: GenericAddress,
    refAccountId: AccountId,
    prepareCall: PrepareInviteAddressCall,
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

    return await spokeCommon.write.inviteAddress(
      [params, accountId, folksChainIdToInvite, addressToInvite, refAccountId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      },
    );
  },

  async acceptInvite(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    prepareCall: PrepareAcceptInviteAddressCall,
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

    return await spokeCommon.write.acceptInviteAddress([params, accountId], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gasLimit: gasLimit,
      value: adapterFee,
    });
  },

  async unregisterAddress(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    folksChainIdToUnregister: FolksChainId,
    prepareCall: PrepareUnregisterAddressCall,
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

    return await spokeCommon.write.unregisterAddress(
      [params, accountId, folksChainIdToUnregister],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: adapterFee,
      },
    );
  },
};
