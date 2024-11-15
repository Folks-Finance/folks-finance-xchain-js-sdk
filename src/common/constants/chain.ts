import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  sepolia,
} from "viem/chains";

import { MAINNET_EVM_FOLKS_CHAIN_ID, TESTNET_EVM_FOLKS_CHAIN_ID } from "../../chains/evm/common/constants/chain.js";
import { NetworkType, ChainType } from "../types/chain.js";
import { AdapterType } from "../types/message.js";
import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID, TokenType } from "../types/token.js";
import { convertToGenericAddress } from "../utils/address.js";

import { MAINNET_POOLS, TESTNET_POOLS } from "./pool.js";

import type { EvmAddress } from "../types/address.js";
import type {
  FolksChainId,
  FolksChain,
  SpokeChain,
  FolksChainName,
  MainnetFolksChainId,
  TestnetFolksChainId,
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

export const FOLKS_CHAIN: Record<NetworkType, Partial<Record<FolksChainId, FolksChain>>> = {
  [NetworkType.MAINNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE,
      chainName: avalanche.name,
      chainId: avalanche.id,
      network: NetworkType.MAINNET,
    },
    [FOLKS_CHAIN_ID.ETHEREUM]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM,
      chainName: mainnet.name,
      chainId: mainnet.id,
      network: NetworkType.MAINNET,
    },
    [FOLKS_CHAIN_ID.BASE]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.BASE,
      chainName: base.name,
      chainId: base.id,
      network: NetworkType.MAINNET,
    },
    [FOLKS_CHAIN_ID.BSC]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.BSC,
      chainName: bsc.name,
      chainId: bsc.id,
      network: NetworkType.MAINNET,
    },
    [FOLKS_CHAIN_ID.ARBITRUM]: {
      chainType: ChainType.EVM,
      folksChainId: FOLKS_CHAIN_ID.ARBITRUM,
      chainName: arbitrum.name,
      chainId: arbitrum.id,
      network: NetworkType.MAINNET,
    },
  } satisfies Record<MainnetFolksChainId, FolksChain>,
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
  } satisfies Record<TestnetFolksChainId, FolksChain>,
} as const;

