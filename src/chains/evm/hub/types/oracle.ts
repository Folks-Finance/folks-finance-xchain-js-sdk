import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Dnum } from "dnum";

// added because ts(2589)
export type AbiPriceFeed = {
  price: bigint;
  decimals: number;
};

export type OraclePrice = Dnum;

export type OraclePrices = Partial<Record<FolksTokenId, OraclePrice>>;
