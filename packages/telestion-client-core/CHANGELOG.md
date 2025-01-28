# Change Log

## 0.19.0

### Minor Changes

- Move the monorepo build tooling to Parcel/`pnpm`

  This primarily affects the development within the `telestion-client` monorepo and shouldn't affect available APIs (unless otherwise specified in the changelog).

  It might, however, cause changes in the resulting format of the distributed files.

### Patch Changes

- Remove Storybook-based component playground and documentation

  While we are looking into providing alternatives, we had to remove our Storybook-based component playground/documentation due to tooling incompatibilities.

  This includes the documentation on https://www.chromatic.com/library?appId=60798741f4e7dc0021585c53 and any Chromatic-/Storybook-based tests.

- Update `zustand` to v4

  This leads to typing changes in the stores. The `zustand` API is still the same.

  What was previously typed as `Store<T>` is now typed as `BoundStore<StoreApi<T>>`.

- Update ecosystem dependencies

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.18.0](https://github.com/wuespace/telestion-client/compare/v0.17.0...v0.18.0) (2022-01-28)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.17.0](https://github.com/wuespace/telestion-client/compare/v0.16.1...v0.17.0) (2021-06-25)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.16.0](https://github.com/wuespace/telestion-client/compare/v0.15.1...v0.16.0) (2021-06-23)

**Note:** Version bump only for package @wuespace/telestion-client-core

### [0.15.1](https://github.com/wuespace/telestion-client/compare/v0.15.0...v0.15.1) (2021-06-03)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.15.0](https://github.com/wuespace/telestion-client/compare/v0.14.1...v0.15.0) (2021-06-03)

### ⚠ BREAKING CHANGES

- **core:** The `AuthRoute` and `UnAuthRoute` components do no longer exist. Please use the attached routing object on the Page Component instead. _Mostly likely this won't affect you, if you don't immediately understand, what this means. Otherwise feel free to ignore it._ :wink:

### Bug Fixes

- **core:** Clean up the page renderer so that routes are direct child components of the switch. ([05875a2](https://github.com/wuespace/telestion-client/commit/05875a2169690ccd8fcc36e99891297341b66ab9))

### [0.14.1](https://github.com/wuespace/telestion-client/compare/v0.14.0...v0.14.1) (2021-05-10)

### Bug Fixes

- **core:** Sign in function in auth state not testing for same username ([df92f61](https://github.com/wuespace/telestion-client/commit/df92f6122b0a6f128a70c0b69341f4657086dd7e))
- **core:** Specify return type of set preference value function more precisely ([18a565c](https://github.com/wuespace/telestion-client/commit/18a565c536abd0b257f0127298c48ce0c3ea07fc))

## [0.14.0](https://github.com/wuespace/telestion-client/compare/v0.13.0...v0.14.0) (2021-05-01)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.13.0](https://github.com/wuespace/telestion-client/compare/v0.12.1...v0.13.0) (2021-04-16)

### ⚠ BREAKING CHANGES

- If you referenced the npm packages via GitHub, please update your paths accordingly.

### Features

- Move GitHub Repository from TelestionTeam Organization to wuespace Organization ([da19ea3](https://github.com/wuespace/telestion-client/commit/da19ea34cfcff0ea5b2f950844550ae7f8dfb6c5))

### [0.12.1](https://github.com/wuespace/telestion-client/compare/v0.12.0...v0.12.1) (2021-04-09)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.12.0](https://github.com/wuespace/telestion-client/compare/v0.11.2...v0.12.0) (2021-04-08)

### ⚠ BREAKING CHANGES

- The minimum required node version for all packages is now Node v14!

### Features

- Specify minimum node version in all packages and update workflows to use npm v7 as default ([b727223](https://github.com/wuespace/telestion-client/commit/b72722326ce8b88f42ad2c16ddbd60991e2c8b72))

### Bug Fixes

- **core:** Fix breaking changes ([b6551c3](https://github.com/wuespace/telestion-client/commit/b6551c3c388db5bf78da385a1a52d8f526f04970))

### [0.11.2](https://github.com/wuespace/telestion-client/compare/v0.11.1...v0.11.2) (2021-03-09)

**Note:** Version bump only for package @wuespace/telestion-client-core

### [0.11.1](https://github.com/wuespace/telestion-client/compare/v0.11.0...v0.11.1) (2021-03-01)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.11.0](https://github.com/wuespace/telestion-client/compare/v0.10.1...v0.11.0) (2021-02-28)

**Note:** Version bump only for package @wuespace/telestion-client-core

### [0.10.1](https://github.com/wuespace/telestion-client/compare/v0.10.0...v0.10.1) (2021-02-27)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.10.0](https://github.com/wuespace/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)

### Documentation Changes

- Document new storybook-internal component folders in package `README.md`s ([89e8754](https://github.com/wuespace/telestion-client/commit/89e8754a8ee9501fd5da0c6eaac0e19a87ba085e))
- **common:** Improve storybook stories ([1cd24d1](https://github.com/wuespace/telestion-client/commit/1cd24d1842d981d4dae026092062520d84b2672f))
- **core:** Improve storybook stories for `TelestionClient` ([dfdc8e1](https://github.com/wuespace/telestion-client/commit/dfdc8e1c04a914dd753793623f9cc51fa49cfaa3))

## [0.9.0](https://github.com/wuespace/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.8.0](https://github.com/wuespace/telestion-client/compare/v0.7.1...v0.8.0) (2021-02-08)

### Documentation Changes

- WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/wuespace/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
- **core:** Update the package's README.md ([f36fd06](https://github.com/wuespace/telestion-client/commit/f36fd06cf06f631829656fb71e25b33d6502a994))

## [0.7.0](https://github.com/wuespace/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.6.0](https://github.com/wuespace/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.5.0](https://github.com/wuespace/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.4.0](https://github.com/wuespace/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)

### Features

- **core:** Returned data of event bus abstraction hooks now typable and update documentation ([3b12717](https://github.com/wuespace/telestion-client/commit/3b127176f6d87f64463362eac57c8bb993a4ab04))

### Bug Fixes

- **core:** Small type change in implementation for callback in event bus abstraction hooks ([1277d8f](https://github.com/wuespace/telestion-client/commit/1277d8f8895be913bcb72f68dc73df2137036daa))

## 0.3.4 (2021-02-04)

**Note:** Version bump only for package @wuespace/telestion-client-core

## [0.3.3](https://github.com/wuespace/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-core

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-core

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-core
