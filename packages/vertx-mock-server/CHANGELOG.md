# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.15.0](https://github.com/wuespace/telestion-client/compare/v0.14.1...v0.15.0) (2021-06-03)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.14.0](https://github.com/wuespace/telestion-client/compare/v0.13.0...v0.14.0) (2021-05-01)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.13.0](https://github.com/wuespace/telestion-client/compare/v0.12.1...v0.13.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* If you referenced the npm packages via GitHub, please update your paths accordingly.

### Features

* Move GitHub Repository from TelestionTeam Organization to wuespace Organization ([da19ea3](https://github.com/wuespace/telestion-client/commit/da19ea34cfcff0ea5b2f950844550ae7f8dfb6c5))



### [0.12.1](https://github.com/wuespace/telestion-client/compare/v0.12.0...v0.12.1) (2021-04-09)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.12.0](https://github.com/wuespace/telestion-client/compare/v0.11.2...v0.12.0) (2021-04-08)


### ⚠ BREAKING CHANGES

* The minimum required node version for all packages is now Node v14!
* **mock-server:** The listen function now requires an object as argument which contains the port and hostname as properties.
* **mock-server:** The event bus and http server instance properties are now marked private. Please use the provided abstractions and hooks instead. (see onInit, send, handle, register, etc.)

### Features

* Specify minimum node version in all packages and update workflows to use npm v7 as default ([b727223](https://github.com/wuespace/telestion-client/commit/b72722326ce8b88f42ad2c16ddbd60991e2c8b72))
* **mock-server:** Add close function ([3e0b5a8](https://github.com/wuespace/telestion-client/commit/3e0b5a8c704e45911e7c17cd762cc082dbb7900f))
* **mock-server:** Add logger option to constructor and clean up some internals ([cefceae](https://github.com/wuespace/telestion-client/commit/cefceaeb1c76cc0fc8a5c72b4d92c1911b47da63))
* **mock-server:** Add protected method to get all connections ([cf9e267](https://github.com/wuespace/telestion-client/commit/cf9e2677baa92fe7822a5f5cbc37ec29b7130da5))
* **mock-server:** First full implementation ([7461df5](https://github.com/wuespace/telestion-client/commit/7461df52eccaad3740b80a5c0fcc871704b72d42))


### Bug Fixes

* **mock-server:** Fix breaking changes ([eab07d3](https://github.com/wuespace/telestion-client/commit/eab07d33567cb8c2bd759083dd2e5c2db6a4d9b6))


### Documentation Changes

* **mock-server:** Document all methods ([e0127e5](https://github.com/wuespace/telestion-client/commit/e0127e5b2e393d8d321e474b1eb47362cd24e98d))



## [0.11.0](https://github.com/wuespace/telestion-client/compare/v0.10.1...v0.11.0) (2021-02-28)

**Note:** Version bump only for package @wuespace/vertx-mock-server





### [0.10.1](https://github.com/wuespace/telestion-client/compare/v0.10.0...v0.10.1) (2021-02-27)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.10.0](https://github.com/wuespace/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.9.0](https://github.com/wuespace/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)


### Features

* **mock-server:** Make event bus and http server instances protected so extending classes can use them ([9c6f6ff](https://github.com/wuespace/telestion-client/commit/9c6f6ff84d794559d54ae5f362ce4befe0ecec30))
* **mock-server:** The prefix and the hostname are now customizable ([467187d](https://github.com/wuespace/telestion-client/commit/467187d380adf62f5e43afa1c7006f56591970f2))


### Bug Fixes

* **mock-server:** The SockJS instance now uses the right prefix ([3192dd3](https://github.com/wuespace/telestion-client/commit/3192dd3b3825fc88f9e21e66740fc2b866f45c5f))



## [0.8.0](https://github.com/wuespace/telestion-client/compare/v0.7.1...v0.8.0) (2021-02-08)


### Documentation Changes

* WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/wuespace/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
* **mock-server:** Update the package's README.md ([035bfe6](https://github.com/wuespace/telestion-client/commit/035bfe62219a387e0abb02ac77aaaaaf148326dc))



## [0.7.0](https://github.com/wuespace/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.6.0](https://github.com/wuespace/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.5.0](https://github.com/wuespace/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.4.0](https://github.com/wuespace/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## 0.3.4 (2021-02-04)

**Note:** Version bump only for package @wuespace/vertx-mock-server





## [0.3.3](https://github.com/wuespace/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package @wuespace/vertx-mock-server

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package @wuespace/vertx-mock-server

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package @wuespace/vertx-mock-server
