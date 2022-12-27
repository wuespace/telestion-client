# Parcel Optimizer Electron Require

npm: [`@wuespace/parcel-optimizer-electron-require`](https://www.npmjs.com/package/@wuespace/parcel-optimizer-electron-require)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wuespace/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/wuespace/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wuespace/telestion-client/CI)](https://github.com/wuespace/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](package.json)
[![NPM current](https://img.shields.io/badge/npm-%3E%3D7-blue)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Parcel Optimizer Plugin that polyfills the require function in an electron context. (especially in preload)

## Installation

If you're using
the [`@wuespace/telestion-client-template`](https://www.npmjs.com/package/@wuespace/telestion-client-template) the
plugin is already installed and integrated in Parcel.

If that's not the case, install the plugin as development dependency:

```shell
npm install --save-dev @wuespace/parcel-optimizer-electron-require
```

Then add it to your `.parcelrc` configuration:

```json5
{
	optimizers: {
		// add optimizer to fix require in electron preload
		'*.js': ['@wuespace/parcel-optimizer-electron-require']
	}
}
```

That's it!

## Implementation Details

In Electron preload contexts a global `require` function exists, but no `module` object.
In Parcel's watch mode, the following code gets used to handle CommonJS imports:

https://github.com/parcel-bundler/parcel/blob/10a56a7832c400025f23b6df6fcce3099a4d6302/packages/packagers/js/src/dev-prelude.js#L30-L33

This optimizer adds a prefix to every packaged JavaScript file that adds the `module` object with the `require` function
to circumvent Electron not providing a `module` object:

```js
// Fix Electron renderer "require()" without a module issue
// see: https://github.com/parcel-bundler/parcel/issues/2492
if (typeof require !== 'undefined' && typeof module === 'undefined') {
	var module = { require: require };
}
```

## Contributing

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
