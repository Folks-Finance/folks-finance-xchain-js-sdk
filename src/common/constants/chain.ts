import { arbitrumSepolia, avalancheFuji, baseSepolia, bscTestnet, sepolia } from "viem/chains";

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
    [FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA,
      chainName: arbitrumSepolia.name,
      chainId: arbitrumSepolia.id,
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
        "0x8E21b4F6adaD81c3e4011dE473922BA58898E404" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xAaEcFF29b04CBB4B64bd1570fFA4BB09d4e0F737" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0x17B77e02E1D72Cd17D86c1a31D7F9EC78563c88A" as EvmAddress,
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
            "0x96b03Ad709CE218df1C5916082D95dFd76d658cc" as EvmAddress,
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
            "0x43D1358b4669D664F2004a26C25047741ACD355f" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x107bBAb1750a442445c61B01A4DA06C4655d4355" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x6d2AD1F2E2F8e56199c76d3B0CeD2B2588A81Aa7" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xb6E54dA23fe79Ce5AA3328E6075C3356a9359f5E" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x3201264454fE15e2cf19FE0c8ef41C9fA4FE410D" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xB316335c113AD2Eb81984eF73ECf6740f3c4F783" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x96f5e6C4223D547098F7d3323717AbD8e8140A54" as EvmAddress,
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
            "0x337fC477d26fB1B126a6bd0D33FcEb9348d9B975" as EvmAddress,
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
            "0xeb3FF5bB690151249500f21BcDBc202F22DAd030" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.LINK_eth_sep]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x779877a7b0d9e8603169ddbd7836e478b4624789" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: FolksTokenId.LINK_eth_sep,
          poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0xDe90a2d3ee07Bfe5098dA919c8F28C24321a6aCe" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0xC082C4Dd211f8B6265004C94a4f42cDC2310F9b9" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x744a98FB07cFd8041fA860101164779482DC2296" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xCa20c93Bb0f838C69111Eef3C9063531CF794e0d" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xb2b26Fe61f5D99D9B19047b8cC077c37502400Bc" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xDd2b3293DeAFE8299D83515Ced95BA9Fa9b347F2" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x4466eDb9a5998eB85d8d44f10c277e7EdBAbFd38" as EvmAddress,
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
            "0x59BF583578f2B2cd50A920e3606E16e012B8cEB4" as EvmAddress,
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
            "0xad82550A58aAeA7AbB3Bd56453840235130F4A72" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BSC_TESTNET]: {
      folksChainId: FOLKS_CHAIN_ID.BSC_TESTNET,
      spokeCommonAddress: convertToGenericAddress(
        "0x2E42F86c866B42Bf05A211eB08150b170a1302AA" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x605eD3E43e35527c98EC8c3a2e9a16d1130DFfc7" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xADB48f18527e32DcBBB1dF8E3eE02BB9e75c1BA5" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xB7bF086CA3765FF28F5C3A6Ac95560a446E6235c" as EvmAddress,
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
            "0x3C0165909420dDCCCdd66AE7F70d1FF12BD18A54" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x4C838f72E1DD49982a41A495898793F4231308E0" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xf5C2cbC3aE42d9a3a45F5eD53AB4C2cfF1ca2e06" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x0093eB5058250f60F109f74991E1B78346DEd996" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x6dEee8955334a3608e536bc9ACcF710Fc0251166" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x728983074ab96AC83E972905C1C55C50A1997298" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x312b6d48968BF16453263Bc71dF0973458108350" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [FolksTokenId.USDC]: {
          token: {
            type: TokenType.CIRCLE,
            address: convertToGenericAddress("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: FolksTokenId.USDC,
          poolId: TESTNET_POOLS[FolksTokenId.USDC],
          spokeAddress: convertToGenericAddress(
            "0x21c9e0119d891E075C702f61E9DDa4b73320F99F" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [FolksTokenId.ETH_arb_sep]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: FolksTokenId.ETH_arb_sep,
          poolId: TESTNET_POOLS[FolksTokenId.ETH_arb_sep],
          spokeAddress: convertToGenericAddress(
            "0x3161f22F47226BbEB4F87443E20c144b95205332" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  },
};
