export const BridgeRouterSpokeAbi = [
  {
    inputs: [{ internalType: "address", name: "admin", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
  {
    inputs: [{ internalType: "uint48", name: "schedule", type: "uint48" }],
    name: "AccessControlEnforcedDefaultAdminDelay",
    type: "error",
  },
  { inputs: [], name: "AccessControlEnforcedDefaultAdminRules", type: "error" },
  {
    inputs: [{ internalType: "address", name: "defaultAdmin", type: "address" }],
    name: "AccessControlInvalidDefaultAdmin",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bytes32", name: "neededRole", type: "bytes32" },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    name: "AdapterInitialized",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    name: "AdapterNotInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IBridgeAdapter",
        name: "adapter",
        type: "address",
      },
    ],
    name: "AdapterUnknown",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint16", name: "folksChainId", type: "uint16" }],
    name: "ChainUnavailable",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint16", name: "adapterId", type: "uint16" },
      { internalType: "bytes32", name: "messageId", type: "bytes32" },
    ],
    name: "FailedMessageUnknown",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "FailedToWithdrawFunds",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "messageId", type: "bytes32" }],
    name: "MessageAlreadySeen",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "user", type: "bytes32" }],
    name: "NotEnoughFunds",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint8", name: "bits", type: "uint8" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "messager", type: "address" },
      { internalType: "address", name: "caller", type: "address" },
    ],
    name: "SenderDoesNotMatch",
    type: "error",
  },
  { inputs: [], name: "ZeroAddressAdapter", type: "error" },
  {
    anonymous: false,
    inputs: [],
    name: "DefaultAdminDelayChangeCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint48",
        name: "newDelay",
        type: "uint48",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "effectSchedule",
        type: "uint48",
      },
    ],
    name: "DefaultAdminDelayChangeScheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "DefaultAdminTransferCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "acceptSchedule",
        type: "uint48",
      },
    ],
    name: "DefaultAdminTransferScheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "adapterId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      { indexed: false, internalType: "bytes", name: "reason", type: "bytes" },
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
        indexed: false,
        internalType: "struct Messages.MessageReceived",
        name: "message",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
    ],
    name: "MessageFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "adapterId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      { indexed: false, internalType: "bytes", name: "reason", type: "bytes" },
    ],
    name: "MessageRetryFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "adapterId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
    ],
    name: "MessageRetrySucceeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "adapterId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      { indexed: false, internalType: "bytes", name: "reason", type: "bytes" },
    ],
    name: "MessageReverseFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "adapterId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
    ],
    name: "MessageReverseSucceeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "adapterId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
    ],
    name: "MessageSucceeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "userId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MANAGER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MESSAGE_SENDER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptDefaultAdminTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IBridgeAdapter",
        name: "adapter",
        type: "address",
      },
    ],
    name: "adapterToId",
    outputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "adapterId", type: "uint16" },
      {
        internalType: "contract IBridgeAdapter",
        name: "adapter",
        type: "address",
      },
    ],
    name: "addAdapter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "userId", type: "bytes32" }],
    name: "balances",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAdmin", type: "address" }],
    name: "beginDefaultAdminTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelDefaultAdminTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint48", name: "newDelay", type: "uint48" }],
    name: "changeDefaultAdminDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultAdmin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultAdminDelay",
    outputs: [{ internalType: "uint48", name: "", type: "uint48" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultAdminDelayIncreaseWait",
    outputs: [{ internalType: "uint48", name: "", type: "uint48" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "adapterId", type: "uint16" },
      { internalType: "bytes32", name: "messageId", type: "bytes32" },
    ],
    name: "failedMessages",
    outputs: [{ internalType: "bytes32", name: "messageHash", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    name: "getAdapter",
    outputs: [{ internalType: "contract IBridgeAdapter", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "uint16", name: "adapterId", type: "uint16" },
              {
                internalType: "uint16",
                name: "returnAdapterId",
                type: "uint16",
              },
              {
                internalType: "uint256",
                name: "receiverValue",
                type: "uint256",
              },
              { internalType: "uint256", name: "gasLimit", type: "uint256" },
              {
                internalType: "uint256",
                name: "returnGasLimit",
                type: "uint256",
              },
            ],
            internalType: "struct Messages.MessageParams",
            name: "params",
            type: "tuple",
          },
          { internalType: "bytes32", name: "sender", type: "bytes32" },
          {
            internalType: "uint16",
            name: "destinationChainId",
            type: "uint16",
          },
          { internalType: "bytes32", name: "handler", type: "bytes32" },
          { internalType: "bytes", name: "payload", type: "bytes" },
          { internalType: "uint64", name: "finalityLevel", type: "uint64" },
          { internalType: "bytes", name: "extraArgs", type: "bytes" },
        ],
        internalType: "struct Messages.MessageToSend",
        name: "message",
        type: "tuple",
      },
    ],
    name: "getSendFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    name: "idToAdapter",
    outputs: [
      {
        internalType: "contract IBridgeAdapter",
        name: "adapter",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "userId", type: "bytes32" }],
    name: "increaseBalance",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    name: "isAdapterInitialized",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingDefaultAdmin",
    outputs: [
      { internalType: "address", name: "newAdmin", type: "address" },
      { internalType: "uint48", name: "schedule", type: "uint48" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingDefaultAdminDelay",
    outputs: [
      { internalType: "uint48", name: "newDelay", type: "uint48" },
      { internalType: "uint48", name: "schedule", type: "uint48" },
    ],
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
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint16", name: "adapterId", type: "uint16" }],
    name: "removeAdapter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "adapterId", type: "uint16" },
      { internalType: "bytes32", name: "messageId", type: "bytes32" },
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
    name: "retryMessage",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "adapterId", type: "uint16" },
      { internalType: "bytes32", name: "messageId", type: "bytes32" },
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
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rollbackDefaultAdminDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "adapterId", type: "uint16" },
      { internalType: "bytes32", name: "messageId", type: "bytes32" },
    ],
    name: "seenMessages",
    outputs: [{ internalType: "bool", name: "hasBeenSeen", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "uint16", name: "adapterId", type: "uint16" },
              {
                internalType: "uint16",
                name: "returnAdapterId",
                type: "uint16",
              },
              {
                internalType: "uint256",
                name: "receiverValue",
                type: "uint256",
              },
              { internalType: "uint256", name: "gasLimit", type: "uint256" },
              {
                internalType: "uint256",
                name: "returnGasLimit",
                type: "uint256",
              },
            ],
            internalType: "struct Messages.MessageParams",
            name: "params",
            type: "tuple",
          },
          { internalType: "bytes32", name: "sender", type: "bytes32" },
          {
            internalType: "uint16",
            name: "destinationChainId",
            type: "uint16",
          },
          { internalType: "bytes32", name: "handler", type: "bytes32" },
          { internalType: "bytes", name: "payload", type: "bytes" },
          { internalType: "uint64", name: "finalityLevel", type: "uint64" },
          { internalType: "bytes", name: "extraArgs", type: "bytes" },
        ],
        internalType: "struct Messages.MessageToSend",
        name: "message",
        type: "tuple",
      },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
