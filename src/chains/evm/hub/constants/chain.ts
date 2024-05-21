import type {
  FolksChainId,
  FolksTokenId,
} from "../../../../common/types/index.js";
import {
  AdapterType,
  ChainType,
  NetworkType,
} from "../../../../common/types/index.js";
import type { HubChain, HubTokenData } from "../types/index.js";
import { FOLKS_CHAIN_ID } from "../../../../common/constants/index.js";
import { convertToGenericAddress } from "../../../../common/utils/address.js";

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
      "0xb31b3411B51604fa0058AEf8fc2c1E498e3be4d4",
      ChainType.EVM,
    ),
    bridgeRouterAddress: convertToGenericAddress(
      "0x63EFE00C08f6AEAA5D469A063c44504369977e8D",
      ChainType.EVM,
    ),
    adapters: {
      [AdapterType.HUB]: convertToGenericAddress(
        "0x52521e15f9C59aff55650011FAA45De233207bB8",
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_DATA]: convertToGenericAddress(
        "0xaf10F2A98012fBA0106d7060069b0019A61137aa",
        ChainType.EVM,
      ),
      [AdapterType.WORMHOLE_CCTP]: convertToGenericAddress(
        "0x4e10f4dd1211152c901CCcF697aE82fb21920EcB",
        ChainType.EVM,
      ),
      [AdapterType.CCIP_DATA]: convertToGenericAddress(
        "0xB97A2FC865464ea740E1b4C47e676D1A91f396e2",
        ChainType.EVM,
      ),
      [AdapterType.CCIP_TOKEN]: convertToGenericAddress(
        "0xd698B6cbfEa66675586aEcad5a89ef8385C77c9e",
        ChainType.EVM,
      ),
    },
    oracleManagerAddress: convertToGenericAddress(
      "0x1E8F9D289FdE82185824948Ca19965cD489e1616",
      ChainType.EVM,
    ),
    spokeManagerAddress: convertToGenericAddress(
      "0xA63303A4a7abF395E8E5598DC5539e03AF149e5E",
      ChainType.EVM,
    ),
    accountManagerAddress: convertToGenericAddress(
      "0x369367f7A745Ac9003f5D78658F2B0323d3cc370",
      ChainType.EVM,
    ),
    loanManagerAddress: convertToGenericAddress(
      "0x21a91A04e452Ada77bFBF1fCa697F0D70B8917cA",
      ChainType.EVM,
    ),
    tokens: {} as Record<FolksTokenId, HubTokenData>,
  },
};
