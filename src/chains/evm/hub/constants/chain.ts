import { FOLKS_CHAIN_ID } from "../../../../common/constants/chain.js";
import { TESTNET_POOLS } from "../../../../common/constants/pool.js";
import { NetworkType, ChainType } from "../../../../common/types/chain.js";
import { AdapterType } from "../../../../common/types/message.js";
import { LoanType } from "../../../../common/types/module.js";
import { FolksTokenId, TokenType } from "../../../../common/types/token.js";
import { convertToGenericAddress } from "../../../../common/utils/address.js";

import type {
  EvmAddress,
  GenericAddress,
} from "../../../../common/types/address.js";
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
    hubAddress: convertToGenericAddress(
      "0xeeE0613b4d4A886B3707c9a66070eecf32742052" as EvmAddress,
      ChainType.EVM,
    ),
    bridgeRouterAddress: convertToGenericAddress(
      "0x2c9aa9B8B720f067920bea5c486B3653D713fEd3" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0x4B61b6CBC7d768872a1AEEe2c4002163fd85B854" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0x775b404f4E0E765e247502296106A61D3BF88808" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0xAB0966c3FDDF5cEaa4E15C7bCdB6A7E6BB5Ee469" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0x59C38214Fc53fc496c4F17b88DB3050D2116ab9d" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0x12b152b819A83d1885C694b328Ba1bE1f553424E" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0x75f64ccdB0d30035b1682B7ee98E21EE2ACb2eDa" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0x65e4C63f63d4bae189F12648E093160Cf7a72529" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0xcDa3FE0BDD3b7175C6Bbb5352F12a13B4c98ac42" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x9e9AB3C819193dbcE2f524D2D74e90b2646fa3cc" as EvmAddress,
      ChainType.EVM,
    ),
    tokens: {
      [FolksTokenId.USDC]: {
        tokenType: TokenType.CIRCLE,
        folksTokenId: FolksTokenId.USDC,
        poolId: TESTNET_POOLS[FolksTokenId.USDC],
        poolAddress: convertToGenericAddress(
          "0x2b2077Bf1af6b0BEDcd60ada77EE1042fa21Bded" as EvmAddress,
          ChainType.EVM,
        ),
        tokenAddress: convertToGenericAddress(
          "0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress,
          ChainType.EVM,
        ),
        tokenDecimals: 6,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.AVAX]: {
        tokenType: TokenType.NATIVE,
        folksTokenId: FolksTokenId.AVAX,
        poolId: TESTNET_POOLS[FolksTokenId.AVAX],
        poolAddress: convertToGenericAddress(
          "0x905f5CdD758e538bea48B3d27Ac5Bd20E5E3D819" as EvmAddress,
          ChainType.EVM,
        ),
        tokenAddress: null,
        tokenDecimals: 18,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.ETH_eth_sep]: {
        tokenType: TokenType.NATIVE,
        folksTokenId: FolksTokenId.ETH_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
        poolAddress: convertToGenericAddress(
          "0xdE7116fD5CE4A030E185108C6a2Bfa97535ade19" as EvmAddress,
          ChainType.EVM,
        ),
        tokenAddress: null,
        tokenDecimals: 18,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.ETH_base_sep]: {
        tokenType: TokenType.NATIVE,
        folksTokenId: FolksTokenId.ETH_base_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
        poolAddress: convertToGenericAddress(
          "0xb8Bc79d0ecaA471437C162f6758E7f228911C227" as EvmAddress,
          ChainType.EVM,
        ),
        tokenAddress: null,
        tokenDecimals: 18,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
      [FolksTokenId.LINK_eth_sep]: {
        tokenType: TokenType.ERC20,
        folksTokenId: FolksTokenId.LINK_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
        poolAddress: convertToGenericAddress(
          "0x85b029a3AEd257305C362Bdb8747236d9f9fdc55" as EvmAddress,
          ChainType.EVM,
        ),
        tokenAddress: null,
        tokenDecimals: 18,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
    },
  },
};
