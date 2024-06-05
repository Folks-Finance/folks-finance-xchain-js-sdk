import { createWalletClient, http } from "viem";

import { getEmptyBytes, getRandomBytes } from "../src/common/utils/bytes.js";
import {
  NetworkType,
  FolksCore,
  FolksAccount,
  AdapterType,
  FOLKS_CHAIN_ID,
  BYTES32_LENGTH,
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
  const refAccountId: AccountId = getEmptyBytes(BYTES32_LENGTH) as AccountId;

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
    refAccountId,
    adapters,
  );
  const createAccountCallRes = await FolksAccount.write.createAccount(
    accountId,
    refAccountId,
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
