import type { FolksTokenId } from "../../../../common/types/token.js";
import type { Dnum } from "dnum";

export type OraclePrice = Dnum;

export type OraclePrices = Partial<Record<FolksTokenId, OraclePrice>>;
