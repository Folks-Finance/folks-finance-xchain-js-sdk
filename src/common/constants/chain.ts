import {
  avalanche,
  avalancheFuji,
  base,
  baseGoerli,
  goerli,
  mainnet,
} from "viem/chains";

import { AdapterType, ChainType, NetworkType } from "../types/index.js";

import type { FolksChain, FolksChainId, SpokeChain } from "../types/index.js";

export const MAINNET_FOLKS_CHAIN_ID = {
  AVALANCHE: 1,
  ETHEREUM: 2,
  BASE: 3,
} as const;

export const TESTNET_FOLKS_CHAIN_ID = {
  AVALANCHE_FUJI: 4,
  ETHEREUM_GOERLI: 5,
  BASE_GOERLI: 6,
} as const;

export const FOLKS_CHAIN_ID = {
  ...MAINNET_FOLKS_CHAIN_ID,
  ...TESTNET_FOLKS_CHAIN_ID,
} as const;

export const FOLKS_CHAIN: Record<
  NetworkType,
  Partial<Record<FolksChainId, FolksChain>>
> = {
  [NetworkType.MAINNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE,
      chainName: avalanche.name,
      chainId: avalanche.id,
      network: NetworkType.MAINNET,
    },
    [FOLKS_CHAIN_ID.BASE]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.BASE,
      chainName: base.name,
      chainId: base.id,
      network: NetworkType.MAINNET,
    },
    [FOLKS_CHAIN_ID.ETHEREUM]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM,
      chainName: mainnet.name,
      chainId: mainnet.id,
      network: NetworkType.MAINNET,
    },
  },
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      chainName: avalancheFuji.name,
      chainId: avalancheFuji.id,
      network: NetworkType.TESTNET,
    },
    [FOLKS_CHAIN_ID.BASE_GOERLI]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.BASE_GOERLI,
      chainName: baseGoerli.name,
      chainId: baseGoerli.id,
      network: NetworkType.TESTNET,
    },
    [FOLKS_CHAIN_ID.ETHEREUM_GOERLI]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_GOERLI,
      chainName: goerli.name,
      chainId: goerli.id,
      network: NetworkType.TESTNET,
    },
  },
} as const;

export const SPOKE_CHAIN: Record<
  NetworkType,
  Partial<Record<FolksChainId, SpokeChain>>
> = {
  [NetworkType.MAINNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE,
      spokeCommonAddress: "0x",
      bridgeRouterAddress: "0x",
      adapters: {
        [AdapterType.HUB]: "0x",
      },
      tokens: {},
    },
  },
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      spokeCommonAddress: "0x",
      bridgeRouterAddress: "0x",
      adapters: {
        [AdapterType.HUB]: "0x",
      },
      tokens: {},
    },
  },
};
