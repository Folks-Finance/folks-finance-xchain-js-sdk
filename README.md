# @folks-finance/xchain-sdk

[![License: MIT][license-image]][license-url]
[![CI][ci-image]][ci-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

![xChain Header](https://github.com/Folks-Finance/xchain-js-sdk/raw/main/media/repo-header.png)

The official JavaScript SDK for the Folks Finance Cross-Chain Lending Protocol.

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
    - [Package manager](#package-manager)
  - [SDK Structure and Usage](#sdk-structure-and-usage)
    - [FolksCore](#folkscore)
    - [Modules](#modules)
  - [Basic Usage](#basic-usage)
  - [React Usage](#react-usage)
    - [Initializing FolksCore](#initializing-folkscore)
    - [Synchronizing FolksCore Signer](#synchronizing-folkscore-signer)

## Getting Started

Before diving into the SDK, we recommend familiarizing yourself with the Folks Finance Cross-Chain Lending Protocol:

- Explore our [comprehensive documentation](https://docs.xapp.folks.finance/?utm_source=github&utm_medium=sdk-readme&utm_campaign=xchain-sdk) for in-depth information about the protocol and its features.
- Access additional resources and materials in our [Google Drive folder](https://drive.google.com/drive/folders/1P-C_V28JlIJNmoUH6pUKVgVpIfZYQYn5?usp=drive_link).

### Installation

#### Package manager

Using npm:

```bash
npm install @folks-finance/xchain-sdk
```

Using yarn:

```bash
yarn add @folks-finance/xchain-sdk
```

Using pnpm:

```bash
pnpm add @folks-finance/xchain-sdk
```

Using bun:

```bash
bun add @folks-finance/xchain-sdk
```

### SDK Structure and Usage

The Folks Finance Cross-Chain Lending SDK consists of two main components:

1. `FolksCore`: This acts as the central context for the SDK, managing configuration and state that is shared across all modules.
2. Various modules: Located in `/src/xchain/modules`, these provide specific functionalities for interacting with different aspects of the Folks Finance protocol.

#### FolksCore

`FolksCore` is responsible for initializing the SDK and maintaining the global context. It handles:

- Network selection (testnet/mainnet)
- Provider management
- Signer management

Any changes made to `FolksCore` will affect subsequent calls to the various modules. For example, changing the network or signer will impact how the modules interact with the blockchain.

#### Modules

The SDK includes several modules, each focusing on a specific area of functionality:

- `FolksAccount`: Manages account-related operations, including creating accounts, retrieving account information, and performing management operations such as inviting addresses, accepting invites, and unregistering addresses.
- `FolksLoan`: Handles all loan-related functions, including retrieving loan information, creating loans, and performing operations such as depositing, withdrawing, repaying, and more.
- `FolksOracle`: Provides access to updated price information from the oracle.
- `FolksPool`: Allows retrieval of informations about the pools.
- `FolksRewards`: Offers access to information about the rewards system.
- `FolksGmp`: Manages retry and revert functions for failed operations.

These modules use the context provided by `FolksCore` internally, so they always operate based on the current state of `FolksCore`.

### Basic Usage

To start using the Folks Finance Cross-Chain Lending SDK:

1. Import and initialize `FolksCore`:

```ts
import { FolksCore, NetworkType } from "@folks-finance/xchain-sdk";

const folksConfig = {
  network: NetworkType.TESTNET, // or NetworkType.MAINNET
  provider: {
    evm: {
      // Add your EVM provider configuration here (optional)
      // If not provided, default providers will be used
    },
  },
};

FolksCore.init(folksConfig);
```

Note: The `provider` configuration in `folksConfig` is optional. If not provided, the SDK will use default providers defined in `src/chains/evm/common/utils/provider.ts`.

2. Use the desired modules to interact with the protocol:

```ts
import {
  Action,
  BYTES4_LENGTH,
  FolksAccount,
  FolksCore,
  getRandomBytes,
  getSupportedMessageAdapters,
  MessageAdapterParamsType,
  NetworkType,
} from "@folks-finance/xchain-sdk";
import { createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import type { FolksChainId, Nonce } from "@folks-finance/xchain-sdk";

const generateRandomNonce = () => {
  return getRandomBytes(BYTES4_LENGTH) as Nonce;
};

const MNEMONIC = "your mnemonic here";
const account = mnemonicToAccount(MNEMONIC);

// In a real environment you should already have a signer
const signer = createWalletClient({
  account,
  transport: http(),
});

// Example: Creating an account
const createAccount = async (sourceFolksChainId: FolksChainId) => {
  const nonce = generateRandomNonce();
  const {
    adapterIds: [adapterId],
    returnAdapterIds: [returnAdapterId],
  } = getSupportedMessageAdapters({
    action: Action.CreateAccount,
    network: NetworkType.TESTNET,
    messageAdapterParamType: MessageAdapterParamsType.Data,
    sourceFolksChainId,
  });
  const adapters = { adapterId, returnAdapterId };

  // You must set the correct signer before calling a write method that involves signing a transaction
  FolksCore.setFolksSigner({
    signer,
    folksChainId,
  });

  const prepareCall = await FolksAccount.prepare.createAccount(nonce, adapters);
  const hash = await FolksAccount.write.createAccount(nonce, prepareCall);

  console.log("Create account hash:", hash);
};
```

Remember that any changes made to `FolksCore` (like changing the network or signer) will affect all subsequent module calls. This design allows for flexible and context-aware interactions with the Folks Finance protocol across different chains and environments.

### React Usage

When using the SDK with React, there are a few additional considerations to ensure proper initialization and synchronization. Here's how to set up and use the SDK in a React environment:

#### Initializing FolksCore

To initialize FolksCore only once in your React application, you can create a custom hook:

```ts
import { useEffect } from "react";
import { FolksCore, NetworkType } from "@folks-finance/xchain-sdk";

import type { FolksCoreConfig } from "@folks-finance/xchain-sdk";

export const useInitFolksCore = () => {
  useEffect(() => {
    if (FolksCore.isInitialized()) return;

    const folksCoreConfig: FolksCoreConfig = {
      network: NetworkType.TESTNET,
      provider,
    };

    FolksCore.init(folksCoreConfig);
  }, []);
};
```

Use this hook in a component that's common to all pages, such as the root layout in Next.js.

#### Synchronizing FolksCore Signer

To ensure that the correct signer is used for transactions, you need to synchronize the FolksCore signer whenever the chain (and consequently the associated signer) changes on the frontend:

```ts
import { FOLKS_CHAIN, NetworkType, ChainType } from "@folks-finance/xchain-sdk";
import { useWalletClient } from "wagmi";
import { useMemo, useEffect } from "react";

import type { FolksChainId } from "@folks-finance/xchain-sdk";

function assertExhaustive(value: never, message = "Reached unexpected case in exhaustive switch"): never {
  throw new Error(message);
}

const AVAILABLE_FOLKS_CHAINS = FOLKS_CHAIN[NetworkType.TESTNET];
const getFolksChainFromFolksChainId = (folksChainId: FolksChainId) => AVAILABLE_FOLKS_CHAINS[folksChainId];

const useEvmSigner = ({ chainId }: { chainId?: number }) => {
  const { data: walletClient } = useWalletClient({ chainId });
  const signer = useMemo(() => walletClient, [walletClient]);
  return { signer };
};

export const useSyncFolksCoreSigner = () => {
  // useFolksChain is a hook that returns the current selected FolksChainId on frontend
  const { selectedFolksChainId } = useFolksChain();

  const selectedFolksChain = selectedFolksChainId ? getFolksChainFromFolksChainId(selectedFolksChainId) : null;

  const { signer: evmSigner } = useEvmSigner(
    selectedFolksChain?.chainType === ChainType.EVM ? { chainId: selectedFolksChain.chainId as number } : {},
  );

  useEffect(() => {
    if (!selectedFolksChain) return;

    const folksChainId = selectedFolksChain.folksChainId;

    switch (selectedFolksChain.chainType) {
      case ChainType.EVM: {
        if (!evmSigner) return;
        FolksCore.setFolksSigner({
          signer: evmSigner,
          folksChainId,
        });
        break;
      }
      default:
        assertExhaustive(selectedFolksChain.chainType);
    }
  }, [selectedFolksChain, evmSigner]);
};
```

Like the initialization hook, `useSyncFolksCoreSigner` should be called in a component shared by all pages.

[license-image]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[ci-image]: https://img.shields.io/github/actions/workflow/status/Folks-Finance/xchain-js-sdk/lint-and-typecheck.yml?branch=main&logo=github&style=flat-square
[ci-url]: https://github.com/Folks-Finance/xchain-js-sdk/actions/workflows/lint-and-typecheck.yml
[npm-image]: https://img.shields.io/npm/v/@folks-finance/xchain-sdk.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@folks-finance/xchain-sdk
[downloads-image]: https://img.shields.io/npm/dm/@folks-finance/xchain-sdk.svg?style=flat-square
