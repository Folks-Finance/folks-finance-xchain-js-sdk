import { getAddress, pad, sliceHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { exhaustiveCheck } from "../../utils/exhaustive-check.js";
import {
  BYTES32_LENGTH,
  EVM_ADDRESS_BYTES_LENGTH,
} from "../constants/bytes.js";
import { ChainType } from "../types/chain.js";

import type {
  AddressType,
  EvmAddress,
  GenericAddress,
} from "../types/address.js";
import type { AccountId } from "../types/lending.js";

export function getRandomGenericAddress(): GenericAddress {
  return pad(privateKeyToAccount(generatePrivateKey()).address, {
    size: BYTES32_LENGTH,
  }) as GenericAddress;
}

export function isGenericAddress(address: GenericAddress): boolean {
  return address.length === 64 + 2;
}

export function isAccountId(accountId: AccountId): boolean {
  return accountId.length === 64 + 2;
}

export function convertToGenericAddress<T extends ChainType>(
  address: AddressType<T>,
  fromChainType: ChainType,
): GenericAddress {
  switch (fromChainType) {
    case ChainType.EVM:
      return pad(address as EvmAddress, {
        size: BYTES32_LENGTH,
      }) as GenericAddress;
    default:
      return exhaustiveCheck(fromChainType);
  }
}

export function convertFromGenericAddress<T extends ChainType>(
  address: GenericAddress,
  toChainType: ChainType,
): AddressType<T> {
  switch (toChainType) {
    case ChainType.EVM:
      return getAddress(
        sliceHex(address, BYTES32_LENGTH - EVM_ADDRESS_BYTES_LENGTH),
      ) as EvmAddress;
    default:
      return exhaustiveCheck(toChainType);
  }
}
