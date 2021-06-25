# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.17.0](https://github.com/wuespace/telestion-client/compare/v0.16.1...v0.17.0) (2021-06-25)

**Note:** Version bump only for package @wuespace/telestion-client-cli





### [0.16.1](https://github.com/wuespace/telestion-client/compare/v0.16.0...v0.16.1) (2021-06-23)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.16.0](https://github.com/wuespace/telestion-client/compare/v0.15.1...v0.16.0) (2021-06-23)


### Features

* **cli:** Update widget generate command due to breaking changes ([5b9bd2f](https://github.com/wuespace/telestion-client/commit/5b9bd2feda73982fcbf87fc368cccd81b009e90c))



### [0.15.1](https://github.com/wuespace/telestion-client/compare/v0.15.0...v0.15.1) (2021-06-03)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.15.0](https://github.com/wuespace/telestion-client/compare/v0.14.1...v0.15.0) (2021-06-03)

**Note:** Version bump only for package @wuespace/telestion-client-cli





### [0.14.1](https://github.com/wuespace/telestion-client/compare/v0.14.0...v0.14.1) (2021-05-10)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.14.0](https://github.com/wuespace/telestion-client/compare/v0.13.0...v0.14.0) (2021-05-01)


### Features

* **cli:** Add `skipGit` option to the `tc-cli init` command for telestion-project-template based projects ([fce07a8](https://github.com/wuespace/telestion-client/commit/fce07a8204ade2321af0dbd82fc1b66c95a97f35))
* **cli:** Add support for projects based on the new telestion-project-template structure (the CLI will auto-detect the structure and follow the directory structure accordingly) ([759748b](https://github.com/wuespace/telestion-client/commit/759748ba0136cfa2e4ebb986594d4fb3982039c8))
* **cli:** Reword `init-epilogue` ([5e98003](https://github.com/wuespace/telestion-client/commit/5e980033fc1ef0a0f24444fc2534ffff35a902aa))


### Bug Fixes

* **cli:** Fix install command to work with new telestion-project-template structure ([a2956c5](https://github.com/wuespace/telestion-client/commit/a2956c5587da5fde709ef605eb0ae533264dca56))
* **cli:** Fix problem where `pretty-quick` hook was not generated when initializing a new repository ([b1c8ce0](https://github.com/wuespace/telestion-client/commit/b1c8ce00a87f7d6c8ec6e9b88af011412e330183))



## [0.13.0](https://github.com/wuespace/telestion-client/compare/v0.12.1...v0.13.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* If you referenced the npm packages via GitHub, please update your paths accordingly.

### Features

* Move GitHub Repository from TelestionTeam Organization to wuespace Organization ([da19ea3](https://github.com/wuespace/telestion-client/commit/da19ea34cfcff0ea5b2f950844550ae7f8dfb6c5))



### [0.12.1](https://github.com/wuespace/telestion-client/compare/v0.12.0...v0.12.1) (2021-04-09)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.12.0](https://github.com/wuespace/telestion-client/compare/v0.11.2...v0.12.0) (2021-04-08)


### ⚠ BREAKING CHANGES

* The minimum required node version for all packages is now Node v14!

### Features

* Specify minimum node version in all packages and update workflows to use npm v7 as default ([b727223](https://github.com/wuespace/telestion-client/commit/b72722326ce8b88f42ad2c16ddbd60991e2c8b72))


### Bug Fixes

* **cli:** Init: npm install command to be compatible with npm v7 ([c81b35e](https://github.com/wuespace/telestion-client/commit/c81b35e27fe9bbdcdc82498701a3fd3cb59bba18))



### [0.11.2](https://github.com/wuespace/telestion-client/compare/v0.11.1...v0.11.2) (2021-03-09)

**Note:** Version bump only for package @wuespace/telestion-client-cli





### [0.11.1](https://github.com/wuespace/telestion-client/compare/v0.11.0...v0.11.1) (2021-03-01)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.11.0](https://github.com/wuespace/telestion-client/compare/v0.10.1...v0.11.0) (2021-02-28)

**Note:** Version bump only for package @wuespace/telestion-client-cli





### [0.10.1](https://github.com/wuespace/telestion-client/compare/v0.10.0...v0.10.1) (2021-02-27)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.10.0](https://github.com/wuespace/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.9.0](https://github.com/wuespace/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.8.0](https://github.com/wuespace/telestion-client/compare/v0.7.1...v0.8.0) (2021-02-08)


### ⚠ BREAKING CHANGES

* **cli:** PSC's now require a `telestion.config.js` file in the PSC's root directory (next to the `package.json`).

  To migrate PSCs generated with older versions of the CLI, please add a `telestion.config.js` file with the following content into the root PSC directory, next to the `package.json`:
  ```js
  module.exports = {}
  ```

### Features

* **cli:** `tc-cli build` command implementation ([6de3183](https://github.com/wuespace/telestion-client/commit/6de318393c2713a16510ecd07b56cdea22953288)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)
* **cli:** Add configuration file parsing to the CLI ([f2760e3](https://github.com/wuespace/telestion-client/commit/f2760e3f0c377c2cc9c9b409d71460db68927581))
* **cli:** Add Electron Main Process Plugin system ([05ba70c](https://github.com/wuespace/telestion-client/commit/05ba70c6aa67153b31422d49e2f4603d57ac168d))
* **cli:** Compile and run the actual Electron app and use Craco in `tc-cli start --electron` ([05ee18b](https://github.com/wuespace/telestion-client/commit/05ee18b752515838d6d53f6a64d682a775e3de50))
* **cli:** Expose programmatic APIs for common CLI lib functions ([d266ad0](https://github.com/wuespace/telestion-client/commit/d266ad0da902774a0c62b33725bbf731d90a9ecd))
* **cli:** Show files generated by electron-builder in `tc-cli build` ([b1fbd3d](https://github.com/wuespace/telestion-client/commit/b1fbd3dd949c328853fba9add1d5b5b734c40328))


### Bug Fixes

* **cli:** Stop output `'DEBUG: '` for debug log entries ([1b57547](https://github.com/wuespace/telestion-client/commit/1b57547d1a0d05e00c409fd90f136dc302492d45))
* **deps:** Remove no-longer needed webpack-dev-server dependency from CLI ([d91dd48](https://github.com/wuespace/telestion-client/commit/d91dd4888c838fbd750ba32895e5d7d9885e0e13))


### Documentation Changes

* WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/wuespace/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
* **cli:** Add better code documentation for the `tc-cli build` library functions ([de37093](https://github.com/wuespace/telestion-client/commit/de37093f64be5225cb0a864ff4ee4c3fe20e7f16))
* **cli:** Improve wording in console output, doc comments, and function names ([e22e365](https://github.com/wuespace/telestion-client/commit/e22e36545f55d0b37dabfd3221b26873764493d9))
* **cli:** Update the package's README.md ([6b54f6f](https://github.com/wuespace/telestion-client/commit/6b54f6fb40dc15e632dadaaaa77d910f567d5278))



### [0.7.1](https://github.com/wuespace/telestion-client/compare/v0.7.0...v0.7.1) (2021-02-06)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.7.0](https://github.com/wuespace/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)


### ⚠ BREAKING CHANGES

* **cli:** Before, running `tc-cli start` opened the PSC as an Electron app, by default. To replicate this behavior, you'll now have to pass the `--electron` or `-e` argument to the command.

In summary, replace `tc-cli start` with `tc-cli start -e` to keep the same behavior.

### Features

* **cli:** Add option to open the PSC in either an Electron window or a browser in `tc-cli start` ([5fd359c](https://github.com/wuespace/telestion-client/commit/5fd359c6d5e04208be15c41e37a9c1612eb463b0))


### Bug Fixes

* **cli:** Add files before commiting the initial commit in `tc-cli init` ([8e0ac3c](https://github.com/wuespace/telestion-client/commit/8e0ac3c6963e79c3606283151a9bfcacc465a7b7))
* **cli:** Fix `TypeError: Cannot read property 'message' of undefined` in `tc-cli init` command ([6f4d1a3](https://github.com/wuespace/telestion-client/commit/6f4d1a376210f8ec368f1ad80f8b2f09bcf9d6f8))
* **cli:** In `tc-cli stats`, fix reverted json to non-json output behavior. ([c2451c6](https://github.com/wuespace/telestion-client/commit/c2451c6b4df1b998304aed80cdded8f5331ec17f))



### [0.6.1](https://github.com/wuespace/telestion-client/compare/v0.6.0...v0.6.1) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.6.0](https://github.com/wuespace/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.5.0](https://github.com/wuespace/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.4.0](https://github.com/wuespace/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)


### ⚠ BREAKING CHANGES

* **cli:** For previously generated PSCs to work with the new CLI, the // IMPORT_INSERT_MARK and // ARRAY_FIRST_ELEMENT_INSERT_MARK comments have to retrospectively be placed below all imports and at the beginning of the projectWidgets array, respectively

### Features

* **cli:** Add `tc-cli docs` to open the telestion-client documentation page ([85a2e03](https://github.com/wuespace/telestion-client/commit/85a2e03f05bf0bdd3887240339a8a15912ea8dd2))
* **cli:** Add `tc-cli generate widget` command ([4305e09](https://github.com/wuespace/telestion-client/commit/4305e09d45204607bba7fa7fd41360824ce2b112)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)
* **cli:** Add `tc-cli stats` command implementation ([#279](https://github.com/wuespace/telestion-client/issues/279)) ([35dbf26](https://github.com/wuespace/telestion-client/commit/35dbf263f820a01deff7a9cf228ba44abf6aaeb3)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)


### Bug Fixes

* **cli:** Fix `tc-cli generate` command (and subsequent, broken, CLI) ([a2a25fc](https://github.com/wuespace/telestion-client/commit/a2a25fc9770835b43ea289a8c3006384c42ec3d0))



## 0.3.4 (2021-02-04)

**Note:** Version bump only for package @wuespace/telestion-client-cli





## [0.3.3](https://github.com/wuespace/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-cli

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-cli

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-cli
