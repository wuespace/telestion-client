# Telestion Client PropTypes

npm: [`@wuespace/telestion-client-prop-types`](https://www.npmjs.com/package/@wuespace/telestion-client-prop-types)

[![Maintainability](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/maintainability)](https://codeclimate.com/github/TelestionTeam/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/test_coverage)](https://codeclimate.com/github/TelestionTeam/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/CI)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/TelestionTeam/telestion-client)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Helpful PropTypes for types exported by the `@wuespace/telestion-client-types` package. Used, among other places, in `@wuespace/telestion-client-common`.

## Installation

First, add it as dependency to your project:

```shell
npm install @wuespace/@wuespace/telestion-client-prop-types
```

Please also check that you have installed a supported version of `react` to use this package.

After the installation, check out the provided PropTypes:

```tsx
import { dashboardPropType } from '@wuespace/telestion-client-prop-types';
import { Dashboard } from '@wuespace/telestion-client-types';

interface Props {
	dashboard: Dashboard;
}

function MyComponent({ dashboard }: Props) {
	return <p>Dashboard: {dashboard.title}</p>;
}

MyComponent.propTypes = {
	dashboard: dashboardPropType.isRequired
};
```

Every exported type from `@wuespace/telestion-client-types` has an appropriate PropType member exported in this package.

For all full list of types used in Telestion Client, check out the reference:
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-types/

For the equivalent PropTypes, check out the reference here:
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-prop-types/

### Package structure

```
.
├── build (built in build script)
├── src
│   ├── index.ts
│   └── [...]
├── tests (utilities for testing the prop types contained in this package)
│   ├── lib (helper functions, etc., for testing the package)
│   │   ├── index.ts
│   │   └── [...]
│   └── samples (a few samples for basic data types, used for testing)
│       └── basic.ts
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

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WueSpace e.V.](https://www.wuespace.de/).
