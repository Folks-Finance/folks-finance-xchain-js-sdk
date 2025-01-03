import { createClient, createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import { convertStringToLoanName } from "../src/common/utils/lending.js";
import {
  NetworkType,
  FolksCore,
  getRandomBytes,
  FolksLoan,
  FOLKS_CHAIN_ID,
  BYTES4_LENGTH,
  getSupportedMessageAdapters,
  Action,
  MessageAdapterParamsType,
  LoanTypeId,
  CHAIN_VIEM,
} from "../src/index.js";

import type { FolksCoreConfig, MessageAdapters, Nonce, AccountId } from "../src/index.js";

async function main() {
  const chain = FOLKS_CHAIN_ID.AVALANCHE_FUJI;
  const jsonRpcAddress = "https://my-rpc.avax-testnet.network/<API_KEY>";

  const folksConfig: FolksCoreConfig = {
    network: NetworkType.TESTNET,
    provider: {
      evm: {
        [chain]: createClient({
          chain: CHAIN_VIEM[chain],
          transport: http(jsonRpcAddress),
        }),
      },
    },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(NetworkType.TESTNET);

  const nonce: Nonce = getRandomBytes(BYTES4_LENGTH) as Nonce;

  const MNEMONIC = "your mnemonic here";
  const account = mnemonicToAccount(MNEMONIC);

  const signer = createWalletClient({
    account,
    chain: CHAIN_VIEM[chain],
    transport: http(jsonRpcAddress),
  });

  const { adapterIds, returnAdapterIds } = getSupportedMessageAdapters({
    action: Action.CreateLoan,
    messageAdapterParamType: MessageAdapterParamsType.Data,
    network: NetworkType.TESTNET,
    sourceFolksChainId: chain,
  });

  const adapters: MessageAdapters = {
    adapterId: adapterIds[0],
    returnAdapterId: returnAdapterIds[0],
  };

  FolksCore.setFolksSigner({ signer, folksChainId: chain });

  const accountId = "0x7d6...b66" as AccountId; //Your xChainApp account id
  const loanName = convertStringToLoanName("Test Loan");

  const prepareCreateLoanCall = await FolksLoan.prepare.createLoan(
    accountId,
    nonce,
    LoanTypeId.GENERAL, // LoanTypeId.DEPOSIT for deposits
    loanName,
    adapters,
  );
  const createLoanCallRes = await FolksLoan.write.createLoan(
    accountId,
    nonce,
    LoanTypeId.GENERAL, // LoanTypeId.DEPOSIT for deposits
    loanName,
    prepareCreateLoanCall,
  );
  console.log(`Transaction ID: ${createLoanCallRes}`);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
