# Telestion Client Core

npm: [`@wuespace/telestion-client-core`](https://www.npmjs.com/package/@wuespace/telestion-client-core)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/wuespace/telestion-client/ci.yml?branch=main)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)
[![PNPM current](https://img.shields.io/badge/pnpm-7-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Essential, core components for the development of _Project-Specific Clients_ (PSCs) with the Telestion Client Ecosystem.

These components are not UI-specific and can be used in any UI framework.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

First, add it as dependency to your project:

```shell
pnpm add @wuespace/telestion-client-core
# or
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
https://wuespace.github.io/telestion-client/@wuespace/telestion-client-core/

## Package structure

```
.
├── build (built in build script)
├── src
│   ├── components (components provided or used by the library)
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

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
