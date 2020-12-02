# Telestion Client command line interface

The command line interface for Telestion Frontend development

## Installation

Simply install the command line interface globally in your workspace:

```shell
$ npm install --global @wuespace/telestion-client-cli
```

Or add it as a development dependency to your project:

```shell
$ npm install @wuespace/telestion-client-cli
```

After installation, check out the options of the cli:

```shell
$ tc-cli --help
```

For a full reference, check out the help pages for each command or take a look at the documentation:
(coming soon™)

## Contributing

Take a look at the [Telestion Client monorepo](https://github.com/TelestionTeam/telestion-client/)
that manages this package, and many more related to Telestion Client.

### Package structure

The package internally uses [yargs](http://yargs.js.org/) to build an interactive command line
and does all the argument parsing.

The main executable is located in the `bin` folder.
All commands are defined in `src/commands` and must export some predefined variables.
Utility and library functions are exported at `src/lib` that maybe used in the commands.

### Building

(coming soon™)

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WueSpace e.V.](https://www.wuespace.de/)
