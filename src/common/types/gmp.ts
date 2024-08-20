import type { GenericAddress } from "./address.js";
import type { Branded } from "./brand.js";

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

export type MessageId = Branded<`0x${string}`, "MessageId">;
