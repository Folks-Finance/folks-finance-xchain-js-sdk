import type { Branded } from "./brand.js";

export type AccountId = Branded<`0x${string}`, "AccountId">;
export type LoanId = Branded<`0x${string}`, "LoanId">;
