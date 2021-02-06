# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [0.7.1](https://github.com/TelestionTeam/telestion-client/compare/v0.7.0...v0.7.1) (2021-02-06)


### Bug Fixes

* **common:** Type Error in login description component ([ae8b07c](https://github.com/TelestionTeam/telestion-client/commit/ae8b07c719ac78e9c935d4712827ce644e4eb3a7)), closes [#303](https://github.com/TelestionTeam/telestion-client/issues/303)



## [0.7.0](https://github.com/TelestionTeam/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)


### ⚠ BREAKING CHANGES

* **cli:** Before, running `tc-cli start` opened the PSC as an Electron app, by default. To replicate this behavior, you'll now have to pass the `--electron` or `-e` argument to the command.

In summary, replace `tc-cli start` with `tc-cli start -e` to keep the same behavior.

### Features

* **cli:** Add option to open the PSC in either an Electron window or a browser in `tc-cli start` ([5fd359c](https://github.com/TelestionTeam/telestion-client/commit/5fd359c6d5e04208be15c41e37a9c1612eb463b0))
* **template:** Adjust PSC template's npm scripts to accommodate for new `tc-cli start` behavior ([95bc391](https://github.com/TelestionTeam/telestion-client/commit/95bc3915bc61253f94f250b563faa68a456a33c9))


### Bug Fixes

* **cli:** Add files before commiting the initial commit in `tc-cli init` ([8e0ac3c](https://github.com/TelestionTeam/telestion-client/commit/8e0ac3c6963e79c3606283151a9bfcacc465a7b7))
* **cli:** Fix `TypeError: Cannot read property 'message' of undefined` in `tc-cli init` command ([6f4d1a3](https://github.com/TelestionTeam/telestion-client/commit/6f4d1a376210f8ec368f1ad80f8b2f09bcf9d6f8))
* **cli:** In `tc-cli stats`, fix reverted json to non-json output behavior. ([c2451c6](https://github.com/TelestionTeam/telestion-client/commit/c2451c6b4df1b998304aed80cdded8f5331ec17f))


### Documentation Changes

* **common:** Add reference to props ([0083f67](https://github.com/TelestionTeam/telestion-client/commit/0083f67f8a18a847993808f830d6454fe32b8505))
* **common:** Apply more suggestions from code review ([62754fa](https://github.com/TelestionTeam/telestion-client/commit/62754fa6c2604584ade2bed8b94424787f561066))
* **common:** Apply suggestions from code review ([c0923c8](https://github.com/TelestionTeam/telestion-client/commit/c0923c8e53354b6673b38ce9b28e13dac1f91f28))
* **common:** Document all page components ([e3400f7](https://github.com/TelestionTeam/telestion-client/commit/e3400f7780b3ad7b1c2b95fc2da95e9ecabcd879))
* **common:** Document the account controls component ([859c640](https://github.com/TelestionTeam/telestion-client/commit/859c640576b7cb87774c6f0e0801824a79a234fd))
* **common:** Document the action divider component ([b9a4cd1](https://github.com/TelestionTeam/telestion-client/commit/b9a4cd15908c0de3c3df1af4507f9e8c7394c3e7))
* **common:** Document the avatar button component ([8c99c96](https://github.com/TelestionTeam/telestion-client/commit/8c99c96edc812535ddb84d49e3ad3277677347be))
* **common:** Document the avatar menu component ([765bfb1](https://github.com/TelestionTeam/telestion-client/commit/765bfb17ab65fef6b81023a09e4895fc909d86a6))
* **common:** Document the color scheme action component ([10db0be](https://github.com/TelestionTeam/telestion-client/commit/10db0be6651a3d810fdb5c242758b9c7d9debb40))
* **common:** Document the dashboard component ([79dc52b](https://github.com/TelestionTeam/telestion-client/commit/79dc52bc72767a0fef43425c875e3e020145b7bb))
* **common:** Document the dashboard picker component ([2d98394](https://github.com/TelestionTeam/telestion-client/commit/2d98394db9ddeb15c2a716193bd2d38d1885c854))
* **common:** Document the fullscreen action component ([c505c16](https://github.com/TelestionTeam/telestion-client/commit/c505c16b0a5e8b4b23848ea9e7950e5edde027a3))
* **common:** Document the header actions component ([497c7bd](https://github.com/TelestionTeam/telestion-client/commit/497c7bd3888002afa34ab38c959e9ee66e150bb1))
* **common:** Document the no dashboards message component ([2b0c005](https://github.com/TelestionTeam/telestion-client/commit/2b0c00594559630a689c1d11dcbe7bea9cf52d70))
* **common:** Document the not found message component ([9dee2d3](https://github.com/TelestionTeam/telestion-client/commit/9dee2d3d3af3ea46c02a1597baed0dc353dc321a))
* **common:** Document the notification action component ([0cedf76](https://github.com/TelestionTeam/telestion-client/commit/0cedf768cd443ef4fec15b7b103c4432960e3a5f))
* **common:** Document the overflow fix component ([db0ea7b](https://github.com/TelestionTeam/telestion-client/commit/db0ea7b9f2525e327559e9b9695ed85dba57f08c))
* **common:** Document the status dialog component ([831db05](https://github.com/TelestionTeam/telestion-client/commit/831db056c1e3a19ffde11787b1f0b1c9f81c860b))
* **common:** Document the use dashboard state hook ([8309e3c](https://github.com/TelestionTeam/telestion-client/commit/8309e3cfe1c15b8dacd5b0ad1dbc4f3086e51e1c))
* **common:** Document the use nav bar state hook ([9b0a9b1](https://github.com/TelestionTeam/telestion-client/commit/9b0a9b1184d2584949cc0b875eda0775ccacc8c8))
* **common:** Document the use status hook ([cb7e052](https://github.com/TelestionTeam/telestion-client/commit/cb7e052b3f182d869a0d28283e6f46d3bdd82f28))
* **common:** Document the widget error message component ([2fab124](https://github.com/TelestionTeam/telestion-client/commit/2fab124da7716de0da51027a2709473a0607541f))
* **common:** Document the widget renderer component ([d88e2ad](https://github.com/TelestionTeam/telestion-client/commit/d88e2ad02390e32f2332a48c480695f83af1f6eb))



### [0.6.1](https://github.com/TelestionTeam/telestion-client/compare/v0.6.0...v0.6.1) (2021-02-05)


### Bug Fixes

* Fix custom login page implementation in both template and documentation ([715e27c](https://github.com/TelestionTeam/telestion-client/commit/715e27c04dd20aa8bffb589ac67d6e8d77d7fb26)), closes [#290](https://github.com/TelestionTeam/telestion-client/issues/290) [#292](https://github.com/TelestionTeam/telestion-client/issues/292)



## [0.6.0](https://github.com/TelestionTeam/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)


### Features

* **common:** Divide login page into compound components for better usability ([7e2112d](https://github.com/TelestionTeam/telestion-client/commit/7e2112d3aa0f1b7e418a4d6089a08c5ee0650149))
* **common:** Make initial values for text fields in login form accessible for project ([204e947](https://github.com/TelestionTeam/telestion-client/commit/204e947830f95aa6f6663ba428bf4e3c3b6ca757))
* **template:** Add refactor recommendation for login page as default to the template ([c59697e](https://github.com/TelestionTeam/telestion-client/commit/c59697eb04741bee15de9e1158b6f7932cbe0448))


### Documentation Changes

* **common:** Apply suggestions from code review for login page ([12b8af7](https://github.com/TelestionTeam/telestion-client/commit/12b8af779d77f3057af54f63af195bcdb6753902))
* **common:** Document internal form component for the login page ([602fe16](https://github.com/TelestionTeam/telestion-client/commit/602fe16432da3f994fc971c14dd2ee54377ef071)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document login button component for the login page ([72de6a9](https://github.com/TelestionTeam/telestion-client/commit/72de6a9cccf76470cf6149f38e23e53861cf6ab2)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document login description component for the login page ([953ad14](https://github.com/TelestionTeam/telestion-client/commit/953ad14a778d4aa29b313f267a2c786358523bf6)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document login form component for the login page ([b1005bf](https://github.com/TelestionTeam/telestion-client/commit/b1005bf4a54666508bda52e33c4623d6dee9212a)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document login logo component for the login page ([635cf66](https://github.com/TelestionTeam/telestion-client/commit/635cf66ca0041e7b8710ddb936994ee86f6f9245)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document login title component for the login page ([c080799](https://github.com/TelestionTeam/telestion-client/commit/c080799c77d054246b7c0846db2bad01b3bca092)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document text field component for the login page ([6315ae5](https://github.com/TelestionTeam/telestion-client/commit/6315ae53ea0c09d8eb2ca62831b5246a0e19d44e)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)
* **common:** Document the login page ([f6f7664](https://github.com/TelestionTeam/telestion-client/commit/f6f766489d253afacc8162ff49eb587f53a7a5e1)), closes [#272](https://github.com/TelestionTeam/telestion-client/issues/272)



## [0.5.0](https://github.com/TelestionTeam/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)


### Features

* **common:** Add hook for managing dependency timeouts ([6684ede](https://github.com/TelestionTeam/telestion-client/commit/6684ede2d10a08ffe5e5f66ce867a564f6ed24f4)), closes [#261](https://github.com/TelestionTeam/telestion-client/issues/261)
* **common:** Add Loading Indicator component as helper for loading widgets ([efcf36c](https://github.com/TelestionTeam/telestion-client/commit/efcf36cc1bc3c36b954b16835dc7c4e568f90454)), closes [#261](https://github.com/TelestionTeam/telestion-client/issues/261)



## [0.4.0](https://github.com/TelestionTeam/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)


### ⚠ BREAKING CHANGES

* **cli:** For previously generated PSCs to work with the new CLI, the // IMPORT_INSERT_MARK and // ARRAY_FIRST_ELEMENT_INSERT_MARK comments have to retrospectively be placed below all imports and at the beginning of the projectWidgets array, respectively
* **event-bus:** The types for the event bus are now accessible in the @wuespace/telestion-client-types package.

### Features

* **cli:** Add `tc-cli docs` to open the telestion-client documentation page ([85a2e03](https://github.com/TelestionTeam/telestion-client/commit/85a2e03f05bf0bdd3887240339a8a15912ea8dd2))
* **cli:** Add `tc-cli generate widget` command ([4305e09](https://github.com/TelestionTeam/telestion-client/commit/4305e09d45204607bba7fa7fd41360824ce2b112)), closes [#263](https://github.com/TelestionTeam/telestion-client/issues/263)
* **cli:** Add `tc-cli stats` command implementation ([#279](https://github.com/TelestionTeam/telestion-client/issues/279)) ([35dbf26](https://github.com/TelestionTeam/telestion-client/commit/35dbf263f820a01deff7a9cf228ba44abf6aaeb3)), closes [#263](https://github.com/TelestionTeam/telestion-client/issues/263)
* **core:** Returned data of event bus abstraction hooks now typable and update documentation ([3b12717](https://github.com/TelestionTeam/telestion-client/commit/3b127176f6d87f64463362eac57c8bb993a4ab04))
* **event-bus:** Remove types and import them from types package instead ([40788b2](https://github.com/TelestionTeam/telestion-client/commit/40788b251dc4dc3060a414092b75eb069cde7438))
* **template:** Add npm scripts and local CLI instance to template ([4c7c503](https://github.com/TelestionTeam/telestion-client/commit/4c7c5035d833d886a6b73fdff268227279ffb669))
* **types:** Add channel address as type and integrate it into message types ([b9569d7](https://github.com/TelestionTeam/telestion-client/commit/b9569d736ca52672516031ace56d1dd8c1aa3b98))
* **types:** Import types from vertx-event-bus ([90fd513](https://github.com/TelestionTeam/telestion-client/commit/90fd513937a2cb628bc15b120ea88ffff11b8e01))


### Bug Fixes

* **cli:** Fix `tc-cli generate` command (and subsequent, broken, CLI) ([a2a25fc](https://github.com/TelestionTeam/telestion-client/commit/a2a25fc9770835b43ea289a8c3006384c42ec3d0))
* **core:** Small type change in implementation for callback in event bus abstraction hooks ([1277d8f](https://github.com/TelestionTeam/telestion-client/commit/1277d8f8895be913bcb72f68dc73df2137036daa))
* **template:** Add .eslintcache to template gitignore ([ccd9c35](https://github.com/TelestionTeam/telestion-client/commit/ccd9c358bf76da0f02368728ac3ccd688033b571))
* **template:** Add React Spectrum Tabs dependency ([ff8a30e](https://github.com/TelestionTeam/telestion-client/commit/ff8a30e41b8c64cac7469643dec17fc2323f80a9))
* **types:** Change type definition for Json serializable data from Map to mapped object ([3fff598](https://github.com/TelestionTeam/telestion-client/commit/3fff59873ca7f6f17af86cda3004eca7cf38d08e))



## 0.3.4 (2021-02-04)

**Note:** Version bump only for package telestion-client





## [0.3.3](https://github.com/TelestionTeam/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package telestion-client

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package telestion-client

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package telestion-client
