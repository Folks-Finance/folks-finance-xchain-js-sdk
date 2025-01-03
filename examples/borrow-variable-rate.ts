import { createClient, createWalletClient, http, parseUnits } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import {
  NetworkType,
  FolksCore,
  FolksLoan,
  FOLKS_CHAIN_ID,
  getSupportedMessageAdapters,
  Action,
  MessageAdapterParamsType,
  CHAIN_VIEM,
  TESTNET_FOLKS_TOKEN_ID,
} from "../src/index.js";

import type { FolksCoreConfig, MessageAdapters, AccountId, LoanId } from "../src/index.js";

async function main() {
  const chain = FOLKS_CHAIN_ID.AVALANCHE_FUJI;
  const tokenId = TESTNET_FOLKS_TOKEN_ID.USDC;
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

  const MNEMONIC = "your mnemonic here";
  const account = mnemonicToAccount(MNEMONIC);

  const signer = createWalletClient({
    account,
    chain: CHAIN_VIEM[chain],
    transport: http(jsonRpcAddress),
  });

  const { adapterIds, returnAdapterIds } = getSupportedMessageAdapters({
    action: Action.Borrow,
    messageAdapterParamType: MessageAdapterParamsType.ReceiveToken,
    network: NetworkType.TESTNET,
    sourceFolksChainId: chain,
    destFolksChainId: chain,
    folksTokenId: tokenId,
  });

  const adapters: MessageAdapters = {
    adapterId: adapterIds[0],
    returnAdapterId: returnAdapterIds[0],
  };

  FolksCore.setFolksSigner({ signer, folksChainId: chain });

  const accountId = "0x7d6...b66" as AccountId; // Your xChainApp account id
  const loanId = "0x166...c12" as LoanId; // Your loan id
  const amountToBorrow = parseUnits("1", 6); // 1 USDC (USDC has 6 decimals)

  const prepareBorrowCall = await FolksLoan.prepare.borrow(
    accountId,
    loanId,
    tokenId,
    amountToBorrow,
    BigInt(0),
    chain,
    adapters,
  );
  const createBorrowCallRes = await FolksLoan.write.borrow(
    accountId,
    loanId,
    tokenId,
    amountToBorrow,
    BigInt(0),
    chain,
    prepareBorrowCall,
  );
  console.log(`Transaction ID: ${createBorrowCallRes}`);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
