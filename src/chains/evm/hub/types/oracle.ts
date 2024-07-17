import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Dnum } from "dnum";

export type OraclePrice = {
  price: Dnum;
  decimals: number;
};

export type OraclePrices = Partial<Record<FolksTokenId, OraclePrice>>;
