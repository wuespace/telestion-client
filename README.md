# Telestion Client

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/wuespace/telestion-client/ci.yml?branch=main)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)
[![PNPM current](https://img.shields.io/badge/pnpm-7-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

This is the Telestion Client Library Monorepo. It contains, in basic terms, a framework for building so-called
_Project-Specific-Clients_ (PSCs), which are clients for the Telestion software that perfectly fit
the mission's requirements.

_Telestion_ is an ecosystem for Ground Station software that's easy to adjust to a mission's needs
without re-inventing the wheel.

## Getting Started with PSC development

**This is just a very basic guide for getting started. For more in-depth guides, reference, etc.,
please refer to the [official Telestion documentation](https://docs.telestion.wuespace.de/).**

To make it easy for you to develop PSCs, we provide a fully-featured CLI that, while keeping everything extensible,
gives you a hand in creating new projects, generating boilerplate in the projects,
running the project during development, and building the PSC, either for the web or as a native, Electron-based, app.

### Before you begin

Before you begin, please make sure that you have the following tools installed on your system:

- [NodeJS](https://nodejs.org/en/) ([Download](https://nodejs.org/en/download/)), v16 or above
- [pnpm](https://pnpm.io/) ([Installation instructions](https://pnpm.io/motivation)), v7 or above (an alternative package manager for packages in the [npm registry](https://www.npmjs.com/))

With both installed, we're ready to take off 🚀:

### Installing the CLI

First, let's install the Telestion Client CLI. Open a command line and enter the following command:

```shell
pnpm add --global @wuespace/telestion-client-cli
```

> ⚠ If, on UNIX-based systems (Linux or macOS), you run into permission issues when running this command,
> please try re-running it with `sudo`.

### Creating the PSC

With the CLI installed, we can create our first PSC project.
Open a command line in a folder where you'd like to create your project and run:

```shell
tc-cli init
```

You will then be asked one or more questions (like the project title).
When everything's answered, the CLI will initialize a full PSC project for you, so ... sit back, relax,
and enjoy the flight 😉.

Oh! We're already on final approach, and now ... the command is finished.
You will find that the CLI generated a PSC project into a folder matching the title you've given the project.

### Running the PSC

You can now enter that folder and run the PSC by running:

```shell
pnpm start
```

Houston, Tranquility Base here, the Eagle has landed! You should, now, see a flashy PSC open in a new window.

### Next steps

This might all seem a bit overwhelming, at first, but don't worry: We've got you covered
and try to provide all the documentation and help you need to get going.

To learn about how to develop the PSC, please take a look at the
[client development documentation](https://docs.telestion.wuespace.de/client/), which contains guides,
explanations of concepts, and reference for everything surrounding the topic.

For the always-up-to-date API reference for all the npm packages of this repository, please have a look at our
[Online API Reference](https://wuespace.github.io/telestion-client/),
powered by [fliegdoc](https://github.com/fliegwerk/fliegdoc).
As Telestion is meant to be extensible, documentation is a high priority.
Therefore, we have a high standard for the API Reference, as well, with every exposed API being fully documented
with Doc Comments, including an example for every function, and so on.

Last, but not least, you should also consider taking a look at some of our already existing PSCs:

- [Telestion Project RocketSound](https://github.com/wuespace/telestion-project-rocketsound)
- [Telestion Project Daedalus2](https://github.com/wuespace/telestion-project-daedalus2)

## This Repository

### Project Structure

The overall file structure of this monorepo looks like this:

```
.
├── .github
│   ├── workflows (CI configuration)
├── base-configs (configurations around the repo)
│   ├── eslint.base.js
│   └── [...]
├── packages (npm packages within this repo)
│   ├── telestion-client-cli
│   ├── [...]
├── .fliegdocrc.js (Fliegdoc configuration for generating doc pages)
├── CHANGELOG.md (DON'T TOUCH! Automatically generated Changelog)
├── README.md (you're here :P)
└── [...]
```

**Many folders, such as the individual packages in [`./packages`](./packages), etc.,
contain their own `README.md` that documents their inner structure.**

### Packages

- [`@wuespace/parcel-optimizer-electron-require`](./packages/parcel-optimizer-electron-require) - A Parcel optimizer that allows you to use `require` in your Electron app `preload` scripts.
- [`@wuespace/parcel-reporter-tc-cli`](./packages/parcel-reporter-tc-cli) - A Parcel reporter that provides a nice CLI output for the Telestion Client CLI.
- [`@wuespace/parcel-resolver-react`](./packages/parcel-resolver-react) - A Parcel resolver that allows you to use `react` imports in your PSC without fear of "duplicate" React instances.
- [`@wuespace/telestion-client-cli`](./packages/telestion-client-cli) contains the CLI for developing PSCs.
- [`@wuespace/telestion-client-core`](./packages/telestion-client-core) contains the core components
  of the Telestion Client that are essential for developing a Telestion frontend.
- [`@wuespace/telestion-client-common`](./packages/telestion-client-common) contains more common components
  that not necessary for a working frontend project but are highly recommended by the Telestion development team.
- [`@wuespace/telestion-client-prop-types`](./packages/telestion-client-prop-types) contains common PropTypes
  for the telestion-client ecosystem.
- [`@wuespace/telestion-client-template`](./packages/telestion-client-template) contains the template structure
  for a future Telestion Client project.
- [`@wuespace/telestion-client-types`](./packages/telestion-client-types) contains TypeScript definitions
  for common telestion-client types, used in different packages.
- [`@wuespace/vertx-event-bus`](./packages/vertx-event-bus) contains a client for the VertX EventBus,
  including full TypeScript support.
- [`@wuespace/vertx-mock-server`](./packages/vertx-mock-server) contains a mock server that simulates a connection
  with the Telestion backend only for testing purposes.

### Contributing

For the documentation on contributing to this repository,
please take a look at the [Contributing Guidelines](./CONTRIBUTING.md).

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
