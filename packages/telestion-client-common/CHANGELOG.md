# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.13.0](https://github.com/wuespace/telestion-client/compare/v0.12.1...v0.13.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* If you referenced the npm packages via GitHub, please update your paths accordingly.

### Features

* Move GitHub Repository from TelestionTeam Organization to wuespace Organization ([da19ea3](https://github.com/wuespace/telestion-client/commit/da19ea34cfcff0ea5b2f950844550ae7f8dfb6c5))



### [0.12.1](https://github.com/wuespace/telestion-client/compare/v0.12.0...v0.12.1) (2021-04-09)

**Note:** Version bump only for package @wuespace/telestion-client-common





## [0.12.0](https://github.com/wuespace/telestion-client/compare/v0.11.2...v0.12.0) (2021-04-08)


### ⚠ BREAKING CHANGES

* The minimum required node version for all packages is now Node v14!
* **common:** The loading indicator gives the children function the current dependencies which are always defined:
```tsx
const [position, setPosition] = useState<Position>();
const [height, setHeight] = useState<number>();

return (
  <LoadingIndicator dependencies={[position, height]}>
    {(currentPos, currentHeight) => (
      <p>{currentPos} - {currentHeight}</p>
    )}
  </LoadingIndicator>
);
```
* **common:** The useDependencyTimeout now returns `true` if all dependencies are defined and `false` if not all dependencies are defined yet. Before the return value was inverted.
The type guard makes the hook useful as a condition in if-statements, for example:
```tsx
const [position, setPosition] = useState<Position>();

// throws if no position received after 5 seconds
if (useDependencyTimeout(5000, [position])) {
  // type guarded - "position" is always defined
  return <p>Latest position: {position}</p>;
}

return <p>Waiting for incoming data</p>;
```
* **deps:** Moving forward, testing is done with React Spectrum v3.9. Consider all previous versions unsupported.
* **deps:** `<ActionButton>`s for header actions now require a `isQuiet={true}` attribute to work properly with React Spectrum 3.9

### Features

* Specify minimum node version in all packages and update workflows to use npm v7 as default ([b727223](https://github.com/wuespace/telestion-client/commit/b72722326ce8b88f42ad2c16ddbd60991e2c8b72))
* **common:** Enhance loading indicator component ([#350](https://github.com/wuespace/telestion-client/issues/350)) ([82d07f1](https://github.com/wuespace/telestion-client/commit/82d07f14a28e802d301f78e516f619a6bb339a6a))


### Bug Fixes

* **deps:** Fix issues with react-spectrum v3.9 ([14bcfe4](https://github.com/wuespace/telestion-client/commit/14bcfe444504fc744f6c8f38b4bf6a5c474da847))



### [0.11.2](https://github.com/wuespace/telestion-client/compare/v0.11.1...v0.11.2) (2021-03-09)

**Note:** Version bump only for package @wuespace/telestion-client-common





### [0.11.1](https://github.com/wuespace/telestion-client/compare/v0.11.0...v0.11.1) (2021-03-01)

**Note:** Version bump only for package @wuespace/telestion-client-common





## [0.11.0](https://github.com/wuespace/telestion-client/compare/v0.10.1...v0.11.0) (2021-02-28)


### Features

* **common:** Add keyboard controls to the `LoginForm` component ([7fe4f3b](https://github.com/wuespace/telestion-client/commit/7fe4f3b21449a2e86c06054380da094ec9865cac)), closes [#364](https://github.com/wuespace/telestion-client/issues/364)


### Bug Fixes

* **common:** Fix types of `LoadingIndicator` ([1885d07](https://github.com/wuespace/telestion-client/commit/1885d0741489e364545c619524ef35ede8708c50))



### [0.10.1](https://github.com/wuespace/telestion-client/compare/v0.10.0...v0.10.1) (2021-02-27)


### Bug Fixes

* **common:** Fix tabs in `NavBar` to adjust to new header height introduced in 555b9a1fd212a580ca23d151247ad94216a81384 ([7309a86](https://github.com/wuespace/telestion-client/commit/7309a8658513647dd432ffc27995cbe444024ee2))
* **common:** Reduce header height (from `size-700` to `size-600`) to abide by Spectrum guidelines and fix layout issues with tabs in the `NavBar` component ([6c99744](https://github.com/wuespace/telestion-client/commit/6c99744a9b0e8bfa3365b58c7f4ffb7d3fd0eb56))
* **common:** Reduce size of `AppLogo` from `size-500` to `size-400` to adjust to the different header height introduced in 555b9a1fd212a580ca23d151247ad94216a81384 ([844fa9f](https://github.com/wuespace/telestion-client/commit/844fa9f8daa2c9fc0313cd08cdd42decdd686d0f))



## [0.10.0](https://github.com/wuespace/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)


### Features

* **common:** Add `overrideState` to `ConnectionIndicator` for debugging purposes ([92492fa](https://github.com/wuespace/telestion-client/commit/92492faaa32a90595e3f511b6affdf62d4df23a3))


### Bug Fixes

* **common:** Fix Dashboard rendering issues ([73afae2](https://github.com/wuespace/telestion-client/commit/73afae2104247843cd81fce6742cc41d4a59148c))


### Documentation Changes

* Document new storybook-internal component folders in package `README.md`s ([89e8754](https://github.com/wuespace/telestion-client/commit/89e8754a8ee9501fd5da0c6eaac0e19a87ba085e))
* Improve storybook stories ([4b662bf](https://github.com/wuespace/telestion-client/commit/4b662bf12e60b6217e9487dee7bf45dc0940198b))
* **common:** Add storybook stories for `AccountControls` and `NavBar` ([b6c73d5](https://github.com/wuespace/telestion-client/commit/b6c73d56dd62eb2f198e71cf08c998fbf77bd013))
* **common:** Add storybook stories for `Actions`, `NotificationAction`, `ColorSchemeAction`, `FullscreenAction`, and `ActionDivider`. ([ea47787](https://github.com/wuespace/telestion-client/commit/ea4778767db4ddf0bd15d1565adf21fa316627b8))
* **common:** Add storybook stories for `CommonWrapper` and `AppLogo` ([29b408c](https://github.com/wuespace/telestion-client/commit/29b408c0398666ce54e87e6fb5f23ce7f6e9c202))
* **common:** Add storybook stories for `ConnectionIndicator` ([346096a](https://github.com/wuespace/telestion-client/commit/346096a3fa664b62d036f4e3ab73bb9d05fc0c6a))
* **common:** Add storybook stories for `DashboardPicker` ([5aab481](https://github.com/wuespace/telestion-client/commit/5aab481a8736271c0c74e3b79f42a5fa2d406f1b))
* **common:** Add storybook stories for `Header` ([2574afa](https://github.com/wuespace/telestion-client/commit/2574afa6b921b5156fe065d8f9214f8e3ec941e6))
* **common:** Fix storybook stories for `AccountControls` ([ce373af](https://github.com/wuespace/telestion-client/commit/ce373af071603c30998c46809fb50ac7b8709c52))
* **common:** Fix storybook stories for `AccountControls` and `NavBar` ([4edd201](https://github.com/wuespace/telestion-client/commit/4edd2016490588cefd83c64a66d1a38a882dec0c))
* **common:** Fix storybook stories for `Actions` ([476607c](https://github.com/wuespace/telestion-client/commit/476607c8ee0800af4458a766059b36b8aed3c27a))
* **common:** Improve storybook stories ([1cd24d1](https://github.com/wuespace/telestion-client/commit/1cd24d1842d981d4dae026092062520d84b2672f))
* **core:** Add storybook stories for `DashboardPage`, `LoginPage`, and `NotFoundPage` ([7c38682](https://github.com/wuespace/telestion-client/commit/7c38682d7fb88a59146434463a5e0400d6d1f1a2))
* **core:** Add storybook stories for `LoadingIndicator` ([ebb96ce](https://github.com/wuespace/telestion-client/commit/ebb96cebc79efa81871d4c7460c7c9d916f97564))
* **core:** Add storybook stories for `LoginDescription`, `LoginForm`, `LoginLogo`, and `LoginTitle` ([69c8c4a](https://github.com/wuespace/telestion-client/commit/69c8c4a59a9b1292ddec9e15f5b7b7b8127e4e61))



## [0.9.0](https://github.com/wuespace/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)

**Note:** Version bump only for package @wuespace/telestion-client-common





## [0.8.0](https://github.com/wuespace/telestion-client/compare/v0.7.1...v0.8.0) (2021-02-08)


### Documentation Changes

* WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/wuespace/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
* **common:** Update the package's README.md ([52b36f1](https://github.com/wuespace/telestion-client/commit/52b36f1e14379df6e179ea40966d0bc50ba59a2d))



### [0.7.1](https://github.com/wuespace/telestion-client/compare/v0.7.0...v0.7.1) (2021-02-06)


### Bug Fixes

* **common:** Type Error in login description component ([ae8b07c](https://github.com/wuespace/telestion-client/commit/ae8b07c719ac78e9c935d4712827ce644e4eb3a7)), closes [#303](https://github.com/wuespace/telestion-client/issues/303)



## [0.7.0](https://github.com/wuespace/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)


### Documentation Changes

* **common:** Add reference to props ([0083f67](https://github.com/wuespace/telestion-client/commit/0083f67f8a18a847993808f830d6454fe32b8505))
* **common:** Apply more suggestions from code review ([62754fa](https://github.com/wuespace/telestion-client/commit/62754fa6c2604584ade2bed8b94424787f561066))
* **common:** Apply suggestions from code review ([c0923c8](https://github.com/wuespace/telestion-client/commit/c0923c8e53354b6673b38ce9b28e13dac1f91f28))
* **common:** Document all page components ([e3400f7](https://github.com/wuespace/telestion-client/commit/e3400f7780b3ad7b1c2b95fc2da95e9ecabcd879))
* **common:** Document the account controls component ([859c640](https://github.com/wuespace/telestion-client/commit/859c640576b7cb87774c6f0e0801824a79a234fd))
* **common:** Document the action divider component ([b9a4cd1](https://github.com/wuespace/telestion-client/commit/b9a4cd15908c0de3c3df1af4507f9e8c7394c3e7))
* **common:** Document the avatar button component ([8c99c96](https://github.com/wuespace/telestion-client/commit/8c99c96edc812535ddb84d49e3ad3277677347be))
* **common:** Document the avatar menu component ([765bfb1](https://github.com/wuespace/telestion-client/commit/765bfb17ab65fef6b81023a09e4895fc909d86a6))
* **common:** Document the color scheme action component ([10db0be](https://github.com/wuespace/telestion-client/commit/10db0be6651a3d810fdb5c242758b9c7d9debb40))
* **common:** Document the dashboard component ([79dc52b](https://github.com/wuespace/telestion-client/commit/79dc52bc72767a0fef43425c875e3e020145b7bb))
* **common:** Document the dashboard picker component ([2d98394](https://github.com/wuespace/telestion-client/commit/2d98394db9ddeb15c2a716193bd2d38d1885c854))
* **common:** Document the fullscreen action component ([c505c16](https://github.com/wuespace/telestion-client/commit/c505c16b0a5e8b4b23848ea9e7950e5edde027a3))
* **common:** Document the header actions component ([497c7bd](https://github.com/wuespace/telestion-client/commit/497c7bd3888002afa34ab38c959e9ee66e150bb1))
* **common:** Document the no dashboards message component ([2b0c005](https://github.com/wuespace/telestion-client/commit/2b0c00594559630a689c1d11dcbe7bea9cf52d70))
* **common:** Document the not found message component ([9dee2d3](https://github.com/wuespace/telestion-client/commit/9dee2d3d3af3ea46c02a1597baed0dc353dc321a))
* **common:** Document the notification action component ([0cedf76](https://github.com/wuespace/telestion-client/commit/0cedf768cd443ef4fec15b7b103c4432960e3a5f))
* **common:** Document the overflow fix component ([db0ea7b](https://github.com/wuespace/telestion-client/commit/db0ea7b9f2525e327559e9b9695ed85dba57f08c))
* **common:** Document the status dialog component ([831db05](https://github.com/wuespace/telestion-client/commit/831db056c1e3a19ffde11787b1f0b1c9f81c860b))
* **common:** Document the use dashboard state hook ([8309e3c](https://github.com/wuespace/telestion-client/commit/8309e3cfe1c15b8dacd5b0ad1dbc4f3086e51e1c))
* **common:** Document the use nav bar state hook ([9b0a9b1](https://github.com/wuespace/telestion-client/commit/9b0a9b1184d2584949cc0b875eda0775ccacc8c8))
* **common:** Document the use status hook ([cb7e052](https://github.com/wuespace/telestion-client/commit/cb7e052b3f182d869a0d28283e6f46d3bdd82f28))
* **common:** Document the widget error message component ([2fab124](https://github.com/wuespace/telestion-client/commit/2fab124da7716de0da51027a2709473a0607541f))
* **common:** Document the widget renderer component ([d88e2ad](https://github.com/wuespace/telestion-client/commit/d88e2ad02390e32f2332a48c480695f83af1f6eb))



### [0.6.1](https://github.com/wuespace/telestion-client/compare/v0.6.0...v0.6.1) (2021-02-05)


### Bug Fixes

* Fix custom login page implementation in both template and documentation ([715e27c](https://github.com/wuespace/telestion-client/commit/715e27c04dd20aa8bffb589ac67d6e8d77d7fb26)), closes [#290](https://github.com/wuespace/telestion-client/issues/290) [#292](https://github.com/wuespace/telestion-client/issues/292)



## [0.6.0](https://github.com/wuespace/telestion-client/compare/v0.5.0...v0.6.0) (2021-02-05)


### Features

* **common:** Divide login page into compound components for better usability ([7e2112d](https://github.com/wuespace/telestion-client/commit/7e2112d3aa0f1b7e418a4d6089a08c5ee0650149))
* **common:** Make initial values for text fields in login form accessible for project ([204e947](https://github.com/wuespace/telestion-client/commit/204e947830f95aa6f6663ba428bf4e3c3b6ca757))


### Documentation Changes

* **common:** Apply suggestions from code review for login page ([12b8af7](https://github.com/wuespace/telestion-client/commit/12b8af779d77f3057af54f63af195bcdb6753902))
* **common:** Document internal form component for the login page ([602fe16](https://github.com/wuespace/telestion-client/commit/602fe16432da3f994fc971c14dd2ee54377ef071)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document login button component for the login page ([72de6a9](https://github.com/wuespace/telestion-client/commit/72de6a9cccf76470cf6149f38e23e53861cf6ab2)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document login description component for the login page ([953ad14](https://github.com/wuespace/telestion-client/commit/953ad14a778d4aa29b313f267a2c786358523bf6)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document login form component for the login page ([b1005bf](https://github.com/wuespace/telestion-client/commit/b1005bf4a54666508bda52e33c4623d6dee9212a)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document login logo component for the login page ([635cf66](https://github.com/wuespace/telestion-client/commit/635cf66ca0041e7b8710ddb936994ee86f6f9245)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document login title component for the login page ([c080799](https://github.com/wuespace/telestion-client/commit/c080799c77d054246b7c0846db2bad01b3bca092)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document text field component for the login page ([6315ae5](https://github.com/wuespace/telestion-client/commit/6315ae53ea0c09d8eb2ca62831b5246a0e19d44e)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)
* **common:** Document the login page ([f6f7664](https://github.com/wuespace/telestion-client/commit/f6f766489d253afacc8162ff49eb587f53a7a5e1)), closes [#272](https://github.com/wuespace/telestion-client/issues/272)



## [0.5.0](https://github.com/wuespace/telestion-client/compare/v0.4.0...v0.5.0) (2021-02-05)


### Features

* **common:** Add hook for managing dependency timeouts ([6684ede](https://github.com/wuespace/telestion-client/commit/6684ede2d10a08ffe5e5f66ce867a564f6ed24f4)), closes [#261](https://github.com/wuespace/telestion-client/issues/261)
* **common:** Add Loading Indicator component as helper for loading widgets ([efcf36c](https://github.com/wuespace/telestion-client/commit/efcf36cc1bc3c36b954b16835dc7c4e568f90454)), closes [#261](https://github.com/wuespace/telestion-client/issues/261)



## [0.4.0](https://github.com/wuespace/telestion-client/compare/v0.3.3...v0.4.0) (2021-02-05)

**Note:** Version bump only for package @wuespace/telestion-client-common





## 0.3.4 (2021-02-04)

**Note:** Version bump only for package @wuespace/telestion-client-common





## [0.3.3](https://github.com/wuespace/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-common

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-common

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package @wuespace/telestion-client-common
