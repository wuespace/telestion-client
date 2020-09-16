# Cypress testing

Fast, easy and reliable testing for anything that runs in a browser.

## Folder structure

```
/cypress
  /fixtures
    - example.json

  /plugins
    - index.ts

  /support
    - index.ts
    - commands.ts

  /tests
    /app
      - login.spec.ts
    /widgets
      - SimpleWidget.spec.ts
```

## Fixture files

Fixtures are used as external pieces of static data that can be used by your tests.
Fixture files are located in `cypress/fixtures` directory.

You would typically use them with the `cy.fixture()` command,
and most often when you’re stubbing
[Network Requests](https://docs.cypress.io/guides/guides/network-requests.html).

## Plugin files

By default, Cypress will automatically include the plugins file `cypress/plugins/index.ts`
before every single spec file it runs.

The initial imported plugins file can be
[configured to another file](https://docs.cypress.io/guides/references/configuration.html#Folders-Files).

[Read more about using plugins to extend Cypress behavior.](https://docs.cypress.io/guides/tooling/plugins-guide.html)

## Support file

By default, Cypress will automatically include the support file `cypress/support/index.js`.
This file runs before every single spec file.

The support file is a great place to put reusable behavior such as
[custom commands](https://docs.cypress.io/api/cypress-api/custom-commands.html)
or global overrides that you want applied and available to all of your spec files.

From your support file you can import or require other files to keep things organized.

You can define behaviors in a before or beforeEach within any of the cypress/support files:

```ts
beforeEach(() => {
	cy.log('I run before every test in every spec file!');
});
```

## Test files

Test files are located in `cypress/tests`.

To start writing tests for your app,
create a new file like app_spec.js within your `cypress/tests` folder.
Refresh your tests list in the Cypress Test Runner
and your new file should have appeared in the list.

For learning how to write tests, look
[here for an in-depth explanation](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Writing-tests).

## Further information

For further information, check out the [full documentation](https://docs.cypress.io/).

## Sources and acknowledgements

Sources are from: https://www.cypress.io/

Many thanks to: https://github.com/cypress-io/cypress-realworld-app
