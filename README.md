<p align="center">
<img alt="Dashboard Page" height="360" width="640" src="./images/frontend-dashboard.png"  />
</p>

# D2 - Ground Station Frontend

The Ground Station Frontend for Daedalus2 written in
[TypeScript](https://www.typescriptlang.org/) with [React](https://reactjs.org/) and
[Adobe Spectrum](https://spectrum.adobe.com/) as the design system

## Getting started

> **NOTE:** All commands below, unless otherwise specified, should get executed in the cloned project's root folder (that contains the `package.json`) or a subfolder thereof.

The first step is to install the development dependencies.
They are defined in `package.json` and you can install them with the following command:

```shell script
$ npm ci
```

After the installation, make a copy of the `example.env`
and name it `.env` in the project root folder to apply the final configuration.
In this file, API keys and other secrets get defined as environment variables
that are necessary for production compilation.

More information [here](https://www.npmjs.com/package/dotenv).

## Running

To build and run the project in development mode, execute:

```shell script
$ npm start
```

## Linting and testing

The project has numerous code style and syntax checkers.
They fix possible wrong formatted code and inform you about syntax error.
The unit and end-to-end check the application behavior and
test for edge cases to find bugs in the early development phase.

To run all checks and tests, simply call:

```shell script
$ npm run check
```

### Prettier

[Prettier](https://prettier.io/) is an opinionated code formatter.
It formats your written code and ensures
that all project code conforms to a consistent style.

To check and fix your code style, run:

```shell script
$ npm run prettier
```

### ESLint

[ESLint](https://eslint.org/) is a code linter and analyzer.
It detects syntax errors in your code.

ESLint is integrated into the `start` and `build` scripts and
gives you many rules to control the style, syntax, and usage of Javascript functionality.

### TypeScript

[TypeScript](https://www.typescriptlang.org/) extends JavaScript by adding types.

To check for type mismatches and errors in your code, perform:

```shell script
$ npm run ts
```

### Jest

[Jest](https://jestjs.io/) is a delightful JavaScript Testing Framework
with a focus on simplicity.

It tests your components with predefined unit-tests.

To run all tests, call:

```shell script
$ npm run test:unit
```

### Cypress

[Cypress](https://www.cypress.io/) is an end-to-end test environment
with live result feedback running in a controlled browser environment.

It tests the application logic and behavior with predefined end-to-end tests.

To open the management window, call:

```shell script
$ npm run test:e2e
```

Do not forget to **start** the development server if you want to test the project:

```shell script
$ npm start
```

## Build and deploy

The build command generates a ready-to-deploy webpage from the source code.

To build the entire project, run:

```shell script
$ npm run build
```

If you want to package to compiled code into an electron app, run:

```
$ npm run build:electron
```

Or as an all-in-one bundle for Windows, Linux, and macOS, execute:

```shell script
$ npm run package:all
```

## Stable releases

In the Github
[Releases](https://github.com/TelestionGroup/daedalus2-client/releases)
section, there are also stable builds for all popular operating systems
for all released versions of the project.

## Documentation

The project uses [TypeDoc](https://typedoc.org/) as the documentation tool.
It converts documentation comments in TypeScript source code
into rendered HTML documentation.

To build the documentation yourself, run:

```shell script
$ npm run build:docs
```

## Project Structure

```yaml
root:
  package.json  # describes project (dependencies, scripts, ...)
  README.md
  src:
    index.tsx    # entry point
    styles.scss  # global styles
    model:  # global classes/types/interfaces that define the app
      AppState.ts
      MyAwesomeType.ts
    lib:  # global library functionality
      isValid.ts
    app:  # sources for the application
      index.tsx
      index.test.tsx
      components:  # application components
        Dashboard
        Header
        Provider  # application state provider
      pages:  # possible pages for any routes in the application
    widgets:  # sources of all widgets
      index.ts  # registration file for every widget
      widget-1:
        index.tsx
        components:  # widget-1 own components
          MyAwesomeComponent.tsx
        model:  # widget-1 own model definitions
          MyType.ts
      widget-2:
        index.tsx
        components:
          MyAwesomeComponent.tsx
        model:
          MyType.ts
    hooks:  # global reusable component behavior
      useSocket.ts
      useAppState.ts
  public:   # template webpage folder where React will engage
    index.html
    favicon.ico
  cypress:  # cypress end-to-end test folder
    README.md
    fixtures:  # external pieces of static data
      myData.json
    plugins:  # plugins to extend cypress behavior
      index.ts
    support:  # reusable behavior for cypress tests
      command.ts
      index.ts
    tests:  # actual test files
      app:  # application end-to-end tests
        login.spec.ts
      widgets:  # widget end-to-end tests
        SimpleWidget.spec.ts
```

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

## Notice

Original source code of eventbus handler once existed here:

- https://github.com/vert-x3/vertx-web/blob/master/vertx-web/src/client/vertx-eventbus.js

and NOT here:

- https://github.com/vert-x3/vertx-stack
- https://github.com/vert-x3/vertx-bus-bower

**that no longer is the case.** Where it is now, is a mystery (please report any findings here :wink:). It was, however, last seen in

- https://github.com/vert-x3/vertx-web/commit/0c257b111a13597618c92d6482253f6422b3536d#diff-def126407e3ad10b16f833b7ce3b456cf88491796a22d0f8b5965327ded79b5c
