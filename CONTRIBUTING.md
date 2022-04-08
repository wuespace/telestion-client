## Contributing

**First things first:** Thank you for considering contributing to this repository. If anything's unclear, don't be afraid to ask.

We are happy to answer any questions you might have or help you get your PRs merged.

While we appreciate if you can follow our conventional commit structure, ensure that all styles are correct, every automated test written, etc., you contribution won't be rejected because of a lock of any of that. **Therefore: Don't worry about doing it perfectly. We'll help you get it merged 😉!**

> **⚠ NOTE:** While the most important principles for contributing to the `telestion-client` repository are described below, the _Telestion Client Git Conventions_ contain a lot more information. This is especially mandatory for maintainers.
>
> You can find the latest release of this (as PDF) in the [`telestion-docs` releases](https://github.com/wuespace/telestion-docs/releases/latest)

### Installation

This project uses [pnpm](https://pnpm.io/) as package manager.

To install it, run:

```shell
npm install --global pnpm@next-7
```

To install all dependencies the right way, run:

```shell
pnpm install
```

To clear all installed dependencies, execute:

```shell
pnpm exec clean
rm -rf node_modules
```

### Developing and Testing

Most of the time, you can use a package in the `packages` folder like a normal npm project.
If you want to run the command over all packages in parallel, ask lerna for help:

```shell
lerna run build --stream
```

Differences come up, if you want to add a dependency.
Here you must use lerna with the scope modifier:

```shell
lerna add [packageName] [packages/prefix-*]
```

Sometimes you need to edit the `package.json` manually.
You can add dependencies by simply adding the lines in the dependency object
and run lerna to restructure the monorepo dependencies:

```shell
lerna link convert
```

To add a dependency to a monorepo package,
use a file URI with a relative path to the package instead of a version number.
Lerna inserts at publishing the most recent version of the linked monorepo package automatically:

```json
{
	"dependencies": {
		"@wuespace/telestion-client-cli": "file:../telestion-client-cli"
	}
}
```

### Build-Stack

We use Rollup with some plugins and custom configurations as our build stack for the library parts of this project.
If you need access to the CommonJS `require` function to import JSON files,
please import the `requireGood` function from `./base-configs/helpers.mjs`.
ESM currently doesn't support importing of JSON files, so please use this function as a (readable) workaround.

### Publishing

The publishing process, in this project, is fully automated. Please refer to the relevant sections of the _Telestion Client Git Conventions_ for further instructions on publishing.
