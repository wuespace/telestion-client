# Telestion Vert.x Mock Server

npm: [`@wuespace/vertx-mock-server`](https://www.npmjs.com/package/@wuespace/vertx-mock-server)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/wuespace/telestion-client/ci.yml?branch=main)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)
[![PNPM current](https://img.shields.io/badge/pnpm-7-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

A mock server for the Vert.x Event Bus. Useful for developing and testing widgets without a full-blown Java-based Telestion backend running in the background.

## Installation

First, add it as a dependency to your project:

```shell
pnpm add @wuespace/vertx-mock-server
# or
npm install @wuespace/vertx-mock-server
```

After installation, check out the exported members:

```ts
import { MockServer } from '@wuespace/vertx-mock-server';

const mockServer = new MockServer();
```

For a full list of all exported members, check out the reference:
https://wuespace.github.io/telestion-client/@wuespace/vertx-mock-server/

## Package structure

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

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
