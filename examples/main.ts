import { randomBytes } from "crypto";

import { createWalletClient, http } from "viem";

import {
  NetworkType,
  FolksCore,
  FolksAccount,
  AdapterType,
  FOLKS_CHAIN_ID,
} from "../src/index.js";

import type { FolksCoreConfig, MessageAdapters } from "../src/index.js";
import type { Hex } from "viem";

async function main() {
  const folksConfig: FolksCoreConfig = {
    network: NetworkType.TESTNET,
    provider: { evm: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(NetworkType.TESTNET);

  const accountId: Hex = randomBytes(32).toString("hex") as Hex;

  // read
  const accountInfo = await FolksAccount.read.accountInfo(accountId);

  console.log(accountInfo);

  // write
  const signer = createWalletClient({
    transport: http(),
  });
  const adapters: MessageAdapters = {
    adapterId: AdapterType.WORMHOLE_DATA,
    returnAdapterId: AdapterType.HUB,
  };

  FolksCore.setFolksSigner({
    signer,
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
  });

  const prepareCreateAccountCall = await FolksAccount.prepare.createAccount(
    accountId,
    adapters,
  );
  const createAccountCallRes = await FolksAccount.write.createAccount(
    accountId,
    prepareCreateAccountCall,
  );

  console.log(createAccountCallRes);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
