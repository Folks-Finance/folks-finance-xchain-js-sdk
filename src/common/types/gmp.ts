import type { GenericAddress } from "./address.js";

export enum MessageDirection {
  SpokeToHub,
  HubToSpoke,
}

export type WormholeData = {
  wormholeChainId: number;
  wormholeRelayer: GenericAddress;
};

export type CCIPData = {
  ccipChainId: bigint;
  ccipRouter: GenericAddress;
};
