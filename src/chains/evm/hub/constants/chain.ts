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
      "0xaFcA3bE824b6210918D3BeB63762D6211f1e91C3" as EvmAddress,
      ChainType.EVM,
    ),
    bridgeRouterAddress: convertToGenericAddress(
      "0x46Db2e9cD0787bF791Df2c9AE9963E296847FF1D" as EvmAddress,
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0xB01296Ea267463FDe2fcE5Fad5067B4d875A44Ba" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0x7A6099E5cE3b66B042c9d11c3D472882bd42e23C" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0xf7EB478F95470caF349d999047e1D4A713aD7a7f" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0x498d72950d7cf912Be48BA5C8894e98A81E204fc" as EvmAddress,
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0x715Cd24a347552ae07e7d11Df2a59FFcEb2A9b66" as EvmAddress,
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0xc9cb1F8FcfBB804669d44349d44fB14BE4c665F0" as EvmAddress,
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0xf27720C8B9C28d8E23bAA0A64347323FBB151CeD" as EvmAddress,
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x5Ff19CF35875C973F63a60e78445F449292c5575" as EvmAddress,
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x24f0a8f4D41E8CBe18676F75e0d11b105d1cc0A6" as EvmAddress,
      ChainType.EVM,
    ),
    tokens: {
      [FolksTokenId.USDC]: {
        tokenType: TokenType.CIRCLE,
        folksTokenId: FolksTokenId.USDC,
        poolId: TESTNET_POOLS[FolksTokenId.USDC],
        poolAddress: convertToGenericAddress(
          "0xA9F3dfff0E8939514E7C4A0F8CeB0dBED93BbEA5" as EvmAddress,
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
          "0x0922880C7e18112aB479E85Fc190Ba666c3F1020" as EvmAddress,
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
          "0x58ad9F0e5Ced36401E36594C3265FA7475f24B3d" as EvmAddress,
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
          "0x9c0D98AFAfB59F3e30F1d3B3221D59ac3A159e0b" as EvmAddress,
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
          "0xc276f7e429F46346c668E1896e527baAD4D21414" as EvmAddress,
          ChainType.EVM,
        ),
        tokenAddress: null,
        tokenDecimals: 18,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
    },
  },
};
