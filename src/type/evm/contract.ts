import type { Abi, GetContractReturnType, PublicClient } from "viem";

type OmitWrite<T> = Omit<T, "write">;
export type GetReadContractReturnType<TAbi extends Abi> = OmitWrite<
  GetContractReturnType<TAbi, PublicClient>
>;
