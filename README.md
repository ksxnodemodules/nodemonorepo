# Khải's Node.js monorepo

This repo hold many of my nodejs packages in one place for ease of management.

## CI Build Status

[![Build Status](https://travis-ci.org/ksxnodemodules/nodemonorepo.svg?branch=master)](https://travis-ci.org/ksxnodemodules/nodemonorepo)

## Package requirements

* Node.js ≥ 8.9.0

## Development

### Development requirements

* Satisfies [package requirements](#package-requirements)
* UNIX-like environment (Linux, macOS, FreeBSD, etc.)
* Package manager that supports monorepo: [pnpm](https://pnpm.js.org/), [yarn](https://yarnpkg.com/)

### Install dependencies

#### Using pnpm

```sh
pnpm recursive link --shamefully-flatten
```

#### Using yarn

```sh
yarn # or yarn install
```

### Some important scripts

Most scripts are available in [`package.json`](./package.json)'s `scripts` object but some are only available through `pnpx`/`yarn exec`.

In the following section, `pnpm run`/`yarn run` is alternative to `npm run`, `pnpx`/`yarn exec` is alternative to `npx`.

#### Test

**Normal tests:**

```sh
pnpm test
```

**Update jest snapshots:**

```sh
pnpm test -- -u
```

**Run TypeScript check:**

```sh
pnpm run type-check
```

#### Clean TypeScript build

```sh
pnpm run clean-typescript-build
```

#### Generate `.npmignore`

```sh
pnpm run generate-npmignore
```

#### Mismatched local packages' version

**Check for mismatched local packages' version:**

```sh
pnpm run mismatched-versions
```

**Update mismatches local packages' versions:**

```sh
pnpx nested-wrkspc.prv verman mismatches -u .
```

### Untested Features

1. CLI subcommand `publish` in package [`nested-workspace-helper`](./packages/typescript/nested-workspace-helper): Cannot mock npm registry in CLI environment.
2. Entire package [`git-ts`](./packages/typescript/git-ts): It's too complicated to create a test friendly git repo.
