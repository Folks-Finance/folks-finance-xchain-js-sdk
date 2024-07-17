import { createClient, http } from "viem";

import {
  CHAIN_VIEM,
  FOLKS_CHAIN_ID,
  FolksCore,
  FolksLoan,
  FolksOracle,
  FolksPool,
  FolksTokenId,
  LoanTypeId,
  NetworkType,
} from "../src/index.js";

import type { AccountId, FolksCoreConfig } from "../src/index.js";

async function main() {
  const folksConfig: FolksCoreConfig = {
    network: NetworkType.TESTNET,
    provider: {
      evm: {
        [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: createClient({
          chain: CHAIN_VIEM[FOLKS_CHAIN_ID.AVALANCHE_FUJI],
          transport: http("https://my-rpc.avax-testnet.network/<API_KEY>"),
        }),
      },
    },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(NetworkType.TESTNET);

  const poolsInfo = {
    [FolksTokenId.USDC]: await FolksPool.read.poolInfo(FolksTokenId.USDC),
    [FolksTokenId.AVAX]: await FolksPool.read.poolInfo(FolksTokenId.AVAX),
    [FolksTokenId.ETH_eth_sep]: await FolksPool.read.poolInfo(FolksTokenId.ETH_eth_sep),
    [FolksTokenId.ETH_base_sep]: await FolksPool.read.poolInfo(FolksTokenId.ETH_base_sep),
    [FolksTokenId.LINK_eth_sep]: await FolksPool.read.poolInfo(FolksTokenId.LINK_eth_sep),
  };
  const loanTypeInfo = {
    [LoanTypeId.GENERAL]: await FolksLoan.read.loanTypeInfo(LoanTypeId.GENERAL),
  };
  const oraclePrices = await FolksOracle.read.oraclePrices();

  const accountId: AccountId = "my account id" as AccountId;

  const loanIds = await FolksLoan.read.userLoansIds(accountId, [LoanTypeId.GENERAL]);
  const generalLoansIds = loanIds.get(LoanTypeId.GENERAL);

  if (!generalLoansIds) {
    console.log("No general loans found");
    return;
  }

  const userGeneralLoans = await FolksLoan.read.userLoans(generalLoansIds);
  const userGeneralLoansInfo = FolksLoan.util.userLoansInfo(userGeneralLoans, poolsInfo, loanTypeInfo, oraclePrices);

  console.log(userGeneralLoansInfo);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((error: unknown) => {
    console.error(error);
  });
