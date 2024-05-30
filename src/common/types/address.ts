import type { Branded } from "./brand.js";
import type { ChainType } from "./chain.js";

export type GenericAddress = Branded<`0x${string}`, "GenericAddress">;
export type EvmAddress = Branded<`0x${string}`, "EvmAddress">;

type AddressTypeMap = {
  [ChainType.EVM]: EvmAddress;
};

export type AddressType<T extends ChainType> = AddressTypeMap[T];
