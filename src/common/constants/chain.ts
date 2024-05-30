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
        "0x99477F62999AfbE2B0ca9CcAAdC2f2655F8B0C84" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xD0Cd0acEaf81fCf9C90ae60102eeC0E6C8095480" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0xB01296Ea267463FDe2fcE5Fad5067B4d875A44Ba" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          tokenType: TokenType.CIRCLE,
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0xC8ad4B23B4F07A27CDDAB1A8AE2Da54377f87426" as EvmAddress,
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
            "0xF18F75595bA066efAdf4b24C7F263ba878C6B6f3" as EvmAddress,
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
        "0x132E1514A0aa02601c9eEBE42F8fDbEf11874089" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x498C9827D5230ACB708710Bd9eB0e1019CC2D711" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xeccb7067D8f0615eCe450236f2DF47b4dcc6ba8B" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xf1565F622FEd835E55aCEacE0D04A4c9786056D2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x084A113581915b3eF832E5d5bBdc30073001D4B2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x59b5cB2c7413608e00CfFe074F2ac57165eB37e0" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          tokenType: TokenType.CIRCLE,
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x71EEc2B912a3Cef6Bf134899D437Ba17Fc9588D2" as EvmAddress,
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
            "0xD3743aBf2D83725c06b12EC2C97c6b9dAC0D8a6F" as EvmAddress,
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
            "0xF85227ba19CC14e1b3FdcF9B2EBE199d64BE4CE9" as EvmAddress,
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
        "0x6Eac0286F42c8C0Cbc9997dB3b01b025EeD794f4" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xeccb7067D8f0615eCe450236f2DF47b4dcc6ba8B" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xf1565F622FEd835E55aCEacE0D04A4c9786056D2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x084A113581915b3eF832E5d5bBdc30073001D4B2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x59b5cB2c7413608e00CfFe074F2ac57165eB37e0" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x132E1514A0aa02601c9eEBE42F8fDbEf11874089" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          tokenType: TokenType.CIRCLE,
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x6789da551F420bfb607Fffb43bf8936f9dfb7d4C" as EvmAddress,
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
            "0x457f30Bc85E885e4D519975C1dd87F397d4817B7" as EvmAddress,
            ChainType.EVM,
          ),
          tokenAddress: null,
          tokenDecimals: 18,
        },
      },
    },
  },
};
