import { avalancheFuji, baseSepolia, sepolia } from "viem/chains";

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
  },
} as const;

export const SPOKE_CHAIN: Record<NetworkType, Partial<Record<FolksChainId, SpokeChain>>> = {
  [NetworkType.MAINNET]: {},
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      spokeCommonAddress: convertToGenericAddress(
        "0x5DcDB6DB2f9Bbf4D48d256601a9e303F9be64bbb" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xa37dB64D347331fc3c9c15938932875B3BD5D593" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0xBD9569a7a71B431a4160Cc317875B191374c47A1" as EvmAddress,
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
            "0x721834f869dDec36fB0087aD29A86ad7EE82B6ac" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.AVAX]: {
          token: {
            type: TokenType.NATIVE,
            address: null,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.AVAX,
          poolId: TESTNET_POOLS[FolksTokenId.AVAX],
          spokeAddress: convertToGenericAddress(
            "0xbCfdC7bda35931705d5Dc141D24Ff0897F97353B" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x2c92177c2a8B2dFcA61B804C970CBD311090293e" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x1BC0112BD83EA33941148737E5Ef9CcC35Df6a0c" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xa2Ca92b5A7CC5cCA41e56F20a1f9Daf0A9ed2eB5" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x1D459CfA522472c47c6171B96561cE93B327d2F2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x054DD1f0697aDC2E092b712F05829Ebdbc9bbdcb" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0xfB29aa4e30908Babb022cc397444b9d5bBa06bAd" as EvmAddress,
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
            "0x22644D46e5aE39Fa6b9d9706AaA1d398E5EB8aBc" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.ETH_eth_sep]: {
          token: {
            type: TokenType.NATIVE,
            address: null,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.ETH_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x993C9a918B145B90E69A8D22B7e3b6d3413e3755" as EvmAddress,
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
            "0x5927Cb7b0760b4eDb0235629f4a042b55C36b592" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0xd35c94e34d01880CA6F2A43c42c2Ea8d6bda2aF9" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x46cA7b3D9F9390E4a541f3f1C8a0E913087e087F" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xF42700A23c0BC0837716C03458fEB2c138144C42" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x909E5e98E8BD62d89b4d4f8849708D63c781799e" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x6401174D1dd518c908f379006F0d9C95Bb2C332D" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x7c0cd88d1BfD57b57C565D79d14BE8857268d645" as EvmAddress,
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
            "0x4D74D3630Ac5f70Ed25313EaEe690Ab7418aBA48" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.ETH_base_sep]: {
          token: {
            type: TokenType.NATIVE,
            address: null,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.ETH_base_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
          spokeAddress: convertToGenericAddress(
            "0x8f9f941327e5E457494796e9D03cb82F788F0c2b" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  },
};
