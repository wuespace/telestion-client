# Contributing

**First things first:** Thank you for considering contributing to this repository.
If anything's unclear, don't be afraid to ask.

We are happy to answer any questions you might have or help you get your PRs merged.

While we appreciate if you can follow our conventional commit structure, ensure that all styles are correct,
every automated test written, etc., your contribution won't be rejected because of a lock of that.
**Therefore, don't worry about doing it perfectly.
We'll help you get it merged 😉!**

> **⚠ NOTE:** While the most important principles for contributing to the `telestion-client` repository
> are described below, the internal Telestion documentation contains a lot more information.
> This is especially mandatory for maintainers.
>
> You can find it in a subsection of the official Telestion documentation:
> https://docs.telestion.wuespace.de/internal/

## Installation

This project uses [pnpm](https://pnpm.io/) as package manager.

To install it, run:

```shell
npm install --global pnpm@latest
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

To clear all the build files, execute:

```shell
pnpm clean
```

## Developing and Testing

Most of the time, you can use a package in the `packages` folder like a normal pnpm project.

### Managing dependencies

Differences come up if you want to add a dependency.
Here you need to use pnpm with the filter option:

```shell
pnpm add --filter "telestion-client-core" typescript@4.4.4
```

If you need a dependency on the root package, call pnpm with the root-workspace selector:

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
With the help of the Telestion Client CLI, it's now possible to create a new project that uses these monorepo sources.

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

## Changelog Generation

This project uses [Changesets](https://github.com/changesets/changesets) for version and changelog management.

For any changes to the project that affects package users, you need to create a changeset.

To create a changeset, run:

```shell
pnpm changeset
```

This will guide you through the process of creating a changeset.

For breaking changes, press the return key when asked for the summary of the changeset.
This opens an editor where you can write a longer description.
Write a summary of your change in the first line.
In the following lines, describe the breaking changes in detail, including a clear migration strategy.

For example, if you change the API of a component, you can write:

```text
Add a `name` property to `MyComponent`

To migrate, add a `name` property to all usages of the `MyComponent` component.
```

## Build-Stack

We use [Parcel](https://parceljs.org/) as our build tool for most of the monorepo packages.
Parcel has a configuration file named `.parcelrc`. Due to the nature of parcel as a zero-configuration build tool,
you don't need to change it very often.

## Publishing

The publishing process, in this project, is fully automated.
Please refer to the relevant sections in the
[internal Telestion documentation](https://docs.telestion.wuespace.de/internal/) for further instructions on publishing.
