import { FOLKS_CHAIN_ID } from "../../../../common/constants/chain.js";
import { MAINNET_POOLS, TESTNET_POOLS } from "../../../../common/constants/pool.js";
import { NetworkType, ChainType } from "../../../../common/types/chain.js";
import { AdapterType } from "../../../../common/types/message.js";
import { LoanTypeId } from "../../../../common/types/module.js";
import { MAINNET_FOLKS_TOKEN_ID, TESTNET_FOLKS_TOKEN_ID, TokenType } from "../../../../common/types/token.js";
import { convertToGenericAddress } from "../../../../common/utils/address.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { MainnetFolksTokenId, TestnetFolksTokenId } from "../../../../common/types/token.js";
import type { HubChain } from "../types/chain.js";
import type { HubTokenData } from "../types/token.js";

export const HUB_CHAIN: Record<NetworkType, HubChain> = {
  [NetworkType.MAINNET]: {
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE,
    hubAddress: convertToGenericAddress("0xb39c03297E87032fF69f4D42A6698e4c4A934449" as EvmAddress, ChainType.EVM),
    bridgeRouterAddress: convertToGenericAddress(
      "0xFc828C500c90E63134B2B73537cC6cADfF4Ce695" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0xCda75578328D0CB0e79dB7797289c44fa02a77ad" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0xeB48a1eE43B91959A1686b70B7Cd482c65DE69c9" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0x5C60f12838b8E3EEB525F299cD7C454c989dd04e" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0xc7bc4A43384f84B8FC937Ab58173Edab23a4c3cD" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0x5f2F4771B7dc7e2F7E9c1308B154E1e8957ecAB0" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0x7218Bd1050D41A9ECfc517abdd294FB8116aEe81" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0x4Db12F554623E4B0b3F5bAcF1c8490D4493380A5" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x12Db9758c4D9902334C523b94e436258EB54156f" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0xF4c542518320F09943C35Db6773b2f9FeB2F847e" as EvmAddress,
      ChainType.EVM,
    ),
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
        poolAddress: convertToGenericAddress("0x88f15e36308ED060d8543DA8E2a5dA0810Efded2" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.AVAX]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.AVAX,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.AVAX],
        poolAddress: convertToGenericAddress("0x0259617bE41aDA4D97deD60dAf848Caa6db3F228" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.sAVAX]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.sAVAX,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.sAVAX],
        poolAddress: convertToGenericAddress("0x7033105d1a527d342bE618ab1F222BB310C8d70b" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.ETH_eth]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETH_eth,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETH_eth],
        poolAddress: convertToGenericAddress("0xB6DF8914C084242A19A4C7fb15368be244Da3c75" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.ETH_base]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETH_base,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETH_base],
        poolAddress: convertToGenericAddress("0x51958ed7B96F57142CE63BB223bbd9ce23DA7125" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.wETH_ava]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.wETH_ava,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.wETH_ava],
        poolAddress: convertToGenericAddress("0x795CcF6f7601edb41E4b3123c778C56F0F19389A" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.wBTC_eth]: {
        token: {
          type: TokenType.ERC20,
          decimals: 8,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.wBTC_eth,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.wBTC_eth],
        poolAddress: convertToGenericAddress("0x9936812835476504D6Cf495F4F0C718Ec19B3Aff" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.BTCb_ava]: {
        token: {
          type: TokenType.ERC20,
          decimals: 8,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.BTCb_ava,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.BTCb_ava],
        poolAddress: convertToGenericAddress("0x1C51AA1516e1156d98075F2F64e259906051ABa9" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.cbBTC_base]: {
        token: {
          type: TokenType.ERC20,
          decimals: 8,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.cbBTC_base,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.cbBTC_base],
        poolAddress: convertToGenericAddress("0x9eD81F0b5b0E9b6dE00F374fFc7f270902576EF7" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.BNB]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.BNB,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.BNB],
        poolAddress: convertToGenericAddress("0x89970d3662614a5A4C9857Fcc9D9C3FA03824fe3" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.ETHB_bsc]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETHB_bsc,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETHB_bsc],
        poolAddress: convertToGenericAddress("0x18031B374a571F9e060de41De58Abb5957cD5258" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.BTCB_bsc]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.BTCB_bsc,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.BTCB_bsc],
        poolAddress: convertToGenericAddress("0xC2FD40D9Ec4Ae7e71068652209EB75258809e131" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.ETH_arb]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.ETH_arb,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ETH_arb],
        poolAddress: convertToGenericAddress("0x44E0d0809AF8Ee37BFb1A4e75D5EF5B96F6346A3" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [MAINNET_FOLKS_TOKEN_ID.ARB]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: MAINNET_FOLKS_TOKEN_ID.ARB,
        poolId: MAINNET_POOLS[MAINNET_FOLKS_TOKEN_ID.ARB],
        poolAddress: convertToGenericAddress("0x1177A3c2CccDb9c50D52Fc2D30a13b2c3C40BCF4" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
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
        poolAddress: convertToGenericAddress("0x307bCEC89624660Ed06C97033EDb7eF49Ab0EB2D" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
    } satisfies Record<MainnetFolksTokenId, HubTokenData>,
  },
  [NetworkType.TESTNET]: {
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    hubAddress: convertToGenericAddress("0x9aA6B9A5D131b93fa1e6dFf86Dc59e6975584055" as EvmAddress, ChainType.EVM),
    bridgeRouterAddress: convertToGenericAddress(
      "0x61ad61b445897688e75f80F37867bb8C23021F34" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0x2e5aEA1cb7db799a0D243391f1044797156a2376" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0x52F5ff24c7269b5a1f341f3c4aE651F97C9e8181" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0xC2B21a8D716b7Bd4338FEaF3A207c40B9D7073Fe" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0xEc5d2d396345581136B819beEb96a225f63FF213" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0xf897C0f5b502EA259b2b3418eAFF0AfA32f80CFF" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0xba18A8d45bF2f7032aB0758839eac914D345c99e" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0xCde067f269319BA603cc39dafA3226A5236f2196" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x9a77703Eb84BA28864D650695eF7Be54eDB416F0" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x65cEC46Ed082e41ECFcCDfD8ac9222C1e0f4cd2a" as EvmAddress,
      ChainType.EVM,
    ),
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
        poolAddress: convertToGenericAddress("0xabDB5bf380C9612A963c6281aaf2B32e5700AabD" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [TESTNET_FOLKS_TOKEN_ID.AVAX]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: TESTNET_FOLKS_TOKEN_ID.AVAX,
        poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.AVAX],
        poolAddress: convertToGenericAddress("0x8fBC1A733C194feA513de2B84BFd44A515EB7367" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep,
        poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.ETH_eth_sep],
        poolAddress: convertToGenericAddress("0x38e23bb3Bc24EC29c5cF605e332Dba50E5681cA5" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [TESTNET_FOLKS_TOKEN_ID.ETH_base_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: TESTNET_FOLKS_TOKEN_ID.ETH_base_sep,
        poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.ETH_base_sep],
        poolAddress: convertToGenericAddress("0x54Fc7d6f8e7A102b3e68F87db3A7f0402CC7CA13" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep,
        poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.ETH_arb_sep],
        poolAddress: convertToGenericAddress("0x7Df6D239F6D5B85BBd82014C9076f0DbcaBc4b3A" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep,
        poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.LINK_eth_sep],
        poolAddress: convertToGenericAddress("0xCc11Ef749baB6a1FD10fEE0a2502C3aF6b38E9BC" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [TESTNET_FOLKS_TOKEN_ID.BNB]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: TESTNET_FOLKS_TOKEN_ID.BNB,
        poolId: TESTNET_POOLS[TESTNET_FOLKS_TOKEN_ID.BNB],
        poolAddress: convertToGenericAddress("0x424E02262874AD74562B08487628093b0456Ac9E" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
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
        poolAddress: convertToGenericAddress("0x99A15c2529ba1020814E9601F3CcAcC413747935" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
    } satisfies Record<TestnetFolksTokenId, HubTokenData>,
  },
};
