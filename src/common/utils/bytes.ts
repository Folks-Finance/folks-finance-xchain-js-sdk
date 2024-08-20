import { bytesToHex, pad, toHex } from "viem";

import type { Hex } from "viem";

export function getEmptyBytes(length: number): string {
  return pad("0x", { size: length });
}

export function convertNumberToBytes(num: number | bigint, length: number): Hex {
  // insert 0s at the beginning if data is smaller than length bytes
  const buf = Buffer.alloc(length, 0);

  // convert num to bytes
  const hex = num.toString(16);
  const isEven = hex.length % 2 === 0;
  const bytes = Buffer.from(isEven ? hex : "0" + hex, "hex");

  // write bytes to fixed length buf
  bytes.copy(buf, buf.length - bytes.length);
  return toHex(buf);
}

export function convertStringToBytes(str: string): Hex {
  return toHex("0x" + Buffer.from(str).toString("hex"));
}

export function convertBooleanToByte(bool: boolean): Hex {
  return bool ? "0x01" : "0x00";
}

export function getRandomBytes(length: number): Hex {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(length)));
}
