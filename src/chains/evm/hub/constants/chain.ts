import { FOLKS_CHAIN_ID } from "../../../../common/constants/chain.js";
import { TESTNET_POOLS } from "../../../../common/constants/pool.js";
import { NetworkType, ChainType } from "../../../../common/types/chain.js";
import { AdapterType } from "../../../../common/types/message.js";
import { LoanType } from "../../../../common/types/module.js";
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
    hubAddress: convertToGenericAddress("0xBB7440610820B39c60d2e7052B021137D70a3b90" as EvmAddress, ChainType.EVM),
    bridgeRouterAddress: convertToGenericAddress(
      "0x34525Df273Ce95B0bC7D51053120564F2FaAf3f3" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0x42C1c583611fc95a47755cb8bcF19350F5dD4d98" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0xBf020Ff1f56D747503Ac013b8371A02Bbc158181" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0x07E211Ae41f4b93BD12D7fD53E9C5c4136840fC7" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0x57A850597ba322d97Df1697E922EC5f41d2c39c0" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0xA129734a79589fFcc5501f4d74Df2181c8D23c70" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0x4abEf544302E765409e4772883c40BF30D01A856" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0xc4a7616B64c9cE2967f88416410CBA4A1B8fc421" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x3F60F8a34ca151Bc8680f362582A387CB24e3a28" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x56d55226ee6aA529831F4dd4731e988077e23774" as EvmAddress,
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
        poolAddress: convertToGenericAddress("0x8EEa1C4354544410A52d0bA7f83C7D6DE05F1f34" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.AVAX]: {
        token: {
          type: TokenType.NATIVE,
          address: null,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.AVAX,
        poolId: TESTNET_POOLS[FolksTokenId.AVAX],
        poolAddress: convertToGenericAddress("0xace07d39b27e83676B5400c88ED134687bCe3689" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.ETH_eth_sep]: {
        token: {
          type: TokenType.NATIVE,
          address: null,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
        poolAddress: convertToGenericAddress("0xbA678D555AbC80CcA6BBeAdD8CCC89a6795D28CD" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.ETH_base_sep]: {
        token: {
          address: null,
          decimals: 18,
          type: TokenType.NATIVE,
        },
        folksTokenId: FolksTokenId.ETH_base_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
        poolAddress: convertToGenericAddress("0x3b764CD5AD1E23D3dDc531717cE49A2D165A763c" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.LINK_eth_sep]: {
        token: {
          type: TokenType.ERC20,
          address: convertToGenericAddress("0x779877a7b0d9e8603169ddbd7836e478b4624789" as EvmAddress, ChainType.EVM),
          decimals: 18,
        },
        folksTokenId: FolksTokenId.LINK_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
        poolAddress: convertToGenericAddress("0x22237f48b3aBc84bd05e6619A513dA9bCC0Cd387" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
    },
  },
};
