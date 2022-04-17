# Contributing

**First things first:** Thank you for considering contributing to this repository.
If anything's unclear, don't be afraid to ask.

We are happy to answer any questions you might have or help you get your PRs merged.

While we appreciate if you can follow our conventional commit structure, ensure that all styles are correct,
every automated test written, etc., you contribution won't be rejected because of a lock of any of that.
**Therefore: Don't worry about doing it perfectly. We'll help you get it merged 😉!**

> **⚠ NOTE:** While the most important principles for contributing to the `telestion-client` repository
> are described below, the internal Telestion documentation contain a lot more information.
> This is especially mandatory for maintainers.
>
> You can find it in a subsection of the official Telestion documentation:
> https://docs.telestion.wuespace.de/internal/

## Installation

This project uses [pnpm](https://pnpm.io/) as package manager.

To install it, run:

```shell
npm install --global pnpm@next-7
```

To install production and development dependencies, run:

```shell
pnpm install
```

Before you begin to develop, you should build all packages for the first time:

```shell
pnpm build
```

Some tools don't work very well when no build files exist.

To clear all build files, execute:

```shell
pnpm clean
```

## Developing and Testing

Most of the time, you can use a package in the `packages` folder like a normal pnpm project.

### Managing dependencies

Differences come up, if you want to add a dependency.
Here you need to use pnpm with the filter option:

```shell
pnpm add --filter "telestion-client-core" typescript@4.4.4
```

If you need a dependency in the root package, call pnpm with the root-workspace selector:

```shell
pnpm add --workspace-root fliegdoc@latest
```

To add a dependency to a monorepo package,
use the [workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
with a version specifier to the package instead of a version number.
During publishing pnpm inserts the most recent version number of the linked monorepo package automatically:

```json
{
	"dependencies": {
		"@wuespace/telestion-client-cli": "workspace:^"
	}
}
```

Please check the [main `package.json`](./package.json) for more scripts.

### Developing and Testing on a live project

When you develop and change things, it's useful to immediately test your changes inside a Telestion Project.
With the help of the Telestion Client CLI it's now possible to create a new project that uses this monorepo sources.

First, let's generate up-to-date build files:

```shell
# telestion-client root
pnpm build
```

Now, make the `telestion-client-cli` package globally available:

```shell
# telestion-client root
cd packages/telestion-client-cli
pnpm link --global
```

Next, go into a directory outside this project and create a new project with the globally linked `tc-cli`:

```shell
cd ~/tmp
tc-cli init test-project
```

The initialize command detects the workspace protocol in the `package.json` of the `telestion-client-template` package
and create symbolic links to the associated monorepo packages.

Now, run the watch script in the Telestion Client root:

```shell
# telestion-client root
pnpm watch
```

This script starts processes that watch on source code changes and re-compile them if you change them.

Finally, start the created project:

```shell
# test-project root
pnpm start
```

Happy developing!

## Build-Stack

We use [Parcel](https://parceljs.org/) as our build tool for most of the monorepo packages.
Parcel has a configuration file named `.parcelrc`. Due to the nature of parcel as a zero-configuration build tool,
you don't need to change it very often.

## Publishing

The publishing process, in this project, is fully automated.
Please refer to the relevant sections in the
[internal Telestion documentation](https://docs.telestion.wuespace.de/internal/) for further instructions on publishing.
