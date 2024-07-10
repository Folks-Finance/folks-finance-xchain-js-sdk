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
    hubAddress: convertToGenericAddress("0xaE4C62510F4d930a5C8796dbfB8C4Bc7b9B62140" as EvmAddress, ChainType.EVM),
    bridgeRouterAddress: convertToGenericAddress(
      "0xa9491a1f4f058832e5742b76eE3f1F1fD7bb6837" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0xf472ab58969709De9FfEFaeFFd24F9e90cf8DbF9" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0x8F27355662D6de024FEE83b176dD8DB1F2CA1585" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0x8a81dbF6D6b6A8693181de7ad6Ff7F4c47a5B8bd" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0xE7F80b606614989209f2c36F6074bAfDe1565A19" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0x006A9A176662920306074bB00B57f5CA836e4200" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0x46c425F4Ec43b25B6222bcc05De051e6D3845165" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0xA5b9525a0A46d4D4bf6f588f565f0d15AffDB81d" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x3324B5BF2b5C85999C6DAf2f77b5a29aB74197cc" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x2cAa1315bd676FbecABFC3195000c642f503f1C9" as EvmAddress,
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
        poolAddress: convertToGenericAddress("0x1968237f3a7D256D08BcAb212D7ae28fEda72c34" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.AVAX]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.AVAX,
        poolId: TESTNET_POOLS[FolksTokenId.AVAX],
        poolAddress: convertToGenericAddress("0xd90B7614551E799Cdef87463143eCe2efd4054f9" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_eth_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
        poolAddress: convertToGenericAddress("0xecD328082035146d99fd621E809Bc9642cDd0BAd" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_base_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_base_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
        poolAddress: convertToGenericAddress("0x9E7dfcDFA94C007e868917ec3088107De0B8Dff8" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.LINK_eth_sep]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.LINK_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
        poolAddress: convertToGenericAddress("0xf66A38192A953fe22dCA4229d9429219aaeB09d8" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
    },
  },
};
