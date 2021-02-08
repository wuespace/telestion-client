# Telestion Client Common TypeScript Definitions

npm: [`@wuespace/telestion-client-types`](https://www.npmjs.com/package/@wuespace/telestion-client-types)

[![Maintainability](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/maintainability)](https://codeclimate.com/github/TelestionTeam/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/test_coverage)](https://codeclimate.com/github/TelestionTeam/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/CI)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/TelestionTeam/telestion-client)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Common, useful TypeScript definitions for use in projects in Telestion Client projects.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

First, add it as a development dependency to your project:

```shell
npm install --save-dev @wuespace/telestion-client-types
```

Please also check that you have installed a supported version of `@types/react` to use this package.

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

Every exported type from this package also has an appropriate PropType member exported in `@wuespace/telestion-client-prop-types`.

For all full list of types used in Telestion Client, check out the reference:
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-types/

For the equivalent PropTypes, check out the reference here:
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-prop-types/

### Package structure

```
.
├── sample (samples for the types, useful for testing the types)
│   ├── sample.ts
│   ├── sample-js.js
│   └── tsconfig.json
├── src
│   ├── index.ts
│   └── [...]
├── types (built in build script)
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

[![Contributors](https://contrib.rocks/image?repo=TelestionTeam/telestion-client)](https://github.com/TelestionTeam/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
