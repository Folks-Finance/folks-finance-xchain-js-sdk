import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { BYTES32_LENGTH, EVM_ADDRESS_BYTES_LENGTH } from "../../constants/common/index.js";
import { ChainType } from "../../type/common/index.js";
import type { GenericAddress } from "../../type/common/index.js";
import { getAddress, pad, sliceHex } from "viem";
import type { Address } from "viem";
import type { AddressType } from "../../type/common/address.js";

export function getRandomGenericAddress(): GenericAddress {
  return pad(privateKeyToAccount(generatePrivateKey()).address, { size: BYTES32_LENGTH });
}

export function isGenericAddress(address: GenericAddress): boolean {
  return address.length === 64 + 2 && address.startsWith("0x");
}

export function convertToGenericAddress<T extends ChainType>(
  address: AddressType<T>,
  fromChainType: ChainType
): GenericAddress {
  switch (fromChainType) {
    case ChainType.EVM:
      return pad(address as Address, { size: BYTES32_LENGTH });
    default:
      throw Error(`Unknown chain type: ${fromChainType}`);
  }
}

export function convertFromGenericAddress<T extends ChainType>(
  address: GenericAddress,
  toChainType: ChainType
): AddressType<T> {
  switch (toChainType) {
    case ChainType.EVM:
      return getAddress(sliceHex(address, BYTES32_LENGTH - EVM_ADDRESS_BYTES_LENGTH));
    default:
      throw Error(`Unknown chain type: ${toChainType}`);
  }
}
