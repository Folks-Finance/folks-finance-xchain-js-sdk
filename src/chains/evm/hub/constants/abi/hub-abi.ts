export const HubAbi = [
  {
    inputs: [
      {
        internalType: "contract IBridgeRouter",
        name: "bridgeRouter",
        type: "address",
      },
      {
        internalType: "contract ISpokeManager",
        name: "spokeManager_",
        type: "address",
      },
      {
        internalType: "contract IAccountManager",
        name: "accountManager_",
        type: "address",
      },
      {
        internalType: "contract ILoanManager",
        name: "loanManager_",
        type: "address",
      },
      { internalType: "uint16", name: "hubChainId_", type: "uint16" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "bytes32", name: "messageId", type: "bytes32" }],
    name: "CannotReceiveMessage",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "messageId", type: "bytes32" }],
    name: "CannotReverseMessage",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "router", type: "address" }],
    name: "InvalidBridgeRouter",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "expected", type: "address" },
      { internalType: "address", name: "actual", type: "address" },
    ],
    name: "InvalidTokenFeeClaimer",
    type: "error",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "accountId", type: "bytes32" },
      { internalType: "address", name: "addr", type: "address" },
    ],
    name: "NoPermissionOnHub",
    type: "error",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "accountId", type: "bytes32" },
      { internalType: "uint16", name: "chainId", type: "uint16" },
      { internalType: "bytes32", name: "addr", type: "bytes32" },
    ],
    name: "NotRegisteredToAccount",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint16", name: "chainId", type: "uint16" },
      { internalType: "bytes32", name: "addr", type: "bytes32" },
    ],
    name: "SpokeUnknown",
    type: "error",
  },
  {
    inputs: [{ internalType: "enum Messages.Action", name: "action", type: "uint8" }],
    name: "UnsupportedDirectOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "accountManager",
    outputs: [{ internalType: "contract IAccountManager", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint8", name: "poolId", type: "uint8" },
      { internalType: "uint16", name: "chainId", type: "uint16" },
      { internalType: "uint16", name: "returnAdapterId", type: "uint16" },
      { internalType: "uint256", name: "returnGasLimit", type: "uint256" },
    ],
    name: "claimTokenFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum Messages.Action", name: "action", type: "uint8" },
      { internalType: "bytes32", name: "accountId", type: "bytes32" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "directOperation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBridgeRouter",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hubChainId",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "loanManager",
    outputs: [{ internalType: "contract ILoanManager", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "messageId", type: "bytes32" },
          { internalType: "uint16", name: "sourceChainId", type: "uint16" },
          { internalType: "bytes32", name: "sourceAddress", type: "bytes32" },
          { internalType: "bytes32", name: "handler", type: "bytes32" },
          { internalType: "bytes", name: "payload", type: "bytes" },
          { internalType: "uint16", name: "returnAdapterId", type: "uint16" },
          { internalType: "uint256", name: "returnGasLimit", type: "uint256" },
        ],
        internalType: "struct Messages.MessageReceived",
        name: "message",
        type: "tuple",
      },
    ],
    name: "receiveMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "messageId", type: "bytes32" },
          { internalType: "uint16", name: "sourceChainId", type: "uint16" },
          { internalType: "bytes32", name: "sourceAddress", type: "bytes32" },
          { internalType: "bytes32", name: "handler", type: "bytes32" },
          { internalType: "bytes", name: "payload", type: "bytes" },
          { internalType: "uint16", name: "returnAdapterId", type: "uint16" },
          { internalType: "uint256", name: "returnGasLimit", type: "uint256" },
        ],
        internalType: "struct Messages.MessageReceived",
        name: "message",
        type: "tuple",
      },
      { internalType: "bytes", name: "extraArgs", type: "bytes" },
    ],
    name: "reverseMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "spokeManager",
    outputs: [{ internalType: "contract ISpokeManager", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
