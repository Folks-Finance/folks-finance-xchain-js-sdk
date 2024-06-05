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
import type { MessageToSend } from "../../../../common/types/message.js";
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
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.createAccount(
      [messageToSend.params, accountId, refAccountId],
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

  async inviteAddress(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    folksChainIdToInvite: number,
    addressToInvite: GenericAddress,
    refAccountId: AccountId,
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
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

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

  async acceptInvite(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareAcceptInviteAddressCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);

    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.acceptInviteAddress(
      [messageToSend.params, accountId],
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

  async unregisterAddress(
    provider: Client,
    sender: EvmAddress,
    messageToSend: MessageToSend,
    accountId: AccountId,
    folksChainIdToUnregister: FolksChainId,
    spokeChain: SpokeChain,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareUnregisterAddressCall> {
    const spokeCommonAddress = spokeChain.spokeCommonAddress;

    const spokeCommon = getSpokeCommonContract(provider, spokeCommonAddress);
    const bridgeRouter = getBridgeRouterSpokeContract(
      provider,
      spokeChain.bridgeRouterAddress,
    );

    // get adapter fees
    const msgValue = await bridgeRouter.read.getSendFee([messageToSend]);
    // get gas limits
    const gasLimit = await spokeCommon.estimateGas.unregisterAddress(
      [messageToSend.params, accountId, folksChainIdToUnregister],
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
  async createAccount(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    refAccountId: AccountId,
    prepareCall: PrepareCreateAccountCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.createAccount(
      [messageParams, accountId, refAccountId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
        value: msgValue,
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
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.inviteAddress(
      [
        messageParams,
        accountId,
        folksChainIdToInvite,
        addressToInvite,
        refAccountId,
      ],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },

  async acceptInvite(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    prepareCall: PrepareAcceptInviteAddressCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.acceptInviteAddress(
      [messageParams, accountId],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },

  async unregisterAddress(
    provider: Client,
    signer: WalletClient,
    accountId: AccountId,
    folksChainIdToUnregister: FolksChainId,
    prepareCall: PrepareUnregisterAddressCall,
  ) {
    const { msgValue, gasLimit, messageParams, spokeCommonAddress } =
      prepareCall;

    const spokeCommon = getSpokeCommonContract(
      provider,
      spokeCommonAddress,
      signer,
    );

    return await spokeCommon.write.unregisterAddress(
      [messageParams, accountId, folksChainIdToUnregister],
      {
        account: getEvmSignerAccount(signer),
        chain: signer.chain,
        gasLimit: gasLimit,
        value: msgValue,
      },
    );
  },
};
