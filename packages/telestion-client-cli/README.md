# Telestion Client CLI

npm: [`@wuespace/telestion-client-cli`](https://www.npmjs.com/package/@wuespace/telestion-client-cli)

[![Maintainability](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/maintainability)](https://codeclimate.com/github/TelestionTeam/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/test_coverage)](https://codeclimate.com/github/TelestionTeam/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/CI)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/TelestionTeam/telestion-client)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

The command line interface for developing _Project-Specific Clients_ (PSCs) with the Telestion Client ecosystem.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

Simply install the command line interface globally in your workspace:

```shell
npm install --global @wuespace/telestion-client-cli
```

Or, add it as a development dependency to your PSC project:

```shell
npm install @wuespace/telestion-client-cli
```

After installation, check out the options of the cli:

```shell
tc-cli --help
```

For a full reference, check out the help pages for each command or take a look at the _PSC Dev Manual_ in our documentation.

You can find the latest versions (in PDF format) in the [Documentation Repo Releases](https://github.com/TelestionTeam/telestion-docs/releases/latest).

### Package structure

The package internally uses [yargs](http://yargs.js.org/) to build an interactive command line
and does all the argument parsing.

The main executable is located in the `bin` folder.
All commands are defined in `src/commands` and must export some predefined variables.
Utility and library functions are exported at `src/lib` that maybe used in the commands.

Overall, the folder structure, therefore, looks like this:

```
.
├── bin
│   └── cli.js (the CLI executable)
├── src
│   ├── commands (the CLI commands)
│   │   ├── build.js
│   │   ├── docs.js
│   │   └── [...]
│   ├── lib (library functions for CLI commands)
│   │   ├── build
│   │   │   ├── custom-webpack-loader
│   │   │   │   └── electron-main-import-plugins.js (custom webpack loader for compiling the Electron main thread)
│   │   │   ├── static
│   │   │   │   └── electron-main.js (the Electron Main Thread file used when building Electron Apps from PSCs)
│   │   │   └── [...]
│   │   ├── [...]
│   │   ├── async-exec.js
│   │   └── [...]
│   └── api.js (publicly exposed JS APIs of the CLI, undocumented except in code!)
├── CHANGELOG.md (DO NOT TOUCH! auto-generated changelog for the package)
├── LICENSE
├── package.json
├── README.md (you're here :P)
└── tsconfig.json
```

## Contributing

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/TelestionTeam/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

<a href="https://github.com/TelestionTeam/telestion-client/graphs/contributors">
  <img alt="Contributors" src="https://contrib.rocks/image?repo=TelestionTeam/telestion-client" />
</a>

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WueSpace e.V.](https://www.wuespace.de/).
