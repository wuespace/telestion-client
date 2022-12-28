# Telestion Client CLI

npm: [`@wuespace/telestion-client-cli`](https://www.npmjs.com/package/@wuespace/telestion-client-cli)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/wuespace/telestion-client/ci.yml?branch=main)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)
[![PNPM current](https://img.shields.io/badge/pnpm-7-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

The command line interface for developing _Project-Specific Clients_ (PSCs) with the Telestion Client ecosystem.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

Simply install the command line interface globally in your workspace:

```shell
pnpm add -g @wuespace/telestion-client-cli
# or
npm install --global @wuespace/telestion-client-cli
```

Or, add it as a development dependency to your PSC project:

```shell
pnpm add -D @wuespace/telestion-client-cli
# or
npm install @wuespace/telestion-client-cli
```

After installation, check out the options of the cli:

```shell
tc-cli --help
```

For a full reference, check out the help pages for each command or take a look at the _PSC Dev Manual_ in our documentation.

You can find the latest versions (in PDF format) in the [Documentation Repo Releases](https://github.com/wuespace/telestion-docs/releases/latest).

## Package structure

The package internally uses [commander](https://github.com/tj/commander.js) to build an interactive command line
and does all the argument parsing.

The folder looks like this:

```
.
├── resources (static files used by the CLI)
├── src
│   ├── actions (specific actions related to topics used in the CLI)
│   │   ├── electron.mts (actions required for interacting with electron)
│   │   └── [...]
│   ├── commands (the commands of the CLI)
│   │   ├── _template (a template that you can copy to create a new command)
│   │   │   ├── command.mts (the function that gets called when the command gets executed)
│   │   │   ├── index.mts (the basic command definition)
│   │   │   ├── model.mts (model classes/interfaces used by the command, e.g., command options)
│   │   │   └── stages.mts (functions for execution stages of the command)
│   │   └── [...]
│   ├── lib (generic functionality used in the CLI)
│   │   └── [...]
│   ├── model (model interfaces used by the CLI)
│   │   └── [...]
│   ├── api.mts (the entrypoint of the module APIs for using the CLI programmatically)
│   └── cli.mts (the entrypoint of the CLI)
├── CHANGELOG.md (DO NOT TOUCH! auto-generated changelog for the package)
├── LICENSE
├── package.json
├── README.md (you're here :P)
└── tsconfig.json
```

## Contributing

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
