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
        "0xd2ff3F3e401B67002A4AA9a1997D919a9a9Cdf5A" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x15800cF5060D860cf1AC379885269B59692b70E0" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0xdCa2476901b5f942653747972d177A142106141d" as EvmAddress,
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
            "0x3EA381D434b5b020ce2F9a0fba28248F93BCbB8b" as EvmAddress,
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
            "0x1005CFDc2F195a8a549F13DFF41B1bA005c8488f" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x1A72784AdEaBC4B51E8F3e877ab42f74FEa96b38" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xE5A36FF4E291EaA87fb780792C966a08C163B92b" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xF060E7C049a1dD65509AaC2B0a82D6f8fDef5978" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x11C3F8d7947eAfF66d1D113ADfdb76BD08D710ae" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x0a079Fb8EC634307A2190Bdb41F3146BCf1fBF78" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x1Bf67e08e4afac11b4E789334Ea4Ea9971DC8B2B" as EvmAddress,
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
            "0x46cA7b3D9F9390E4a541f3f1C8a0E913087e087F" as EvmAddress,
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
            "0xF42700A23c0BC0837716C03458fEB2c138144C42" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.LINK_eth_sep]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x514910771af9ca656af840dff83e8264ecf986ca" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: FolksTokenId.LINK_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x909E5e98E8BD62d89b4d4f8849708D63c781799e" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x14366C26C1b8e70571C1e42734aD4d5aADCB4ADf" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x281f21759e184481F42691EAd154Da3BBa1bC5d1" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x2fD94F6B9A56879f31c14Ef1723F1315eff81d42" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x11e11845EC4E28d12a4AD313027B43492f4915FF" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x4B466063f81E1a4aD6D730ab836D92D709F9D7a6" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x90733D01ed00E920519d78F3854448c15671FDF1" as EvmAddress,
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
            "0x84Ad2276aDeeFDB1F486523819ffa81d362c2666" as EvmAddress,
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
            "0xe720592Bc4719befeEb7c001592D145f1Fc70BCa" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  },
};
