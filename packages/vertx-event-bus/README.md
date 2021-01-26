# Vert.x event bus client

The Vert.x event bus client for Telestion Client.

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

For a full list of all exported members, check out the reference: \
https://telestionteam.github.io/telestion-client/@wuespace/vertx-event-bus/

## Contributing

Take a look at the
[Telestion Client monorepo](https://github.com/TelestionTeam/telestion-client/)
that manages this package, and many more related to Telestion Client.

### Package structure

(coming soon™)

### Building

(coming soon™)

## About

This is part of [Telestion](https://telestion.wuespace.de/),
a project by [WüSpace e.V.](https://www.wuespace.de/)
