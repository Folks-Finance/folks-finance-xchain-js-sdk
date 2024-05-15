import { Address } from "viem";
import { ChainType } from "./chain";

type AddressTypeMap = {
  [ChainType.EVM]: Address;
};

export type AddressType<T extends ChainType> = AddressTypeMap[T];
