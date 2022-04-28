# LiveCam-Report - a monorepo with Turborepo

This is an official starter turborepo.

## What's inside?

This turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a Vite React-ts[Vite.js](https://vitejs.dev/) app
- `webcam`: a node server that uses the Webcam to take snapshots and videos and send to the `aws` app
- `aws`: a Serverless powered AWS cloud-formation app that stores the snapshots and videos sent from the `webcam` app
- `ui`: a stub React component library used by `web`
- `config`: `eslint` configurations (includes `eslint-config-prettier` and etc...)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

## For Turborepo (it utilizes the NPM workspaces)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Setup

This repository is used in the `npx create-turbo@latest` command, and selected when choosing which package manager you wish to use with your monorepo (NPM).

### Build

To build all apps and packages, run the following command:

```bash
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```bash
npm run dev
```

### Add a new app/package to the turborepo (e.g. a new NPM workspace)

```bash
npm init -w apps/webcam
```

### Install a module in a concrete workspace

```bash
npm install log4js -w apps/webcam
```

### Running commands in the context of workspaces (can be in multiple workspaces)

```bash
npm run test --workspace=apps/webcam
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/features/pipelines)
- [Caching](https://turborepo.org/docs/features/caching)
- [Remote Caching (Beta)](https://turborepo.org/docs/features/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/features/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
