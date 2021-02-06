# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.7.0](https://github.com/TelestionTeam/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)


### ⚠ BREAKING CHANGES

* **cli:** Before, running `tc-cli start` opened the PSC as an Electron app, by default. To replicate this behavior, you'll now have to pass the `--electron` or `-e` argument to the command.

In summary, replace `tc-cli start` with `tc-cli start -e` to keep the same behavior.

### Features

* **cli:** Add option to open the PSC in either an Electron window or a browser in `tc-cli start` ([5fd359c](https://github.com/TelestionTeam/telestion-client/commit/5fd359c6d5e04208be15c41e37a9c1612eb463b0))


### Bug Fixes

* **cli:** Add files before commiting the initial commit in `tc-cli init` ([8e0ac3c](https://github.com/TelestionTeam/telestion-client/commit/8e0ac3c6963e79c3606283151a9bfcacc465a7b7))
* **cli:** Fix `TypeError: Cannot read property 'message' of undefined` in `tc-cli init` command ([6f4d1a3](https://github.com/TelestionTeam/telestion-client/commit/6f4d1a376210f8ec368f1ad80f8b2f09bcf9d6f8))
* **cli:** In `tc-cli stats`, fix reverted json to non-json output behavior. ([c2451c6](https://github.com/TelestionTeam/telestion-client/commit/c2451c6b4df1b998304aed80cdded8f5331ec17f))



### [0.6.1](https://github.com/TelestionTeam/telestion-client/compare/v0.6.0...v0.6.1) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.6.0](https://github.com/TelestionTeam/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.5.0](https://github.com/TelestionTeam/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.4.0](https://github.com/TelestionTeam/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)


### ⚠ BREAKING CHANGES

* **cli:** For previously generated PSCs to work with the new CLI, the // IMPORT_INSERT_MARK and // ARRAY_FIRST_ELEMENT_INSERT_MARK comments have to retrospectively be placed below all imports and at the beginning of the projectWidgets array, respectively

### Features

* **cli:** Add `tc-cli docs` to open the telestion-client documentation page ([85a2e03](https://github.com/TelestionTeam/telestion-client/commit/85a2e03f05bf0bdd3887240339a8a15912ea8dd2))
* **cli:** Add `tc-cli generate widget` command ([4305e09](https://github.com/TelestionTeam/telestion-client/commit/4305e09d45204607bba7fa7fd41360824ce2b112)), closes [#263](https://github.com/TelestionTeam/telestion-client/issues/263)
* **cli:** Add `tc-cli stats` command implementation ([#279](https://github.com/TelestionTeam/telestion-client/issues/279)) ([35dbf26](https://github.com/TelestionTeam/telestion-client/commit/35dbf263f820a01deff7a9cf228ba44abf6aaeb3)), closes [#263](https://github.com/TelestionTeam/telestion-client/issues/263)


### Bug Fixes

* **cli:** Fix `tc-cli generate` command (and subsequent, broken, CLI) ([a2a25fc](https://github.com/TelestionTeam/telestion-client/commit/a2a25fc9770835b43ea289a8c3006384c42ec3d0))



## 0.3.4 (2021-02-04)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.3.3](https://github.com/TelestionTeam/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-cli

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-cli

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-cli
