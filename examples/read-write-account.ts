import { createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import { getRandomBytes } from "../src/common/utils/bytes.js";
import {
  NetworkType,
  FolksCore,
  FolksAccount,
  FOLKS_CHAIN_ID,
  BYTES32_LENGTH,
  getSupportedMessageAdapters,
  Action,
  MessageAdapterParamsType,
} from "../src/index.js";

import type { AccountId } from "../src/common/types/lending.js";
import type { FolksCoreConfig, MessageAdapters } from "../src/index.js";

async function main() {
  const folksConfig: FolksCoreConfig = {
    network: NetworkType.TESTNET,
    provider: { evm: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(NetworkType.TESTNET);

  const accountId: AccountId = getRandomBytes(BYTES32_LENGTH) as AccountId;

  // read
  const accountInfo = await FolksAccount.read.accountInfo(accountId);

  console.log(accountInfo);

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

  const prepareCreateAccountCall = await FolksAccount.prepare.createAccount(accountId, adapters);
  const createAccountCallRes = await FolksAccount.write.createAccount(accountId, prepareCreateAccountCall);

  console.log(createAccountCallRes);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
