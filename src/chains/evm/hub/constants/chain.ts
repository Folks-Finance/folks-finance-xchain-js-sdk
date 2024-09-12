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
      [FolksTokenId.USDC]: {
        token: {
          type: TokenType.CIRCLE,
          address: convertToGenericAddress("0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress, ChainType.EVM),
          decimals: 6,
        },
        folksTokenId: FolksTokenId.USDC,
        poolId: TESTNET_POOLS[FolksTokenId.USDC],
        poolAddress: convertToGenericAddress("0xabDB5bf380C9612A963c6281aaf2B32e5700AabD" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.AVAX]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.AVAX,
        poolId: TESTNET_POOLS[FolksTokenId.AVAX],
        poolAddress: convertToGenericAddress("0x8fBC1A733C194feA513de2B84BFd44A515EB7367" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_eth_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_eth_sep],
        poolAddress: convertToGenericAddress("0x38e23bb3Bc24EC29c5cF605e332Dba50E5681cA5" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_base_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_base_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_base_sep],
        poolAddress: convertToGenericAddress("0x54Fc7d6f8e7A102b3e68F87db3A7f0402CC7CA13" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.ETH_arb_sep]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.ETH_arb_sep,
        poolId: TESTNET_POOLS[FolksTokenId.ETH_arb_sep],
        poolAddress: convertToGenericAddress("0x7Df6D239F6D5B85BBd82014C9076f0DbcaBc4b3A" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.LINK_eth_sep]: {
        token: {
          type: TokenType.ERC20,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.LINK_eth_sep,
        poolId: TESTNET_POOLS[FolksTokenId.LINK_eth_sep],
        poolAddress: convertToGenericAddress("0xCc11Ef749baB6a1FD10fEE0a2502C3aF6b38E9BC" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
      [FolksTokenId.BNB]: {
        token: {
          type: TokenType.NATIVE,
          decimals: 18,
        },
        folksTokenId: FolksTokenId.BNB,
        poolId: TESTNET_POOLS[FolksTokenId.BNB],
        poolAddress: convertToGenericAddress("0x424E02262874AD74562B08487628093b0456Ac9E" as EvmAddress, ChainType.EVM),
        supportedLoanTypes: new Set([LoanTypeId.DEPOSIT, LoanTypeId.GENERAL]),
      },
    },
  },
};
