# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.10.0](https://github.com/TelestionTeam/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)


### Features

* **common:** Add `overrideState` to `ConnectionIndicator` for debugging purposes ([92492fa](https://github.com/TelestionTeam/telestion-client/commit/92492faaa32a90595e3f511b6affdf62d4df23a3))


### Bug Fixes

* **common:** Fix Dashboard rendering issues ([73afae2](https://github.com/TelestionTeam/telestion-client/commit/73afae2104247843cd81fce6742cc41d4a59148c))


### Documentation Changes

* Add template CSS rules to Storybook stories ([ab41e1c](https://github.com/TelestionTeam/telestion-client/commit/ab41e1cd596e8f64963eb4410b3333e2297a54c0))
* Document new storybook-internal component folders in package `README.md`s ([89e8754](https://github.com/TelestionTeam/telestion-client/commit/89e8754a8ee9501fd5da0c6eaac0e19a87ba085e))
* Improve storybook stories ([4b662bf](https://github.com/TelestionTeam/telestion-client/commit/4b662bf12e60b6217e9487dee7bf45dc0940198b))
* **common:** Add storybook stories for `AccountControls` and `NavBar` ([b6c73d5](https://github.com/TelestionTeam/telestion-client/commit/b6c73d56dd62eb2f198e71cf08c998fbf77bd013))
* **common:** Add storybook stories for `Actions`, `NotificationAction`, `ColorSchemeAction`, `FullscreenAction`, and `ActionDivider`. ([ea47787](https://github.com/TelestionTeam/telestion-client/commit/ea4778767db4ddf0bd15d1565adf21fa316627b8))
* **common:** Add storybook stories for `CommonWrapper` and `AppLogo` ([29b408c](https://github.com/TelestionTeam/telestion-client/commit/29b408c0398666ce54e87e6fb5f23ce7f6e9c202))
* **common:** Add storybook stories for `ConnectionIndicator` ([346096a](https://github.com/TelestionTeam/telestion-client/commit/346096a3fa664b62d036f4e3ab73bb9d05fc0c6a))
* **common:** Add storybook stories for `DashboardPicker` ([5aab481](https://github.com/TelestionTeam/telestion-client/commit/5aab481a8736271c0c74e3b79f42a5fa2d406f1b))
* **common:** Add storybook stories for `Header` ([2574afa](https://github.com/TelestionTeam/telestion-client/commit/2574afa6b921b5156fe065d8f9214f8e3ec941e6))
* **common:** Fix storybook stories for `AccountControls` ([ce373af](https://github.com/TelestionTeam/telestion-client/commit/ce373af071603c30998c46809fb50ac7b8709c52))
* **common:** Fix storybook stories for `AccountControls` and `NavBar` ([4edd201](https://github.com/TelestionTeam/telestion-client/commit/4edd2016490588cefd83c64a66d1a38a882dec0c))
* **common:** Fix storybook stories for `Actions` ([476607c](https://github.com/TelestionTeam/telestion-client/commit/476607c8ee0800af4458a766059b36b8aed3c27a))
* **common:** Improve storybook stories ([1cd24d1](https://github.com/TelestionTeam/telestion-client/commit/1cd24d1842d981d4dae026092062520d84b2672f))
* **core:** Add storybook stories for `DashboardPage`, `LoginPage`, and `NotFoundPage` ([7c38682](https://github.com/TelestionTeam/telestion-client/commit/7c38682d7fb88a59146434463a5e0400d6d1f1a2))
* **core:** Add storybook stories for `LoadingIndicator` ([ebb96ce](https://github.com/TelestionTeam/telestion-client/commit/ebb96cebc79efa81871d4c7460c7c9d916f97564))
* **core:** Add storybook stories for `LoginDescription`, `LoginForm`, `LoginLogo`, and `LoginTitle` ([69c8c4a](https://github.com/TelestionTeam/telestion-client/commit/69c8c4a59a9b1292ddec9e15f5b7b7b8127e4e61))
* **core:** Improve storybook stories for `TelestionClient` ([dfdc8e1](https://github.com/TelestionTeam/telestion-client/commit/dfdc8e1c04a914dd753793623f9cc51fa49cfaa3))



## [0.9.0](https://github.com/TelestionTeam/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)


### Features

* **mock-server:** Make event bus and http server instances protected so extending classes can use them ([9c6f6ff](https://github.com/TelestionTeam/telestion-client/commit/9c6f6ff84d794559d54ae5f362ce4befe0ecec30))
* **mock-server:** The prefix and the hostname are now customizable ([467187d](https://github.com/TelestionTeam/telestion-client/commit/467187d380adf62f5e43afa1c7006f56591970f2))


### Bug Fixes

* **mock-server:** The SockJS instance now uses the right prefix ([3192dd3](https://github.com/TelestionTeam/telestion-client/commit/3192dd3b3825fc88f9e21e66740fc2b866f45c5f))
* **template:** Add browserslist to package.json to allow immediate start of development build ([0cf4d47](https://github.com/TelestionTeam/telestion-client/commit/0cf4d4702a93fb41cc5fc9deeaafc272aa3c4c7c))



## [0.8.0](https://github.com/TelestionTeam/telestion-client/compare/v0.7.1...v0.8.0) (2021-02-08)


### ⚠ BREAKING CHANGES

* **template:** While, in and of itself, this doesn't constitute a breaking change, issues may arise in PSCs generated using the template before this change. This is why we want to bring special attention to it.

  To fix PSCs generated before with versions prior to this, add the following property to the PSC's `package.json`:

  ```json
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  }
  ```

  You won't have to do this steps for PSCs generated with the new version.
* **cli:** PSC's now require a `telestion.config.js` file in the PSC's root directory (next to the `package.json`).

  To migrate PSCs generated with older versions of the CLI, please add a `telestion.config.js` file with the following content into the root PSC directory, next to the `package.json`:
  ```js
  module.exports = {}
  ```
* **template:** Setting the `homepage` to `'.'` is required for building native applications from PSC projects using `tc-cli build`. For projects generated before this change, please manually add the following line to your PSC's `package.json`:
```json
"homepage": "."
```

### Features

* **cli:** `tc-cli build` command implementation ([6de3183](https://github.com/TelestionTeam/telestion-client/commit/6de318393c2713a16510ecd07b56cdea22953288)), closes [#263](https://github.com/TelestionTeam/telestion-client/issues/263)
* **cli:** Add configuration file parsing to the CLI ([f2760e3](https://github.com/TelestionTeam/telestion-client/commit/f2760e3f0c377c2cc9c9b409d71460db68927581))
* **cli:** Add Electron Main Process Plugin system ([05ba70c](https://github.com/TelestionTeam/telestion-client/commit/05ba70c6aa67153b31422d49e2f4603d57ac168d))
* **cli:** Compile and run the actual Electron app and use Craco in `tc-cli start --electron` ([05ee18b](https://github.com/TelestionTeam/telestion-client/commit/05ee18b752515838d6d53f6a64d682a775e3de50))
* **cli:** Expose programmatic APIs for common CLI lib functions ([d266ad0](https://github.com/TelestionTeam/telestion-client/commit/d266ad0da902774a0c62b33725bbf731d90a9ecd))
* **cli:** Show files generated by electron-builder in `tc-cli build` ([b1fbd3d](https://github.com/TelestionTeam/telestion-client/commit/b1fbd3dd949c328853fba9add1d5b5b734c40328))
* **template:** Add `@wuespace/telestion-client-prop-types` as default dependency of newly initialized PSC projects ([3d7d4ec](https://github.com/TelestionTeam/telestion-client/commit/3d7d4ec6e504e3568d66feee5789c76c259f0367))
* **template:** Add prettier in template for new PSCs ([3165a18](https://github.com/TelestionTeam/telestion-client/commit/3165a1833e7d8aa77638522d66db23dd229ef6f0))


### Bug Fixes

* **cli:** Stop output `'DEBUG: '` for debug log entries ([1b57547](https://github.com/TelestionTeam/telestion-client/commit/1b57547d1a0d05e00c409fd90f136dc302492d45))
* **deps:** Remove no-longer needed webpack-dev-server dependency from CLI ([d91dd48](https://github.com/TelestionTeam/telestion-client/commit/d91dd4888c838fbd750ba32895e5d7d9885e0e13))
* **template:** Add `eslintConfig` to PSC package.json ([050664e](https://github.com/TelestionTeam/telestion-client/commit/050664ea4555c2ea01669e44e972de20e1783bc8)), closes [#305](https://github.com/TelestionTeam/telestion-client/issues/305)
* **template:** Add `homepage` specifier to PSC package.json ([b7ee792](https://github.com/TelestionTeam/telestion-client/commit/b7ee792083a6237b107808227c7bb8f70df317ab))
* **template:** Fix `devDependencies` in template ([b01b2d5](https://github.com/TelestionTeam/telestion-client/commit/b01b2d5fecb2a30d7434af63a690cba8b8fa4dc0))


### Documentation Changes

* WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/TelestionTeam/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
* **cli:** Add better code documentation for the `tc-cli build` library functions ([de37093](https://github.com/TelestionTeam/telestion-client/commit/de37093f64be5225cb0a864ff4ee4c3fe20e7f16))
* **cli:** Improve wording in console output, doc comments, and function names ([e22e365](https://github.com/TelestionTeam/telestion-client/commit/e22e36545f55d0b37dabfd3221b26873764493d9))
* **cli:** Update the package's README.md ([6b54f6f](https://github.com/TelestionTeam/telestion-client/commit/6b54f6fb40dc15e632dadaaaa77d910f567d5278))
* **common:** Update the package's README.md ([52b36f1](https://github.com/TelestionTeam/telestion-client/commit/52b36f1e14379df6e179ea40966d0bc50ba59a2d))
* **core:** Update the package's README.md ([f36fd06](https://github.com/TelestionTeam/telestion-client/commit/f36fd06cf06f631829656fb71e25b33d6502a994))
* **mock-server:** Update the package's README.md ([035bfe6](https://github.com/TelestionTeam/telestion-client/commit/035bfe62219a387e0abb02ac77aaaaaf148326dc))
* **prop-types:** Update the package's README.md ([59a1a0c](https://github.com/TelestionTeam/telestion-client/commit/59a1a0cb1b7689f3e15ed457897f1c43171b1dee))
* **template:** Include project structure description in PSC README.md ([e3893cb](https://github.com/TelestionTeam/telestion-client/commit/e3893cbe5f54d7a75f07efc4418c320234aa4d96))
* **template:** Update the package's README.md ([747efe1](https://github.com/TelestionTeam/telestion-client/commit/747efe117054e3b655e7ad9f5fa3cbcae5842a79))
* **template:** Update the template's PSC README.md ([2d95652](https://github.com/TelestionTeam/telestion-client/commit/2d956527d80f08fef4ed07820dde25c0e8aef8b1))
* **types:** Update the package's README.md ([81753df](https://github.com/TelestionTeam/telestion-client/commit/81753dfd4a8a86837aac62c9bb3701ed76159bea))
* **vertx-event-bus:** Update the package's README.md ([cbb605a](https://github.com/TelestionTeam/telestion-client/commit/cbb605ad78a2015caa276ff9fdeac436b8dc6847))
* Add contributing guidelines as its own file ([42d1783](https://github.com/TelestionTeam/telestion-client/commit/42d178364141da2fe38edd61a148268ac067ae95))
* Revamp repository `README.md` ([8188653](https://github.com/TelestionTeam/telestion-client/commit/818865332fd2e07c5bc73db1ba7118324447eb95))
* Use pure Markdown for the Contributors image in the README ([cb40ee8](https://github.com/TelestionTeam/telestion-client/commit/cb40ee85ee0289320f1279a577894d0fc1dd23e0))



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
