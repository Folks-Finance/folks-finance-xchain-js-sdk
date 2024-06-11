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
        "0xcFD350056A7A63C55a97A0b6D77d7E2bfde608Db" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x93682bCBD6e5A2122c27247b9c351Ac438E79FB1" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0x7eF21BaBB8e0b30B89e3159955c7136549B2813B" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress(
              "0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress,
              ChainType.EVM,
            ),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x19A9abA9cD1BFd887aafA2ebA6895ea3CAF775F1" as EvmAddress,
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
            "0x315b2aFb0E4366Cc3fF1C2688bdB31B836AB023D" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x7057bD21aE58b9E40D34023b426dc2CFd51b840F" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x5699D9efdF6F618e838E62db2C4A8d341C329EC8" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x8ED9e0A4CCd7b0D8F4f72BaE4bBeCA46A8be905B" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x63EFE00C08f6AEAA5D469A063c44504369977e8D" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x16ABF55447f61C6F9b811b9a29235339cE3Cb716" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x52521e15f9C59aff55650011FAA45De233207bB8" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress(
              "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as EvmAddress,
              ChainType.EVM,
            ),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x438fe3a25B9f6784EfB63718D3874d5bC75168c2" as EvmAddress,
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
            "0xDFff3d232Ad71e613777B1E021eDE5fFCA03379a" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.LINK_eth_sep]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress(
              "0x514910771af9ca656af840dff83e8264ecf986ca" as EvmAddress,
              ChainType.EVM,
            ),
            decimals: 18,
          },
          folksTokenId: FolksTokenId.LINK_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x4511d33188438B9d3B78783c4cB7D6AFCC47810f" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x7057bD21aE58b9E40D34023b426dc2CFd51b840F" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x5699D9efdF6F618e838E62db2C4A8d341C329EC8" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x8ED9e0A4CCd7b0D8F4f72BaE4bBeCA46A8be905B" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x63EFE00C08f6AEAA5D469A063c44504369977e8D" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x16ABF55447f61C6F9b811b9a29235339cE3Cb716" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x52521e15f9C59aff55650011FAA45De233207bB8" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress(
              "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as EvmAddress,
              ChainType.EVM,
            ),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x438fe3a25B9f6784EfB63718D3874d5bC75168c2" as EvmAddress,
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
            "0xDFff3d232Ad71e613777B1E021eDE5fFCA03379a" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  },
};
