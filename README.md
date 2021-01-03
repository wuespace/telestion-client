# Telestion Client

This is the Telestion Client Library Monorepo.

## Getting Started

You likely want to start your own project with a specific frontend client in mind.
This repository only contains the base parts that are later assembled in a specific implementation for your project.

To make the start relatively easy,
we provide you a full featured command line interface and dynamic template generator
that gets project setup done in no time, so you can directly start developing and playing around with components.

Before you are ready to takeoff, you need some tools in your hand.
First, please install the following application via your distribution package manager
or download and install them directly:

- [NodeJS](https://nodejs.org/en/) ([Download](https://nodejs.org/en/download/))
- [npm](https://www.npmjs.com/) ([Installation instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

After you set up these tools, install our command line interface:

```shell
$ npm install --global @wuespace/telestion-client-cli
```

Then go into your projects folder:

```shell
$ cd myProjects
```

Here initialize a new project with:

```shell
$ tc-cli init
```

The command line interface will guide you through the setup process.

Finished!
Now you a ready to go and develop your project groundstation frontend!

A little overwhelmed by the project size or lost the track of the project structure?
Don't worry! Take a look at our extensive documentation (coming soon™)
or at projects that are already using the Telestion client in action:

- [link_daedalus2]
- [link_trex2]

If you want to contribute to the Telestion Client project, read further!

## Contributing

### Installation

This project uses [Lerna](https://lerna.js.org/) as a monorepo package management tool.

First, install `lerna` globally for better repository maintenance:

```
$ npm i -g lerna
```

To install all dependencies the right way, run:

```
$ npm ci
```

To clear all installed dependencies, execute:

```
$ cd /path/to/directory/root
$ npm run clean
$ rm -rf node_modules
```

### Developing and Testing

Most of the time, you can use a package in the `packages` folder like a normal npm project.
If you want to run the command over all packages in parallel, ask lerna for help:

```
$ lerna run build --stream
```

Differences come up, if you want to add a dependency.
Here you must use lerna with the scope modifier:

```
$ lerna add [packageName] [packages/prefix-*]
```

Sometimes you need to edit the `package.json` manually.
You can add dependencies by simply adding the lines in the dependency object
and run lerna to restructure the monorepo dependencies:

```
$ lerna link convert
```

To add a dependency to a monorepo package,
use a file URI with a relative path to the package instead of a version number.
Lerna inserts at publishing the most recent version of the linked monorepo package automatically:

```json
{
	"dependencies": {
		"@wuespace/telestion-client-cli": "file:../telestion-client-cli"
	}
}
```

### Publishing

To publish a new version of the project,
lerna intelligently selects the packages that have change since the last publish,
increase their version and publishes them.

The actual publish process to npm and Github packages is handled by some neat Github-Actions
that detect git tags and triggers a publishing to these registries.

You only need to call:

```
$ lerna version
$ git push
```

## Documentation

### Project Structure

| Package                   | Description                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| telestion-client-core     | Contains the core components of the Telestion Client that are essential for developing a Telestion frontend.                                    |
| telestion-client-common   | Contains more common components that not necessary for a working frontend project but are highly recommended by the Telestion development team. |
| telestion-client-template | Contains the template structure for a future Telestion Client project.                                                                          |
| telestion-client-cli      | Bundles the full-featured command line interface of the Telestion Client.                                                                       |
| mock-server               | Contains a mock server that simulates a connection with the Telestion backend only for testing purposes.                                        |

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WueSpace e.V.](https://www.wuespace.de/)
