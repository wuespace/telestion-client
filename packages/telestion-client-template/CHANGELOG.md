# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [0.15.1](https://github.com/wuespace/telestion-client/compare/v0.15.0...v0.15.1) (2021-06-03)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.15.0](https://github.com/wuespace/telestion-client/compare/v0.14.1...v0.15.0) (2021-06-03)

**Note:** Version bump only for package @wuespace/telestion-client-template





### [0.14.1](https://github.com/wuespace/telestion-client/compare/v0.14.0...v0.14.1) (2021-05-10)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.14.0](https://github.com/wuespace/telestion-client/compare/v0.13.0...v0.14.0) (2021-05-01)


### Features

* **template:** Replace `husky` with more adaptive solution ([4b27835](https://github.com/wuespace/telestion-client/commit/4b27835ab2578db3ce67e31e803dc7dd554f5701))


### Bug Fixes

* **template:** Fix pre-commit hook path ([df87baa](https://github.com/wuespace/telestion-client/commit/df87baa0b244903792e4c0044cea3d6f696862a6))
* **template:** Use npx for the pre-commit hook ([ffb62cd](https://github.com/wuespace/telestion-client/commit/ffb62cd53ff3868447947eab1d2da5281ed3826b))



## [0.13.0](https://github.com/wuespace/telestion-client/compare/v0.12.1...v0.13.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* If you referenced the npm packages via GitHub, please update your paths accordingly.

### Features

* Move GitHub Repository from TelestionTeam Organization to wuespace Organization ([da19ea3](https://github.com/wuespace/telestion-client/commit/da19ea34cfcff0ea5b2f950844550ae7f8dfb6c5))
* **template:** Add more npm scripts ([4421905](https://github.com/wuespace/telestion-client/commit/4421905cd2d13f0c857baa9c1e2024f76721ac66))



### [0.12.1](https://github.com/wuespace/telestion-client/compare/v0.12.0...v0.12.1) (2021-04-09)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.12.0](https://github.com/wuespace/telestion-client/compare/v0.11.2...v0.12.0) (2021-04-08)


### ⚠ BREAKING CHANGES

* The minimum required node version for all packages is now Node v14!

### Features

* Specify minimum node version in all packages and update workflows to use npm v7 as default ([b727223](https://github.com/wuespace/telestion-client/commit/b72722326ce8b88f42ad2c16ddbd60991e2c8b72))



### [0.11.2](https://github.com/wuespace/telestion-client/compare/v0.11.1...v0.11.2) (2021-03-09)

**Note:** Version bump only for package @wuespace/telestion-client-template





### [0.11.1](https://github.com/wuespace/telestion-client/compare/v0.11.0...v0.11.1) (2021-03-01)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.11.0](https://github.com/wuespace/telestion-client/compare/v0.10.1...v0.11.0) (2021-02-28)

**Note:** Version bump only for package @wuespace/telestion-client-template





### [0.10.1](https://github.com/wuespace/telestion-client/compare/v0.10.0...v0.10.1) (2021-02-27)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.10.0](https://github.com/wuespace/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.9.0](https://github.com/wuespace/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)


### Bug Fixes

* **template:** Add browserslist to package.json to allow immediate start of development build ([0cf4d47](https://github.com/wuespace/telestion-client/commit/0cf4d4702a93fb41cc5fc9deeaafc272aa3c4c7c))



## [0.8.0](https://github.com/wuespace/telestion-client/compare/v0.7.1...v0.8.0) (2021-02-08)


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

* **cli:** Add configuration file parsing to the CLI ([f2760e3](https://github.com/wuespace/telestion-client/commit/f2760e3f0c377c2cc9c9b409d71460db68927581))
* **template:** Add `@wuespace/telestion-client-prop-types` as default dependency of newly initialized PSC projects ([3d7d4ec](https://github.com/wuespace/telestion-client/commit/3d7d4ec6e504e3568d66feee5789c76c259f0367))
* **template:** Add prettier in template for new PSCs ([3165a18](https://github.com/wuespace/telestion-client/commit/3165a1833e7d8aa77638522d66db23dd229ef6f0))


### Bug Fixes

* **template:** Add `eslintConfig` to PSC package.json ([050664e](https://github.com/wuespace/telestion-client/commit/050664ea4555c2ea01669e44e972de20e1783bc8)), closes [#305](https://github.com/wuespace/telestion-client/issues/305)
* **template:** Add `homepage` specifier to PSC package.json ([b7ee792](https://github.com/wuespace/telestion-client/commit/b7ee792083a6237b107808227c7bb8f70df317ab))
* **template:** Fix `devDependencies` in template ([b01b2d5](https://github.com/wuespace/telestion-client/commit/b01b2d5fecb2a30d7434af63a690cba8b8fa4dc0))


### Documentation Changes

* WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/wuespace/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
* **template:** Include project structure description in PSC README.md ([e3893cb](https://github.com/wuespace/telestion-client/commit/e3893cbe5f54d7a75f07efc4418c320234aa4d96))
* **template:** Update the package's README.md ([747efe1](https://github.com/wuespace/telestion-client/commit/747efe117054e3b655e7ad9f5fa3cbcae5842a79))
* **template:** Update the template's PSC README.md ([2d95652](https://github.com/wuespace/telestion-client/commit/2d956527d80f08fef4ed07820dde25c0e8aef8b1))



### [0.7.1](https://github.com/wuespace/telestion-client/compare/v0.7.0...v0.7.1) (2021-02-06)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.7.0](https://github.com/wuespace/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)


### Features

* **template:** Adjust PSC template's npm scripts to accommodate for new `tc-cli start` behavior ([95bc391](https://github.com/wuespace/telestion-client/commit/95bc3915bc61253f94f250b563faa68a456a33c9))



### [0.6.1](https://github.com/wuespace/telestion-client/compare/v0.6.0...v0.6.1) (2021-02-05)


### Bug Fixes

* Fix custom login page implementation in both template and documentation ([715e27c](https://github.com/wuespace/telestion-client/commit/715e27c04dd20aa8bffb589ac67d6e8d77d7fb26)), closes [#290](https://github.com/wuespace/telestion-client/issues/290) [#292](https://github.com/wuespace/telestion-client/issues/292)



## [0.6.0](https://github.com/wuespace/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)


### Features

* **template:** Add refactor recommendation for login page as default to the template ([c59697e](https://github.com/wuespace/telestion-client/commit/c59697eb04741bee15de9e1158b6f7932cbe0448))



## [0.5.0](https://github.com/wuespace/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.4.0](https://github.com/wuespace/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)


### ⚠ BREAKING CHANGES

* **cli:** For previously generated PSCs to work with the new CLI, the // IMPORT_INSERT_MARK and // ARRAY_FIRST_ELEMENT_INSERT_MARK comments have to retrospectively be placed below all imports and at the beginning of the projectWidgets array, respectively

### Features

* **cli:** Add `tc-cli generate widget` command ([4305e09](https://github.com/wuespace/telestion-client/commit/4305e09d45204607bba7fa7fd41360824ce2b112)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)
* **template:** Add npm scripts and local CLI instance to template ([4c7c503](https://github.com/wuespace/telestion-client/commit/4c7c5035d833d886a6b73fdff268227279ffb669))


### Bug Fixes

* **template:** Add .eslintcache to template gitignore ([ccd9c35](https://github.com/wuespace/telestion-client/commit/ccd9c358bf76da0f02368728ac3ccd688033b571))
* **template:** Add React Spectrum Tabs dependency ([ff8a30e](https://github.com/wuespace/telestion-client/commit/ff8a30e41b8c64cac7469643dec17fc2323f80a9))



## 0.3.4 (2021-02-04)

**Note:** Version bump only for package @wuespace/telestion-client-template





## [0.3.3](https://github.com/wuespace/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-template

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-template

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-template
