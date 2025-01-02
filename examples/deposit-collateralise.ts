import { createClient, createWalletClient, http, parseUnits, formatUnits } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import {
  NetworkType,
  FolksCore,
  FolksLoan,
  FOLKS_CHAIN_ID,
  getSupportedMessageAdapters,
  Action,
  MessageAdapterParamsType,
  LoanTypeId,
  CHAIN_VIEM,
  TESTNET_FOLKS_TOKEN_ID,
} from "../src/index.js";

import type { FolksCoreConfig, MessageAdapters, AccountId, LoanId } from "../src/index.js";

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

  // write
  const MNEMONIC = "your mnemonic here";
  const account = mnemonicToAccount(MNEMONIC);

  const signer = createWalletClient({
    account,
    chain: CHAIN_VIEM[chain],
    transport: http(jsonRpcAddress),
  });

  const { adapterIds, returnAdapterIds } = getSupportedMessageAdapters({
    action: Action.CreateAccount,
    messageAdapterParamType: MessageAdapterParamsType.Data,
    network: NetworkType.TESTNET,
    sourceFolksChainId: chain,
  });

  const adapters: MessageAdapters = {
    adapterId: adapterIds[0],
    returnAdapterId: returnAdapterIds[0],
  };

  FolksCore.setFolksSigner({ signer, folksChainId: chain });

  const accountId = "0x7d6...b66" as AccountId; // Your xChainApp account id
  const loanId = "0x166...c12" as LoanId; // Your loan id
  const amountToDeposit = parseUnits("0.1", 18); // 0.1 AVAX (AVAX has 18 decimals)

  const prepareDepositCall = await FolksLoan.prepare.deposit(
    accountId,
    loanId,
    LoanTypeId.GENERAL,
    TESTNET_FOLKS_TOKEN_ID.AVAX,
    amountToDeposit,
    adapters,
  );
  const createDepositCallRes = await FolksLoan.write.deposit(
    accountId,
    loanId,
    amountToDeposit,
    false,
    prepareDepositCall,
  );
  console.log(
    `${formatUnits(amountToDeposit, 18)} ${TESTNET_FOLKS_TOKEN_ID.AVAX} deposited to loan ${loanId}, transaction ID: ${createDepositCallRes}`,
  );
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
