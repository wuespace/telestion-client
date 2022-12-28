# Parcel Resolver React

npm: [`@wuespace/parcel-resolver-react`](https://www.npmjs.com/package/@wuespace/parcel-resolver-react)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/wuespace/telestion-client/ci.yml?branch=main)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)
[![PNPM current](https://img.shields.io/badge/pnpm-7-brightgreen)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Parcel Resolver that overrides any imports of [React.js](https://reactjs.org/) to include React only once and in one
version only.
This prevents React from failing with
the [Invalid Hook Call Warning](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react).

> Note: This plugin is only active if you're using a workspace linked project.

## Installation

If you're using
the [`@wuespace/telestion-client-template`](https://www.npmjs.com/package/@wuespace/telestion-client-template) the
plugin is already installed and integrated in Parcel.

If that's not the case, install the plugin as development dependency:

```shell
pnpm add -D @wuespace/parcel-resolver-react
# or
npm install --save-dev @wuespace/parcel-resolver-react
```

Then add it to your `.parcelrc` configuration:

```json
{
	"resolvers": ["@wuespace/parcel-resolver-react", "..."]
}
```

That's it!

## Contributing

If you want to contribute to this package, please take a look at
the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other
Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