export const SPOKE_CHAIN: Record<NetworkType, Partial<Record<FolksChainId, SpokeChain>>> = {
  [NetworkType.MAINNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE,
      spokeCommonAddress: convertToGenericAddress(
        "0xc03094C4690F3844EA17ef5272Bf6376e0CF2AC6" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xF854AC65A40f1EabFD32E6D4C7d0E1c4B1753Cc5" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0xCda75578328D0CB0e79dB7797289c44fa02a77ad" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [MAINNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.USDC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0xcD68014c002184707eaE7218516cB0762A44fDDF" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.AVAX]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.AVAX,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.AVAX],
          spokeAddress: convertToGenericAddress(
            "0xe69e068539Ee627bAb1Ce878843a6C76484CBd2c" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.sAVAX]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.sAVAX,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.sAVAX],
          spokeAddress: convertToGenericAddress(
            "0x23a96D92C80E8b926dA40E574d615d9e806A87F6" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.wETH_ava]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.wETH_ava,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.wETH_ava],
          spokeAddress: convertToGenericAddress(
            "0x0e563B9fe6D9EF642bDbA20D53ac5137EB0d78DC" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.BTCb_ava]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x152b9d0FdC40C096757F570A51E494bd4b943E50" as EvmAddress, ChainType.EVM),
            decimals: 8,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.BTCb_ava,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.BTCb_ava],
          spokeAddress: convertToGenericAddress(
            "0xef7a6EBEDe2ad558DB8c36Df65365b209E5d57dC" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xbc78D84Ba0c46dFe32cf2895a19939c86b81a777" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.SolvBTC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.SolvBTC],
          spokeAddress: convertToGenericAddress(
            "0x9e4456f0d03a263653E01EdFC8C1447A8c3E1a5a" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM,
      spokeCommonAddress: convertToGenericAddress(
        "0xc7bc4A43384f84B8FC937Ab58173Edab23a4c3cD" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xFc828C500c90E63134B2B73537cC6cADfF4Ce695" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xF854AC65A40f1EabFD32E6D4C7d0E1c4B1753Cc5" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xCda75578328D0CB0e79dB7797289c44fa02a77ad" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xeB48a1eE43B91959A1686b70B7Cd482c65DE69c9" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x5C60f12838b8E3EEB525F299cD7C454c989dd04e" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [MAINNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.USDC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0xF4c542518320F09943C35Db6773b2f9FeB2F847e" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.ETH_eth]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETH_eth,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETH_eth],
          spokeAddress: convertToGenericAddress(
            "0xe3B0e4Db870aA58A24f87d895c62D3dc5CD05883" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.wBTC_eth]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as EvmAddress, ChainType.EVM),
            decimals: 8,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.wBTC_eth,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.wBTC_eth],
          spokeAddress: convertToGenericAddress(
            "0xb39c03297E87032fF69f4D42A6698e4c4A934449" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x7A56E1C57C7475CCf742a1832B028F0456652F97" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.SolvBTC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.SolvBTC],
          spokeAddress: convertToGenericAddress(
            "0xD4f7fA03A4E8063825840C083Abb42CE327a3a38" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE]: {
      folksChainId: FOLKS_CHAIN_ID.BASE,
      spokeCommonAddress: convertToGenericAddress(
        "0xc7bc4A43384f84B8FC937Ab58173Edab23a4c3cD" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xFc828C500c90E63134B2B73537cC6cADfF4Ce695" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xF854AC65A40f1EabFD32E6D4C7d0E1c4B1753Cc5" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xCda75578328D0CB0e79dB7797289c44fa02a77ad" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xeB48a1eE43B91959A1686b70B7Cd482c65DE69c9" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x5C60f12838b8E3EEB525F299cD7C454c989dd04e" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [MAINNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.USDC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0xF4c542518320F09943C35Db6773b2f9FeB2F847e" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.ETH_base]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETH_base,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETH_base],
          spokeAddress: convertToGenericAddress(
            "0xe3B0e4Db870aA58A24f87d895c62D3dc5CD05883" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.cbBTC_base]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf" as EvmAddress, ChainType.EVM),
            decimals: 8,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.cbBTC_base,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.cbBTC_base],
          spokeAddress: convertToGenericAddress(
            "0x50d5Bb3Cf57D2fB003b602A6fD10F90baa8567EA" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x3B86Ad95859b6AB773f55f8d94B4b9d443EE931f" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.SolvBTC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.SolvBTC],
          spokeAddress: convertToGenericAddress(
            "0xe0C45Ab4295E96eC1259D787E2eD22C16a3D0d8f" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BSC]: {
      folksChainId: FOLKS_CHAIN_ID.BSC,
      spokeCommonAddress: convertToGenericAddress(
        "0xc7bc4A43384f84B8FC937Ab58173Edab23a4c3cD" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xCda75578328D0CB0e79dB7797289c44fa02a77ad" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xeB48a1eE43B91959A1686b70B7Cd482c65DE69c9" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x5C60f12838b8E3EEB525F299cD7C454c989dd04e" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x802063A23E78D0f5D158feaAc605028Ee490b03b" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [MAINNET_FOLKS_TOKEN_ID.BNB]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.BNB,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.BNB],
          spokeAddress: convertToGenericAddress(
            "0x5f2F4771B7dc7e2F7E9c1308B154E1e8957ecAB0" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.ETHB_bsc]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x2170Ed0880ac9A755fd29B2688956BD959F933F8" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETHB_bsc,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETHB_bsc],
          spokeAddress: convertToGenericAddress(
            "0x4Db12F554623E4B0b3F5bAcF1c8490D4493380A5" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.BTCB_bsc]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.BTCB_bsc,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.BTCB_bsc],
          spokeAddress: convertToGenericAddress(
            "0x12Db9758c4D9902334C523b94e436258EB54156f" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x4aae823a6a0b376De6A78e74eCC5b079d38cBCf7" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.SolvBTC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.SolvBTC],
          spokeAddress: convertToGenericAddress(
            "0x7218Bd1050D41A9ECfc517abdd294FB8116aEe81" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ARBITRUM]: {
      folksChainId: FOLKS_CHAIN_ID.ARBITRUM,
      spokeCommonAddress: convertToGenericAddress(
        "0x57D77FD37670e22188d1c92D7cEc931bccf074A4" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x4Db12F554623E4B0b3F5bAcF1c8490D4493380A5" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x12Db9758c4D9902334C523b94e436258EB54156f" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x802063A23E78D0f5D158feaAc605028Ee490b03b" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x7218Bd1050D41A9ECfc517abdd294FB8116aEe81" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x0700B2cB26688C035bd5dBbdA070Be408c20779c" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [MAINNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xaf88d065e77c8cC2239327C5EDb3A432268e5831" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.USDC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0xF4c542518320F09943C35Db6773b2f9FeB2F847e" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.ETH_arb]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETH_arb,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETH_arb],
          spokeAddress: convertToGenericAddress(
            "0x37d761883a01e9F0B0d7fe59EEC8c21D94393CDD" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.ARB]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x912CE59144191C1204E64559FE8253a0e49E6548" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.ARB,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ARB],
          spokeAddress: convertToGenericAddress(
            "0x1b2a8d56967d00700DD5C94E27B1a116a1deF8Df" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [MAINNET_FOLKS_TOKEN_ID.SolvBTC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: MAINNET_FOLKS_TOKEN_ID.SolvBTC,
          poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.SolvBTC],
          spokeAddress: convertToGenericAddress(
            "0x531490B7674ef239C9FEC39d2Cf3Cc10645d14d4" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  } satisfies Record<MainnetFolksChainId, SpokeChain>,
  [NetworkType.TESTNET]: {
    [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
      folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
      spokeCommonAddress: convertToGenericAddress(
        "0xC535c93b10957Daa7b469a9D90bE62a5B804DEe0" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xD41caf2F56E9204499C95FFF9f29e364dd2D1e53" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.HUB]: convertToGenericAddress(
          "0x2e5aEA1cb7db799a0D243391f1044797156a2376" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [TESTNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.USDC,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0x52634a64fE63b123CD01137E58a3A4e783B4CC86" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.AVAX]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.AVAX,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.AVAX],
          spokeAddress: convertToGenericAddress(
            "0x272A52799b3528cc4F8454a68A469a8af40E8717" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.CCIP_BnM,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.CCIP_BnM],
          spokeAddress: convertToGenericAddress(
            "0xd22f35b7c441F09649D54d8fD53dc92DD3831f5E" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x0dE68d595853b651Da62EBaF87C55f440872dBf1" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x598613CFA602Ae18c4BF08C327E668FeBA50F413" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x73a3a6600d2410E683fC99c6e0F3241a543941eB" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0x791BC96b1F763080E1B713A5aD123C675f6a3A92" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0x810c0299ED1FB9a3e36583e0835a697766810dBa" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x2d574e5568A51352C6dF6c9e93C5409d26886223" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [TESTNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.USDC,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0x5F17bed8b33276A339e6232E231E23bC3e5348cA" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x26a276Cfd62540C0481d98EEdD98d7E1488cfCf4" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep]: {
          token: {
            type: TokenType.ERC20,
            address: convertToGenericAddress("0x779877a7b0d9e8603169ddbd7836e478b4624789" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep],
          spokeAddress: convertToGenericAddress(
            "0x39073cb6F30F0F9372c4e9059dD77eC5FB7e64AA" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.CCIP_BnM,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.CCIP_BnM],
          spokeAddress: convertToGenericAddress(
            "0xD941FC73D3ba27d5f2110bEA8E5208a4aAa036B2" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.BASE_SEPOLIA,
      spokeCommonAddress: convertToGenericAddress(
        "0x6d2AD1F2E2F8e56199c76d3B0CeD2B2588A81Aa7" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0xfdB978b547C46e0795E61f4f89Fb2c78797ddc02" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0xefa2Df8819F72EbbDf7D7E1E36a7f5d402f6638c" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
          "0xD938AcC9a7F3476c32Fc71915591e6476Ad82430" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xA9F3dfff0E8939514E7C4A0F8CeB0dBED93BbEA5" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0xC8ad4B23B4F07A27CDDAB1A8AE2Da54377f87426" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [TESTNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x036CbD53842c5426634e7929541eC2318f3dCF7e" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.USDC,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0xD81e7BA97bcDA4DCa7A34aD9805fbA63497e9618" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.ETH_base_sep]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.ETH_base_sep,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.ETH_base_sep],
          spokeAddress: convertToGenericAddress(
            "0x2df482C69b68509EfcCe97E18085d5200476393c" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x88A2d74F47a237a62e7A51cdDa67270CE381555e" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.CCIP_BnM,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.CCIP_BnM],
          spokeAddress: convertToGenericAddress(
            "0x810c0299ED1FB9a3e36583e0835a697766810dBa" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.BSC_TESTNET]: {
      folksChainId: FOLKS_CHAIN_ID.BSC_TESTNET,
      spokeCommonAddress: convertToGenericAddress(
        "0x57A4AF9Bc5384ad6754f72119854d9652811c3Db" as EvmAddress,
        ChainType.EVM,
      ),
      bridgeRouterAddress: convertToGenericAddress(
        "0x5445B31878aB2b01AecE6A7a8C417c532ABdeB2e" as EvmAddress,
        ChainType.EVM,
      ),
      adapters: {
        [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
          "0x04f620F93217734B49d4676593b9952464fF4A7b" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_DATA]: convertToGenericAddress(
          "0xE4C1cdE52ab51DD9495dbB938EA0BE332C37519A" as EvmAddress,
          ChainType.EVM,
        ),
        [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
          "0x4B466063f81E1a4aD6D730ab836D92D709F9D7a6" as EvmAddress,
          ChainType.EVM,
        ),
      },
      tokens: {
        [TESTNET_FOLKS_TOKEN_ID.BNB]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.BNB,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.BNB],
          spokeAddress: convertToGenericAddress(
            "0x70edC49ADCe5d34Db58f57CAD2dC2D8728C5C9Be" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.CCIP_BnM,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.CCIP_BnM],
          spokeAddress: convertToGenericAddress(
            "0x2fD94F6B9A56879f31c14Ef1723F1315eff81d42" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
    [FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
      folksChainId: FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA,
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
        [TESTNET_FOLKS_TOKEN_ID.USDC]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as EvmAddress, ChainType.EVM),
            decimals: 6,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.USDC,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.USDC],
          spokeAddress: convertToGenericAddress(
            "0x6789da551F420bfb607Fffb43bf8936f9dfb7d4C" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep]: {
          token: {
            type: TokenType.NATIVE,
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep],
          spokeAddress: convertToGenericAddress(
            "0xD3743aBf2D83725c06b12EC2C97c6b9dAC0D8a6F" as EvmAddress,
            ChainType.EVM,
          ),
        },
        [TESTNET_FOLKS_TOKEN_ID.CCIP_BnM]: {
          token: {
            type: TokenType.CROSS_CHAIN,
            adapters: [AdapterType.CCIP_TOKEN],
            address: convertToGenericAddress("0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D" as EvmAddress, ChainType.EVM),
            decimals: 18,
          },
          folksTokenId: TESTNET_FOLKS_TOKEN_ID.CCIP_BnM,
          poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.CCIP_BnM],
          spokeAddress: convertToGenericAddress(
            "0x5699D9efdF6F618e838E62db2C4A8d341C329EC8" as EvmAddress,
            ChainType.EVM,
          ),
        },
      },
    },
  } satisfies Record<TestnetFolksChainId, SpokeChain>,
};
