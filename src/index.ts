// === CORE ===
export { FolksCore } from "./xchain/core/folks-core.js";

// === MODULES ===
export { FolksAccount, FolksLoan } from "./xchain/modules/index.js";

// === COMMON ===
export * from "./common/types/address.js";
export * from "./common/types/chain.js";
export * from "./common/types/core.js";
export * from "./common/types/message.js";
export * from "./common/types/module.js";
export * from "./common/types/token.js";

export * from "./common/constants/bytes.js";
export * from "./common/constants/chain.js";
export * from "./common/constants/message.js";

// === CHAINS ===

// - EVM
export { CHAIN_VIEM, CHAIN_NODE } from "./chains/evm/common/constants/chain.js";

export * from "./chains/evm/common/types/chain.js";

export { isEvmChainId } from "./chains/evm/common/utils/chain.js";
