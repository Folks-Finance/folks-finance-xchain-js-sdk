import { createClient, createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import {
  Action,
  CHAIN_VIEM,
  ChainType,
  convertToGenericAddress,
  FOLKS_CHAIN_ID,
  FolksAccount,
  FolksCore,
  getSupportedMessageAdapters,
  MessageAdapterParamsType,
  NetworkType,
} from "../src/index.js";

import type { AccountId, EvmAddress, FolksCoreConfig, MessageAdapters } from "../src/index.js";

async function main() {
  const chain = FOLKS_CHAIN_ID.AVALANCHE_FUJI;
  const chainToLink = FOLKS_CHAIN_ID.BSC_TESTNET;
  const jsonRpcAddress = "https://my-rpc.avax-testnet.network/<API_KEY>";
  const jsonRpcAddressToLink = "https://my-rpc.bsc-testnet.network/<API_KEY>";

  const folksConfig: FolksCoreConfig = {
    network: NetworkType.TESTNET,
    provider: {
      evm: {
        [chain]: createClient({
          chain: CHAIN_VIEM[chain],
          transport: http(jsonRpcAddress),
        }),
        [chainToLink]: createClient({
          chain: CHAIN_VIEM[chainToLink],
          transport: http(jsonRpcAddressToLink),
        }),
      },
    },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(NetworkType.TESTNET);

  // invite
  const MNEMONIC = "your mnemonic here";
  const account = mnemonicToAccount(MNEMONIC);

  const signer = createWalletClient({
    account,
    chain: CHAIN_VIEM[chain],
    transport: http(jsonRpcAddress),
  });

  const chainAdapters = getSupportedMessageAdapters({
    action: Action.InviteAddress,
    messageAdapterParamType: MessageAdapterParamsType.Data,
    network: NetworkType.TESTNET,
    sourceFolksChainId: chain,
  });

  const adapters: MessageAdapters = {
    adapterId: chainAdapters.adapterIds[0],
    returnAdapterId: chainAdapters.returnAdapterIds[0],
  };

  FolksCore.setFolksSigner({
    signer,
    folksChainId: chain,
  });

  const accountId = "0x7d6...b66" as AccountId; // Your xChainApp account id
  const addressToLink = convertToGenericAddress("0x322...b78" as EvmAddress, ChainType.EVM);

  const prepareInviteCall = await FolksAccount.prepare.inviteAddress(accountId, chainToLink, addressToLink, adapters);
  const inviteRes = await FolksAccount.write.inviteAddress(accountId, chainToLink, addressToLink, prepareInviteCall);
  console.log(`Invitation transaction ID: ${inviteRes}`);

  // accept invitation
  const MNEMONIC_TO_LINK = "your mnemonic here";
  const accountToLink = mnemonicToAccount(MNEMONIC_TO_LINK);

  const signerToLink = createWalletClient({
    account: accountToLink,
    chain: CHAIN_VIEM[chainToLink],
    transport: http(jsonRpcAddressToLink),
  });

  const chainAdaptersToLink = getSupportedMessageAdapters({
    action: Action.AcceptInviteAddress,
    messageAdapterParamType: MessageAdapterParamsType.Data,
    network: NetworkType.TESTNET,
    sourceFolksChainId: chainToLink,
  });

  const adaptersToLink: MessageAdapters = {
    adapterId: chainAdaptersToLink.adapterIds[0],
    returnAdapterId: chainAdaptersToLink.returnAdapterIds[0],
  };

  FolksCore.setFolksSigner({
    signer: signerToLink,
    folksChainId: chainToLink,
  });

  const acceptInviteCall = await FolksAccount.prepare.acceptInvite(accountId, adaptersToLink);

  const acceptInviteRes = await FolksAccount.write.acceptInvite(accountId, acceptInviteCall);
  console.log(`Accept transaction ID: ${acceptInviteRes}`);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
