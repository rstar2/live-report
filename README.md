# LiveCam-Report - a monorepo with Turborepo

This is an official starter turborepo.

## What's inside?

This turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a Vite React-ts[Vite.js](https://vitejs.dev/) app
- `webcam`: a node server that uses the Webcam to take snapshots and videos and save then directly to the AWS S3 (through a configured API Gateway)
- `backend`: A NestJs server app (deployed with Serverless to AWS) that enumerates/lists the stored images.
- `ui`: a stub React component library used by `web`
- `config`: `eslint` configurations (includes `eslint-config-prettier` and etc...)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `utils`: a general utility library used in `backend` and `webcam` (common types, methods, etc...)

### Notes

- The AWS S3 bucket storing the images/videos is pre-configured manually (as well as the API Gateway that simplifies putting the data in it)
- The compiled `web` app is a client module served statically by this NestJs, so when built it's output is put into the `backend`. This means that building of `web` should be before `backend`
- The `utils` package is entirely in TypeScript, but is used by the `webcam` and `backend` apps which are actually NodeJs applications (e.g compiled to JS , even though source is TypeScript and ES6 modules), so it has to be compiled also. For this reason the `utils` has to be build (npm run build) before running and deploying the `webcam` and `backend` apps.
- The `utils` package is used also form `web`, which uses directly the TypeScript files. One way is to `import xxx from "utils/src"` and another is to specify both `main` and `module` paths in the `utils` package.json.

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
