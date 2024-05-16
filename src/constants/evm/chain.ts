import type { Chain } from "viem";
import {
  avalanche,
  avalancheFuji,
  mainnet,
  goerli,
  base,
  baseGoerli,
} from "viem/chains";
import { FOLKS_CHAIN_ID } from "../common/index.js";
import type { FolksChainId } from "../../type/common/index.js";

export const CHAIN_VIEM: Record<FolksChainId, Chain> = {
  // mainnet
  [FOLKS_CHAIN_ID.AVALANCHE]: avalanche,
  [FOLKS_CHAIN_ID.ETHEREUM]: mainnet,
  [FOLKS_CHAIN_ID.BASE]: base,
  // testnet
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: avalancheFuji,
  [FOLKS_CHAIN_ID.ETHEREUM_GOERLI]: goerli,
  [FOLKS_CHAIN_ID.BASE_GOERLI]: baseGoerli,
};

export const CHAIN_NODE: Record<FolksChainId, Array<string>> = {
  // mainnet
  [FOLKS_CHAIN_ID.AVALANCHE]: [...avalanche.rpcUrls.default.http],
  [FOLKS_CHAIN_ID.ETHEREUM]: [...mainnet.rpcUrls.default.http],
  [FOLKS_CHAIN_ID.BASE]: [...base.rpcUrls.default.http],
  // testnet
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: [...avalancheFuji.rpcUrls.default.http],
  [FOLKS_CHAIN_ID.ETHEREUM_GOERLI]: [...goerli.rpcUrls.default.http],
  [FOLKS_CHAIN_ID.BASE_GOERLI]: [...baseGoerli.rpcUrls.default.http],
};
