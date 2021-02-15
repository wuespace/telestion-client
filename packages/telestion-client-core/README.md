# Telestion Client Core

npm: [`@wuespace/telestion-client-core`](https://www.npmjs.com/package/@wuespace/telestion-client-core)

[![Maintainability](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/maintainability)](https://codeclimate.com/github/TelestionTeam/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/test_coverage)](https://codeclimate.com/github/TelestionTeam/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/CI)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/TelestionTeam/telestion-client)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Essential, core components for the development of _Project-Specific Clients_ (PSCs) with the Telestion Client Ecosystem.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

First, add it as dependency to your project:

```shell
npm install @wuespace/telestion-client-core
```

Please also check that you install a supported version of `react` and `react-dom`.

After installation, check out the provided components:

```tsx
import { TelestionClient } from '@wuespace/telestion-client-core';

function App() {
	return <TelestionClient />;
}
```

For a full list of components, hooks and utility parts, check out the reference:
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-core/

## Package structure

```
.
├── build (built in build script)
├── src
│   ├── components (components provided or used by the library)
│   │   ├── storybook (Storybook-specific components)
│   │   ├── index.ts
│   │   └── [...]
│   ├── hooks
│   │   ├── abstractions (hooks that provide abstractions of other hooks)
│   │   │   ├── index.ts
│   │   │   └── [...]
│   │   ├── managers (hooks that manage specific properties like Singleton instances)
│   │   │   ├── index.ts
│   │   │   └── [...]
│   │   ├── stores (zustand-Store-Hooks)
│   │   │   ├── index.ts
│   │   │   └── [...]
│   │   └── [...]
│   ├── lib (various utilities provided or used by the library)
│   │   ├── index.ts
│   │   └── [...]
│   └── index.ts
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

[![Contributors](https://contrib.rocks/image?repo=TelestionTeam/telestion-client)](https://github.com/TelestionTeam/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
