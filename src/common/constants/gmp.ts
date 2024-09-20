import { ChainType } from "../types/chain.js";
import { convertToGenericAddress } from "../utils/address.js";

import { FOLKS_CHAIN_ID } from "./chain.js";

import type { EvmAddress } from "../types/address.js";
import type { FolksChainId } from "../types/chain.js";
import type { CCIPData, WormholeData } from "../types/gmp.js";

export const WORMHOLE_DATA: Partial<Record<FolksChainId, WormholeData>> = {
  [FOLKS_CHAIN_ID.AVALANCHE]: {
    wormholeChainId: 6,
    wormholeRelayer: convertToGenericAddress("0x27428DD2d3DD32A4D7f7C497eAaa23130d894911" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.ETHEREUM]: {
    wormholeChainId: 2,
    wormholeRelayer: convertToGenericAddress("0x27428DD2d3DD32A4D7f7C497eAaa23130d894911" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.BASE]: {
    wormholeChainId: 30,
    wormholeRelayer: convertToGenericAddress("0x706f82e9bb5b0813501714ab5974216704980e31" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    wormholeChainId: 6,
    wormholeRelayer: convertToGenericAddress("0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    wormholeChainId: 10002,
    wormholeRelayer: convertToGenericAddress("0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    wormholeChainId: 10004,
    wormholeRelayer: convertToGenericAddress("0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.BSC_TESTNET]: {
    wormholeChainId: 4,
    wormholeRelayer: convertToGenericAddress("0x80aC94316391752A193C1c47E27D382b507c93F3" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
    wormholeChainId: 10003,
    wormholeRelayer: convertToGenericAddress("0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470" as EvmAddress, ChainType.EVM),
  },
};

export const CCIP_DATA: Partial<Record<FolksChainId, CCIPData>> = {
  [FOLKS_CHAIN_ID.AVALANCHE]: {
    ccipChainId: BigInt("6433500567565415381"),
    ccipRouter: convertToGenericAddress("0xF4c7E640EdA248ef95972845a62bdC74237805dB" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.ETHEREUM]: {
    ccipChainId: BigInt("5009297550715157269"),
    ccipRouter: convertToGenericAddress("0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.BASE]: {
    ccipChainId: BigInt("15971525489660198786"),
    ccipRouter: convertToGenericAddress("0x881e3A65B4d4a04dD529061dd0071cf975F58bCD" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    ccipChainId: BigInt("14767482510784806043"),
    ccipRouter: convertToGenericAddress("0xF694E193200268f9a4868e4Aa017A0118C9a8177" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    ccipChainId: BigInt("16015286601757825753"),
    ccipRouter: convertToGenericAddress("0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    ccipChainId: BigInt("10344971235874465080"),
    ccipRouter: convertToGenericAddress("0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.BSC_TESTNET]: {
    ccipChainId: BigInt("13264668187771770619"),
    ccipRouter: convertToGenericAddress("0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f" as EvmAddress, ChainType.EVM),
  },
  [FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
    ccipChainId: BigInt("3478487238524512106"),
    ccipRouter: convertToGenericAddress("0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165" as EvmAddress, ChainType.EVM),
  },
};
