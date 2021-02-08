# Telestion Client Template

npm: [`@wuespace/telestion-client-template`](https://www.npmjs.com/package/@wuespace/telestion-client-template)

[![Maintainability](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/maintainability)](https://codeclimate.com/github/TelestionTeam/telestion-client/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97fadf70f54a759cfaa4/test_coverage)](https://codeclimate.com/github/TelestionTeam/telestion-client/test_coverage)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/Test%20and%20Coverage?label=tests)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3A%22Test+and+Coverage%22)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/TelestionTeam/telestion-client/CI)](https://github.com/TelestionTeam/telestion-client/actions?query=workflow%3ACI)
[![GitHub](https://img.shields.io/github/license/TelestionTeam/telestion-client)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/wuespace?style=social)](https://twitter.com/wuespace)

The template used by the Telestion Client CLI for generating _Project-Specific Client_ (PSC) projects.

## Installation

You usually do not need this package as a direct dependency.
If you want to start a new project with this template,
please use the [Telestion Client CLI](https://github.com/TelestionTeam/telestion-client/tree/main/packages/telestion-client-cli) or at the [Telestion Client monorepo](https://github.com/TelestionTeam/telestion-client/) as a starting point.

### Package structure

```
.
├── template (template directory. Structure gets taken over to generated PSC projects)
│   ├── package.json.ejs (uses dependencies from package's package.json)
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

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WüSpace e.V.](https://www.wuespace.de/).
