# Telestion Client Common

npm: [`@wuespace/telestion-client-common`](https://www.npmjs.com/package/@wuespace/telestion-client-common)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wuespace/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/wuespace/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wuespace/telestion-client/CI)](https://github.com/wuespace/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Common components for the development of _Project-Specific Clients_ (PSCs) with the Telestion Client Ecosystem.

**This package is included in PSCs bootstrapped using the Telestion Client CLI by default.**

## Installation

First, add it as dependency to your project:

```shell
npm install @wuespace/telestion-client-common
```

Please also check that you install a supported version of:

- `react`
- `react-router`
- `react-router-dom`
- `@adobe/react-spectrum`
- `@react-spectrum/tabs`
- `@spectrum-icons/illustrations`
- `@spectrum-icons/workflow`
- `@types/react`

for React, routing and UI library support.

After installation, check out the provided components:

```tsx
import { ConnectionIndicator } from '@wuespace/telestion-client-common';

function HeaderComponent() {
	return <ConnectionIndicator />;
}
```

For a full list of components, hooks and utility parts, check out the reference:
https://wuespace.github.io/telestion-client/@wuespace/telestion-client-common/

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
│   │   ├── stores (zustand-Store-Hooks)
│   │   │   ├── index.ts
│   │   │   └── [...]
│   │   └── [...]
│   ├── lib (various utilities provided or used by the library)
│   │   ├── index.ts
│   │   └── [...]
│   ├── media (media files used by the library)
│   │   ├── default-app-logo.svg
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
