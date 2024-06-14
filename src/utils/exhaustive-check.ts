export const exhaustiveCheck = (value: never): never => {
  throw new Error(`ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(value)}`);
};
