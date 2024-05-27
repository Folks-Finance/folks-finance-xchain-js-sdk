import { FOLKS_CHAIN_ID } from "../../../../common/constants/chain.js";
import { TESTNET_POOLS } from "../../../../common/constants/pool.js";
import { NetworkType, ChainType } from "../../../../common/types/chain.js";
import { AdapterType } from "../../../../common/types/message.js";
import { LoanType } from "../../../../common/types/module.js";
import { FolksTokenId, TokenType } from "../../../../common/types/token.js";
import { convertToGenericAddress } from "../../../../common/utils/address.js";

import type { FolksChainId } from "../../../../common/types/chain.js";
import type { HubChain } from "../types/chain.js";
import type { HubTokenData } from "../types/token.js";

export const HUB_CHAIN: Record<NetworkType, HubChain> = {
  [NetworkType.MAINNET]: {
    folksChainId: 0 as FolksChainId,
    hubAddress: "0x",
    bridgeRouterAddress: "0x",
    adapters: {
      [AdapterType.HUB]: "0x",
      [AdapterType.WORMHOLE_DATA]: "0x",
      [AdapterType.WORMHOLE_CCTP]: "0x",
      [AdapterType.CCIP_DATA]: "0x",
      [AdapterType.CCIP_TOKEN]: "0x",
    },
    oracleManagerAddress: "0x",
    spokeManagerAddress: "0x",
    accountManagerAddress: "0x",
    loanManagerAddress: "0x",
    tokens: {} as Record<FolksTokenId, HubTokenData>,
  },
  [NetworkType.TESTNET]: {
    folksChainId: FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    hubAddress: convertToGenericAddress(
      "0xaFcA3bE824b6210918D3BeB63762D6211f1e91C3",
      ChainType.EVM,
    ),
    bridgeRouterAddress: convertToGenericAddress(
      "0x46Db2e9cD0787bF791Df2c9AE9963E296847FF1D",
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0xB01296Ea267463FDe2fcE5Fad5067B4d875A44Ba",
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0x7A6099E5cE3b66B042c9d11c3D472882bd42e23C",
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0xf7EB478F95470caF349d999047e1D4A713aD7a7f",
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0x498d72950d7cf912Be48BA5C8894e98A81E204fc",
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0x715Cd24a347552ae07e7d11Df2a59FFcEb2A9b66",
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0xc9cb1F8FcfBB804669d44349d44fB14BE4c665F0",
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0xf27720C8B9C28d8E23bAA0A64347323FBB151CeD",
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x5Ff19CF35875C973F63a60e78445F449292c5575",
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x24f0a8f4D41E8CBe18676F75e0d11b105d1cc0A6",
      ChainType.EVM,
    ),
    tokens: {
      [FolksTokenId.USDC]: {
        tokenType: TokenType.CIRCLE,
        folksTokenId: FolksTokenId.USDC,
        poolId: TESTNET_POOLS[FolksTokenId.USDC],
        poolAddress: convertToGenericAddress(
          "0xA9F3dfff0E8939514E7C4A0F8CeB0dBED93BbEA5",
          ChainType.EVM,
        ),
        tokenAddress: convertToGenericAddress(
          "0x5425890298aed601595a70ab815c96711a31bc65",
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
          "0x0922880C7e18112aB479E85Fc190Ba666c3F1020",
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
          "0x58ad9F0e5Ced36401E36594C3265FA7475f24B3d",
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
          "0x9c0D98AFAfB59F3e30F1d3B3221D59ac3A159e0b",
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
          "0xc276f7e429F46346c668E1896e527baAD4D21414",
          ChainType.EVM,
        ),
        tokenAddress: null,
        tokenDecimals: 18,
        supportedLoanTypes: new Set([LoanType.DEPOSIT, LoanType.GENERAL]),
      },
    },
  },
};
