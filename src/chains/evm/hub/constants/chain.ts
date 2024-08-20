import { FOLKS_CHAIN_ID } from "../../../../common/constants/chain.js";
import { TESTNET_POOLS } from "../../../../common/constants/pool.js";
import { NetworkType, ChainType } from "../../../../common/types/chain.js";
import { AdapterType } from "../../../../common/types/message.js";
import { LoanTypeId } from "../../../../common/types/module.js";
import { FolksTokenId, TokenType } from "../../../../common/types/token.js";
import { convertToGenericAddress } from "../../../../common/utils/address.js";

import type { EvmAddress, GenericAddress } from "../../../../common/types/address.js";
import type { FolksChainId } from "../../../../common/types/chain.js";
import type { HubChain } from "../types/chain.js";

export const HUB_CHAIN: Record<NetworkType, HubChain> = {
  [NetworkType.MAINNET]: {
    folksChainId: 0 as FolksChainId,
    hubAddress: "0x" as GenericAddress,
    bridgeRouterAddress: "0x" as GenericAddress,
    adapters: {
      [AdapterType.HUB]: "0x" as GenericAddress,
      [AdapterType.WORMHOLE_DATA]: "0x" as GenericAddress,
      [AdapterType.WORMHOLE_CCTP]: "0x" as GenericAddress,
      [AdapterType.CCIP_DATA]: "0x" as GenericAddress,
      [AdapterType.CCIP_TOKEN]: "0x" as GenericAddress,
    },
    oracleManagerAddress: "0x" as GenericAddress,
    spokeManagerAddress: "0x" as GenericAddress,
    accountManagerAddress: "0x" as GenericAddress,
    loanManagerAddress: "0x" as GenericAddress,
    tokens: {},
  },
  [NetworkType.TESTNET]: {
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    hubAddress: convertToGenericAddress("0x29DD713Bf90c900Fed8e67FE084B089999C6f1e5" as EvmAddress, ChainType.EVM),
    bridgeRouterAddress: convertToGenericAddress(
      "0xB73A99AaA5Bd03dFC4463002Be021A43950A42B3" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0x17B77e02E1D72Cd17D86c1a31D7F9EC78563c88A" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0x17B77e02E1D72Cd17D86c1a31D7F9EC78563c88A" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0xa2eFF6fb83a773C87f0cB0aD35ddD7B93a344dEe" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0x119AE74220BdF3cA564DF435C3ba0647395905fC" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0xEE923A9FF576a95f0bD987213BfE187af4C39015" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0x4E2CF9E350A958957fd620012cf4134B81962939" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0x7648dCf3d1b98B93D728420Fa2C41E7Cd40232E3" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x179E3d9F9a50f79687140f31f859A100C8C8C940" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x876A16D47Bfc3ff26Ca0ECCdf9aF9797b1DbC8a3" as EvmAddress,
      ChainType.EVM,
    ),
    tokens: {
      [FolksTokenId.USDC]: {
        token: {
          type: TokenType.CIRCLE,
          address: convertToGenericAddress("0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress, ChainType.EVM),
          decimals: 6,
        },
        folksTokenId: FolksTokenId.USDC,
        poolId: TESTNET_POOLS[FolksTokenId.USDC],
        poolAddress: convertToGenericAddress("0xb32f4A124C2C088f0f1f1c1dD5F3086108107235" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.AVAX]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.AVAX,
        poolId: TESTNET_POOLS[FolksTokenId.AVAX],
        poolAddress: convertToGenericAddress("0xA1Fe9e8e35bCdDC239836321aB1E0FeaD8B37189" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_eth_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
        poolAddress: convertToGenericAddress("0x67501e2840A058064d53915Ebd5AA58802F1Fdff" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_base_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_base_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
        poolAddress: convertToGenericAddress("0x64a2F8Ce8E727e32CEE33316403C7532e886Bd74" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_arb_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_arb_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_arb_sep],
        poolAddress: convertToGenericAddress("0x4B8f3059bA85602142eD225765dEAB2cb8AdDe52" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.LINK_eth_sep]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.LINK_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
        poolAddress: convertToGenericAddress("0x42Bda0b7ED2AA3A9FFFc7a07d8F0ca17752dD3f1" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.BNB]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.BNB,
        poolId: TESTNET_POOLS[FolksTokenId.BNB],
        poolAddress: convertToGenericAddress("0x470d5944955A32Ae3124F2B87f1DBe866abe1Bf5" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
    },
  },
};
