import { ChainType } from "../types/chain.js";
import { convertToGenericAddress } from "../utils/address.js";

import { FOLKS_CHAIN_ID } from "./chain.js";

import type { EvmAddress } from "../types/address.js";
import type { FolksChainId } from "../types/chain.js";
import type { CCIPData, CCTPData, WormholeData } from "../types/gmp.js";

export const WORMHOLE_DATA: Partial<Record<FolksChainId, WormholeData>> = {
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    wormholeChainId: 6,
    wormholeRelayer: convertToGenericAddress(
      "0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB" as EvmAddress,
      ChainType.EVM,
    ),
  },
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    wormholeChainId: 10002,
    wormholeRelayer: convertToGenericAddress(
      "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470" as EvmAddress,
      ChainType.EVM,
    ),
  },
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    wormholeChainId: 10004,
    wormholeRelayer: convertToGenericAddress(
      "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE" as EvmAddress,
      ChainType.EVM,
    ),
  },
};

export const CCIP_DATA: Partial<Record<FolksChainId, CCIPData>> = {
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    ccipChainId: BigInt("14767482510784806043"),
    ccipRouter: convertToGenericAddress(
      "0xF694E193200268f9a4868e4Aa017A0118C9a8177" as EvmAddress,
      ChainType.EVM,
    ),
  },
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    ccipChainId: BigInt("16015286601757825753"),
    ccipRouter: convertToGenericAddress(
      "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59" as EvmAddress,
      ChainType.EVM,
    ),
  },
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    ccipChainId: BigInt("10344971235874465080"),
    ccipRouter: convertToGenericAddress(
      "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93" as EvmAddress,
      ChainType.EVM,
    ),
  },
};

export const CCTP_DATA: Partial<Record<FolksChainId, CCTPData>> = {
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    USDCAddress: convertToGenericAddress(
      "0x5425890298aed601595a70ab815c96711a31bc65" as EvmAddress,
      ChainType.EVM,
    ),
    cctpSourceDomain: 1,
    circleTokenMessenger: convertToGenericAddress(
      "0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0" as EvmAddress,
      ChainType.EVM,
    ),
    circleMessageTransmitter: convertToGenericAddress(
      "0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79" as EvmAddress,
      ChainType.EVM,
    ),
  },
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    USDCAddress: convertToGenericAddress(
      "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as EvmAddress,
      ChainType.EVM,
    ),
    cctpSourceDomain: 0,
    circleTokenMessenger: convertToGenericAddress(
      "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5" as EvmAddress,
      ChainType.EVM,
    ),
    circleMessageTransmitter: convertToGenericAddress(
      "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD" as EvmAddress,
      ChainType.EVM,
    ),
  },
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    USDCAddress: convertToGenericAddress(
      "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as EvmAddress,
      ChainType.EVM,
    ),
    cctpSourceDomain: 6,
    circleTokenMessenger: convertToGenericAddress(
      "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5" as EvmAddress,
      ChainType.EVM,
    ),
    circleMessageTransmitter: convertToGenericAddress(
      "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD" as EvmAddress,
      ChainType.EVM,
    ),
  },
};
