import { avalancheFuji, baseSepolia, sepolia } from "viem/chains";

import {
  MAINNET_EVM_FOLKS_CHAIN_ID,
  TESTNET_EVM_FOLKS_CHAIN_ID,
} from "../../chains/evm/common/constants/chain.js";
import { NetworkType, ChainType } from "../types/chain.js";
import { AdapterType } from "../types/message.js";
import { FolksTokenId, TokenType } from "../types/token.js";
import { convertToGenericAddress } from "../utils/address.js";

import { TESTNET_POOLS } from "./pool.js";

import type { EvmAddress } from "../types/address.js";
import type {
  FolksChainId,
  FolksChain,
  SpokeChain,
  FolksChainName,
} from "../types/chain.js";

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
        "0x86f53A908659315F72AaD7b4C5a1ae72Fbd42c23" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x70c92ECa438118422839d113B5F03Fec0d3Af2b1" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0x4B61b6CBC7d768872a1AEEe2c4002163fd85B854" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          tokenType: TokenType.CIRCLE,
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0xCC0b0887f89a975b526a4ce739f529C82E3EEfe6" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: convertToGenericAddress(
            "0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress,
            ChainType.EVM,
          ),
          tokenDecimals: 6,
        },
        [FolksTokenId.AVAX]: {
          tokenType: TokenType.NATIVE,
          folksTokenId: FolksTokenId.AVAX,
          poolId: TESTNET_POOLS[FolksTokenId.AVAX],
          spokeAddress: convertToGenericAddress(
            "0xD9501BfBFD9e027BB187AEA7A8aa56b7a7552a5a" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: null,
          tokenDecimals: 18,
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0xa56798Dd11460401dECFBfc95A6Ae812f61Adcb4" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xb31b3411B51604fa0058AEf8fc2c1E498e3be4d4" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xBb8a3bA04B78b00AED3163585432ca8b9B246497" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xA2556b4E0eA3FD885B08622F3c41130cfe4c766C" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x2FA6B08a979f3bdA0C9A6Cc81Bb3D04Be6E7cAd7" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x9b6F3306Da200df1C97F1D069D23933AA281b3a8" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          tokenType: TokenType.CIRCLE,
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x20BF45dc0375a60c7203655f1763A7165a889604" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: convertToGenericAddress(
            "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as EvmAddress,
            ChainType.EVM,
          ),
          tokenDecimals: 6,
        },
        [FolksTokenId.ETH_eth_sep]: {
          tokenType: TokenType.NATIVE,
          folksTokenId: FolksTokenId.ETH_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x4CbFa0fFaB85f0E14294038eD2f57A0245900933" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: null,
          tokenDecimals: 18,
        },
        [FolksTokenId.LINK_eth_sep]: {
          tokenType: TokenType.ERC20,
          folksTokenId: FolksTokenId.LINK_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x3C0165909420dDCCCdd66AE7F70d1FF12BD18A54" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: convertToGenericAddress(
            "0x514910771af9ca656af840dff83e8264ecf986ca" as EvmAddress,
            ChainType.EVM,
          ),
          tokenDecimals: 18,
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x2FA6B08a979f3bdA0C9A6Cc81Bb3D04Be6E7cAd7" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x791eAE67Bb1B214aD7205d381ea179376C8770b5" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x21a91A04e452Ada77bFBF1fCa697F0D70B8917cA" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xb31b3411B51604fa0058AEf8fc2c1E498e3be4d4" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xBb8a3bA04B78b00AED3163585432ca8b9B246497" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0xA2556b4E0eA3FD885B08622F3c41130cfe4c766C" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          tokenType: TokenType.CIRCLE,
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0xc4Ef56Db16C5b75E04f7220419da406220736075" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: convertToGenericAddress(
            "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as EvmAddress,
            ChainType.EVM,
          ),
          tokenDecimals: 6,
        },
        [FolksTokenId.ETH_base_sep]: {
          tokenType: TokenType.NATIVE,
          folksTokenId: FolksTokenId.ETH_base_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
          spokeAddress: convertToGenericAddress(
            "0xEedC43C182103bb75019Aaa51f63cb92C9A1c560" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: null,
          tokenDecimals: 18,
        },
      },
    },
  },
};
