import { multiply, divide } from "dnum";
import { createClient, createWalletClient, http, parseUnits } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import {
  NetworkType,
  FolksCore,
  FolksLoan,
  FolksPool,
  FOLKS_CHAIN_ID,
  getSupportedMessageAdapters,
  Action,
  MessageAdapterParamsType,
  CHAIN_VIEM,
  TESTNET_FOLKS_TOKEN_ID,
} from "../src/index.js";

import type { FolksCoreConfig, MessageAdapters, AccountId, LoanId } from "../src/index.js";

async function main() {
  const chain = FOLKS_CHAIN_ID.BSC_TESTNET;
  const tokenId = TESTNET_FOLKS_TOKEN_ID.BNB;
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
  const amountToBorrow = parseUnits("0.0005", 18); // 0.0005 BNB (BNB has 18 decimals)
  const poolInfo = await FolksPool.read.poolInfo(tokenId);
  const interestRate = poolInfo.stableBorrowData.interestRate[0];
  const stableRateSlippagePercent = 5; // 5% max deviation from current rate
  const [maxStableRate] = divide(multiply(interestRate, 100 + stableRateSlippagePercent), 100);

  const prepareBorrowCall = await FolksLoan.prepare.borrow(
    accountId,
    loanId,
    tokenId,
    amountToBorrow,
    maxStableRate,
    chain,
    adapters,
  );
  const createBorrowCallRes = await FolksLoan.write.borrow(
    accountId,
    loanId,
    tokenId,
    amountToBorrow,
    maxStableRate,
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
