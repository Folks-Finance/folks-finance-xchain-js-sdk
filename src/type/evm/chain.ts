/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
import { avalanche, avalancheFuji, mainnet, goerli, base, baseGoerli } from "viem/chains";

export enum ChainId {
  // mainnet
  AVALANCHE = avalanche.id,
  ETHEREUM = mainnet.id,
  BASE = base.id,
  // testnet
  AVALANCHE_FUJI = avalancheFuji.id,
  ETHEREUM_GOERLI = goerli.id,
  BASE_GOERLI = baseGoerli.id,
}
