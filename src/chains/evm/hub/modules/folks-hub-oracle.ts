import { multicall } from "viem/actions";

import { getHubChain } from "../utils/chain.js";
import { getOracleManagerContract } from "../utils/contract.js";

import type { NetworkType } from "../../../../common/types/chain.js";
import type { OracleManagerAbi } from "../constants/abi/oracle-manager-abi.js";
import type { OraclePrices } from "../types/oracle.js";
import type { HubTokenData } from "../types/token.js";
import type {
  Client,
  ContractFunctionParameters,
  ReadContractReturnType,
} from "viem";

export async function getOraclePrices(
  provider: Client,
  network: NetworkType,
  tokens: Array<HubTokenData>,
): Promise<OraclePrices> {
  const hubChain = getHubChain(network);
  const oracleManager = getOracleManagerContract(
    provider,
    hubChain.oracleManagerAddress,
  );

  const processPriceFeeds: Array<ContractFunctionParameters> = tokens.map(
    ({ poolId }) => ({
      address: oracleManager.address,
      abi: oracleManager.abi,
      functionName: "processPriceFeed",
      args: [poolId],
    }),
  );

  const priceFeeds = (await multicall(provider, {
    contracts: processPriceFeeds,
    allowFailure: false,
  })) as Array<
    ReadContractReturnType<typeof OracleManagerAbi, "processPriceFeed">
  >;

  const oraclePrices: OraclePrices = {};
  for (const [i, { price }] of priceFeeds.entries()) {
    const token = tokens[i];
    oraclePrices[token.folksTokenId] = [price, 18];
  }
  return oraclePrices;
}
