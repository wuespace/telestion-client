# scripts

Contains the scripts, that are used in the project to handle meta-like tasks.

## Replace package versions

This script replaces the file resource specifiers in all registered packages defined in the `lerna.json`
with the current version also defined in the `lerna.json`.
This enables the project to build and publish valid packages to npm without the use of `lerna publish`.

`lerna publish` requires some steps that cannot be fulfilled in a reduced build and publish environment
like GitHub Actions.
