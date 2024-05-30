import type { GenericAddress } from "./address.js";

export type WormholeData = {
  wormholeChainId: number;
  wormholeRelayer: GenericAddress;
};

export type CCIPData = {
  ccipChainId: bigint;
  ccipRouter: GenericAddress;
};
