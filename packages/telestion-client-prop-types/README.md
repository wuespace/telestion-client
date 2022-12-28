# Telestion Client PropTypes

npm: [`@wuespace/telestion-client-prop-types`](https://www.npmjs.com/package/@wuespace/telestion-client-prop-types)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/wuespace/telestion-client/ci.yml?branch=main)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)
[![PNPM current](https://img.shields.io/badge/pnpm-7-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Helpful [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) for types exported by the `@wuespace/telestion-client-types` package.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

First, add it as dependency to your project:

```shell
pnpm add @wuespace/telestion-client-prop-types
# or
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
https://wuespace.github.io/telestion-client/@wuespace/telestion-client-types/

For the equivalent PropTypes, check out the reference here:
https://wuespace.github.io/telestion-client/@wuespace/telestion-client-prop-types/

## Package structure

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

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
