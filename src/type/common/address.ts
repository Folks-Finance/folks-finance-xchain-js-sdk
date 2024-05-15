import type { Address } from "viem";
import { ChainType } from "./chain.js";

type AddressTypeMap = {
  [ChainType.EVM]: Address;
};

export type AddressType<T extends ChainType> = AddressTypeMap[T];
