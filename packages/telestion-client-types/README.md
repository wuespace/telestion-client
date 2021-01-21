# Telestion Client types

Types for Telestion Client and their projects.

## Installation

First, add it as a development dependency to your project:

```shell
npm install --save-dev @wuespace/telestion-client-types
```

Please also check that you have installed a supported version of
`@types/react` to use this package.

After the installation, check out the provided types:

```ts
import { Dashboard } from '@wuespace/telestion-client-types';

const myDashboard: Dashboard = {
	title: 'My Dashboard',
	columns: 4,
	rows: 4,
	widgets: []
};
```

Every exported type from this package
has an appropriate PropType member exported in `@wuespace/telestion-client-prop-types`.

For all full list of types used in Telestion Client, check out the reference: \
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-types/

For the equivalent PropTypes, check out the reference here: \
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-prop-types/

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
