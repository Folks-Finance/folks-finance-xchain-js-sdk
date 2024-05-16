# Contributing to folks-finance-xchain-js-sdk

## Table of Contents

- [Using nvm to Manage Node.js Version](#using-nvm-to-manage-nodejs-version)
- [Using pnpm Managed via Corepack](#using-pnpm-managed-via-corepack)
- [Commit Guidelines](#commit-guidelines)

### Using nvm to Manage Node.js Version

We use `nvm` (Node Version Manager) to manage the version of Node.js used in this project. The required Node.js version is specified in the `.nvmrc` file. To ensure you are using the correct version, follow these steps:

1. **Install nvm**: If you don't have `nvm` installed, you can install it by following the instructions on the [nvm GitHub repository](https://github.com/nvm-sh/nvm).

2. **Activate the Correct Node.js Version**:

   ```bash
   nvm install
   nvm use
   ```

These commands will read the .nvmrc file and set your Node.js version accordingly. For more detailed instructions and troubleshooting, refer to the [nvm documentation](https://github.com/nvm-sh/nvm).

### Using pnpm Managed via Corepack

We use `pnpm` as our package manager, which is managed via `corepack`. To get started with `pnpm`, follow these steps:

1. **Enable corepack**:

   ```bash
   corepack enable
   ```

2. **Use pnpm**: After enabling `corepack`, you will be able to use `pnpm` for managing dependencies and running scripts.

For a more complete guide on installing and using pnpm with corepack, please refer to the [pnpm documentation](https://pnpm.io/installation#using-corepack).

### Commit Guidelines

We use `commitlint` to ensure that all commit messages follow the `conventional-commit` standard. This helps us maintain a clear and consistent commit history.

The best way to make commits is by using the following command:

```bash
pnpm commit
```

This will launch an automated prompt that guides you step by step through writing a commit message according to our conventions.

For more information on the `conventional-commit` convention, please refer to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
