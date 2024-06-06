import type { GenericAddress } from "./address.js";

export type WormholeData = {
  wormholeChainId: number;
  wormholeRelayer: GenericAddress;
};

export type CCIPData = {
  ccipChainId: bigint;
  ccipRouter: GenericAddress;
};

export type CCTPData = {
  USDCAddress: GenericAddress;
  cctpSourceDomain: number;
  circleTokenMessenger: GenericAddress;
  circleMessageTransmitter: GenericAddress;
};
