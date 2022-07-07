# Parcel Reporter tc-cli

npm: [`@wuespace/parcel-reporter-tc-cli`](https://www.npmjs.com/package/@wuespace/parcel-reporter-tc-cli)

[![Maintainability](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/maintainability)](https://codeclimate.com/github/wuespace/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5fb6ccd02dd3152ef03f/test_coverage)](https://codeclimate.com/github/wuespace/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wuespace/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/wuespace/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wuespace/telestion-client/CI)](https://github.com/wuespace/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/wuespace/telestion-client)](LICENSE)
[![Node current](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](package.json)
[![NPM current](https://img.shields.io/badge/npm-%3E%3D7-blue)](package.json)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

Parcel Reporter Plugin that configures Parcel to interact with
the [`@wuespace/telestion-client-cli`](https://www.npmjs.com/package/@wuespace/telestion-client-cli).

## Installation

If you're using
the [`@wuespace/telestion-client-template`](https://www.npmjs.com/package/@wuespace/telestion-client-template) the
plugin is already installed and integrated in Parcel.

If that's not the case, install the plugin as development dependency:

```shell
npm install --save-dev @wuespace/parcel-reporter-tc-cli
```

Then add it to your `.parcelrc` configuration:

```json
{
	"reporters": ["...", "@wuespace/parcel-reporter-tc-cli"]
}
```

That's it!

## Implementation Details

The reporter sends every Parcel build status update through
Node's [IPC channel](https://nodejs.org/dist/latest-v16.x/docs/api/child_process.html#subprocesssendmessage-sendhandle-options-callback)
between two Node processes.
The `tc-cli` [forks](https://nodejs.org/dist/latest-v16.x/docs/api/child_process.html#child_processforkmodulepath-args-options)
the Parcel process, captures and interprets the transmitted build status,
and continues its build process.

## Contributing

If you want to contribute to this package, please take a look at the [Telestion Client monorepo](https://github.com/wuespace/telestion-client/) that manages this package, among other Telestion Client packages.

## Contributors

Thank you to all contributors of this repository:

[![Contributors](https://contrib.rocks/image?repo=wuespace/telestion-client)](https://github.com/wuespace/telestion-client/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
