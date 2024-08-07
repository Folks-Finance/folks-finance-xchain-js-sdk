import { avalancheFuji, baseSepolia, bscTestnet, sepolia } from "viem/chains";

import { MAINNET_EVM_FOLKS_CHAIN_ID, TESTNET_EVM_FOLKS_CHAIN_ID } from "../../chains/evm/common/constants/chain.js";
import { NetworkType, ChainType } from "../types/chain.js";
import { AdapterType } from "../types/message.js";
import { FolksTokenId, TokenType } from "../types/token.js";
import { convertToGenericAddress } from "../utils/address.js";

import { TESTNET_POOLS } from "./pool.js";

import type { EvmAddress } from "../types/address.js";
import type { FolksChainId, FolksChain, SpokeChain, FolksChainName } from "../types/chain.js";

export const MAINNET_FOLKS_CHAIN_ID = {
  ...MAINNET_EVM_FOLKS_CHAIN_ID,
} as const;

export const TESTNET_FOLKS_CHAIN_ID = {
  ...TESTNET_EVM_FOLKS_CHAIN_ID,
} as const;

export const FOLKS_CHAIN_ID = {
  ...MAINNET_FOLKS_CHAIN_ID,
  ...TESTNET_FOLKS_CHAIN_ID,
} as const satisfies Record<FolksChainName, number>;

export const FOLKS_CHAIN: Record<NetworkType, Partial<Record<FolksChainId, FolksChain>>> = {
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
    [FOLKS_CHAIN_ID.BSC_TESTNET]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.BSC_TESTNET,
      chainName: bscTestnet.name,
      chainId: bscTestnet.id,
      network: NetworkType.TESTNET,
    },
  },
} as const;

export const SPOKE_CHAIN: Record<NetworkType, Partial<Record<FolksChainId, SpokeChain>>> = {
  [NetworkType.MAINNET]: {},
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      spokeCommonAddress: convertToGenericAddress(
        "0x6628cE08b54e9C8358bE94f716D93AdDcca45b00" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x0f91d914E058d0588Cc1bf35FA3736A627C3Ba81" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0xf472ab58969709De9FfEFaeFFd24F9e90cf8DbF9" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress("0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x89df7db4af48Ec7A84DE09F755ade9AF1940420b" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.AVAX]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.AVAX,
          poolId: TESTNET_POOLS[FolksTokenId.AVAX],
          spokeAddress: convertToGenericAddress(
            "0xBFf8b4e5f92eDD0A5f72b4b0E23cCa2Cc476ce2a" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x16Eecb8CeB2CE4Ec542634d7525191dfce587C85" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xBeF7aB7C5e6CeFF384cde460dd20C862047CDFa5" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xC0CFfA934598E655DC8D25Cd1774F249FFCF5e59" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x7cdB014Bc73C74Da5b3830eDE6a4494ec52C3738" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xa51cA34831CEB2F8BafE4ADEf032286E067EF2ad" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x0100F7f027EC3B4B4Fd8bB739efd8BDDBa3bF847" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x40C77F8cc70DF8F6D7A91ebb5291d38d42540455" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.ETH_eth_sep]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.ETH_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x9ecfD854F4F8BD2275930Cc51d45d7817EF6CeE3" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.LINK_eth_sep]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x779877A7B0D9E8603169DdbD7836e478b4624789" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: FolksTokenId.LINK_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x8Aac7fA5B2d0c7Ca4f1610bB43CF0d62A670Fa14" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x993C9a918B145B90E69A8D22B7e3b6d3413e3755" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x92051Ad708C4e5FCcC7322c111F63440D638312e" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x56d9a6e25E9e31080A3Ab1bd4a6f7bd0B4C884Da" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x8c8E4Eb83138D2625a14F0517E0106D26F9c23f3" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x08447025BB3D7249cb6566E579b1d309679c7720" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x22644D46e5aE39Fa6b9d9706AaA1d398E5EB8aBc" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress("0x036CbD53842c5426634e7929541eC2318f3dCF7e" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x7cdB014Bc73C74Da5b3830eDE6a4494ec52C3738" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.ETH_base_sep]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.ETH_base_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
          spokeAddress: convertToGenericAddress(
            "0xa51cA34831CEB2F8BafE4ADEf032286E067EF2ad" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BSC_TESTNET]: {
      folksChainId: FOLKS_CHAIN_ID.BSC_TESTNET,
      spokeCommonAddress: convertToGenericAddress(
        "0x6Eac0286F42c8C0Cbc9997dB3b01b025EeD794f4" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xf1565F622FEd835E55aCEacE0D04A4c9786056D2" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x084A113581915b3eF832E5d5bBdc30073001D4B2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x59b5cB2c7413608e00CfFe074F2ac57165eB37e0" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.BNB]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.BNB,
          poolId: TESTNET_POOLS[FolksTokenId.BNB],
          spokeAddress: convertToGenericAddress(
            "0x40f7d61365a297eD31BCcEfE9c5B11f594e7CD75" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  },
};
