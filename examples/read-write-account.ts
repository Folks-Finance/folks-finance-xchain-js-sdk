import { createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import { getRandomBytes } from "../src/common/utils/bytes.js";
import {
  NetworkType,
  FolksCore,
  FolksAccount,
  FOLKS_CHAIN_ID,
  BYTES4_LENGTH,
  getSupportedMessageAdapters,
  Action,
  MessageAdapterParamsType,
  generateAccountId,
  convertToGenericAddress,
  ChainType,
} from "../src/index.js";

import type { EvmAddress, FolksCoreConfig, MessageAdapters, Nonce } from "../src/index.js";

async function main() {
  const folksConfig: FolksCoreConfig = {
    network: NetworkType.TESTNET,
    provider: { evm: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(NetworkType.TESTNET);

  const nonce: Nonce = getRandomBytes(BYTES4_LENGTH) as Nonce;

  // write
  const MNEMONIC = "your mnemonic here";
  const account = mnemonicToAccount(MNEMONIC);

  const signer = createWalletClient({
    account,
    transport: http(),
  });

  const { adapterIds, returnAdapterIds } = getSupportedMessageAdapters({
    action: Action.CreateAccount,
    messageAdapterParamType: MessageAdapterParamsType.Data,
    network: NetworkType.TESTNET,
    sourceFolksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
  });

  const adapters: MessageAdapters = {
    adapterId: adapterIds[0],
    returnAdapterId: returnAdapterIds[0],
  };

  FolksCore.setFolksSigner({
    signer,
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
  });

  // read
  const folksChain = FolksCore.getSelectedFolksChain();
  const userAddress = convertToGenericAddress(account.address as EvmAddress, ChainType.EVM);
  const accountId = generateAccountId(userAddress, folksChain.folksChainId, nonce);
  const accountInfo = await FolksAccount.read.accountInfo(accountId);
  console.log(accountInfo);

  // write
  const prepareCreateAccountCall = await FolksAccount.prepare.createAccount(nonce, adapters);
  const createAccountCallRes = await FolksAccount.write.createAccount(nonce, prepareCreateAccountCall);

  console.log(createAccountCallRes);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
