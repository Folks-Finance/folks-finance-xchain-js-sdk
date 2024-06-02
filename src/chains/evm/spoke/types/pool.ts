export type TokenRateLimit = {
  periodLength: bigint;
  periodOffset: bigint;
  periodLimit: bigint;
  currentCapacity: bigint;
  nextPeriodReset: bigint;
};
