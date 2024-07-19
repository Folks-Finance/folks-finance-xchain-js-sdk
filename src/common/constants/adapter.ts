import { AdapterType } from "../types/message.js";

export const TOKEN_ADAPTERS = [AdapterType.WORMHOLE_CCTP, AdapterType.CCIP_TOKEN] as const;
export const DATA_ADAPTERS = [AdapterType.WORMHOLE_DATA, AdapterType.CCIP_DATA] as const;
export const HUB_ADAPTERS = [AdapterType.HUB] as const;
