import type { ChainType } from "./chain.js";
import type { Address } from "viem";

type AddressTypeMap = {
  [ChainType.EVM]: Address;
};

export type AddressType<T extends ChainType> = AddressTypeMap[T];
