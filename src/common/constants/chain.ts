import { avalancheFuji, baseSepolia, sepolia } from "viem/chains";
import { AdapterType, ChainType, NetworkType } from "../types/index.js";
import type { FolksChain, FolksChainId, SpokeChain } from "../types/index.js";
import { convertToGenericAddress } from "../utils/address.js";

export const MAINNET_FOLKS_CHAIN_ID = {} as const;

export const TESTNET_FOLKS_CHAIN_ID = {
  AVALANCHE_FUJI: 1,
  ETHEREUM_SEPOLIA: 6,
  BASE_SEPOLIA: 7,
} as const;

export const FOLKS_CHAIN_ID = {
  ...MAINNET_FOLKS_CHAIN_ID,
  ...TESTNET_FOLKS_CHAIN_ID,
} as const;

export const FOLKS_CHAIN: Record<
  NetworkType,
  Partial<Record<FolksChainId, FolksChain>>
> = {
  [NetworkType.MAINNET]: {},
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      chainName: avalancheFuji.name,
      chainId: avalancheFuji.id,
      network: NetworkType.TESTNET,
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      chainName: sepolia.name,
      chainId: sepolia.id,
      network: NetworkType.TESTNET,
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      chainName: baseSepolia.name,
      chainId: baseSepolia.id,
      network: NetworkType.TESTNET,
    },
  },
} as const;

export const SPOKE_CHAIN: Record<
  NetworkType,
  Partial<Record<FolksChainId, SpokeChain>>
> = {
  [NetworkType.MAINNET]: {},
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      spokeCommonAddress: convertToGenericAddress(
        "0x20BF45dc0375a60c7203655f1763A7165a889604",
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x16ABF55447f61C6F9b811b9a29235339cE3Cb716",
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0x52521e15f9C59aff55650011FAA45De233207bB8",
          ChainType.EVM,
        ),
      },
      tokens: {},
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x1217Fd6DDa71708FF3A8eB82602777379b59ba64",
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xc676af388d4caBEb6c2a895412de1a448584377A",
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x2b1AB136105F05E2F91C3b175Dc1550b4C5EcC9F",
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xE562fdBcE03815b11F480b43DA2F4ce527cE526c",
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x0513f9Cfe9B5Fb3c2948Da7C807B53202f3D3A54",
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x61173406ac3bdF207b56743D35bC382D54199B18",
          ChainType.EVM,
        ),
      },
      tokens: {},
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x1217Fd6DDa71708FF3A8eB82602777379b59ba64",
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xc676af388d4caBEb6c2a895412de1a448584377A",
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xE562fdBcE03815b11F480b43DA2F4ce527cE526c",
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x0513f9Cfe9B5Fb3c2948Da7C807B53202f3D3A54",
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x61173406ac3bdF207b56743D35bC382D54199B18",
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0xFD80E88Bab1dd4cC3B8604238Dba31d77a5bC128",
          ChainType.EVM,
        ),
      },
      tokens: {},
    },
  },
};
