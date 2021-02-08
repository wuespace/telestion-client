# Telestion Vert.x Event Bus Client

npm: [`@wuespace/vertx-event-bus`](https://www.npmjs.com/package/@wuespace/vertx-event-bus)

[![Maintainability](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/maintainability)](https://codeclimate.com/github/TelestionTeam/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/test_coverage)](https://codeclimate.com/github/TelestionTeam/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/CI)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/TelestionTeam/telestion-client)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

The Vert.x event bus client for Telestion Client. Used by `@wuespace/telestion-client-core`.

## Installation

First, add it as a dependency to your project:

```shell
npm install @wuespace/vertx-event-bus
```

After installation, check out the exported members:

```ts
import { EventBus } from '@wuespace/vertx-event-bus';

const eventBus = new EventBus('http://localhost:9870/bridge');

eventBus.onOpen = () => {
	eventBus.publish('eventbus-channel', 'Hello World!');
	eventBus.close();
};
```

For a full list of all exported members, check out the reference:
https://telestionteam.github.io/telestion-client/@wuespace/vertx-event-bus/

### Package structure

```
.
├── build (built in build script)
├── src
│   ├── index.ts
│   └── [...]
├── types (built in build script, gets assembled to single build/index.d.ts file)
│   ├── index.d.ts
│   └── [...]
├── CHANGELOG.md (DO NOT TOUCH! auto-generated changelog for the package)
├── LICENSE
├── package.json
├── README.md (you're here :P)
└── [...] (configuration files, etc.)
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

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
