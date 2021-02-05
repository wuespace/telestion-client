# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
