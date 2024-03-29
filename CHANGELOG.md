# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [0.18.1](https://github.com/wuespace/telestion-client/compare/v0.18.0...v0.18.1) (2022-02-10)


### Bug Fixes

* **cli:** Fix template directory parsing issues ([06fea8c](https://github.com/wuespace/telestion-client/commit/06fea8cfc31eaeb7841301ff2fbf76efd369aa58))



## [0.18.0](https://github.com/wuespace/telestion-client/compare/v0.17.0...v0.18.0) (2022-01-28)


### Features

* **common:** Add `useDesktopNotifications` hook to handle the `@wuespace/telestion-client-core` `useNotifications` API notifications by sending desktop notifications. Call `useDesktopNotifications()` in your client project's `src/components/app.tsx` to use it. ([16d2033](https://github.com/wuespace/telestion-client/commit/16d2033f7e811a61740af095fa1d05f3ff190979)), closes [#1171](https://github.com/wuespace/telestion-client/issues/1171)
* **common:** Add a `showDialog` function which creates a new configured dialog. Every dialog is stored in the Telestion Common dialog state which is accessible through the `useDialog` hook. These dialogs are rendered with the `ModalContext` component. ([fec24d8](https://github.com/wuespace/telestion-client/commit/fec24d81f670e03242aea0c319fb0553b1fdf2bb))
* **common:** Add state support for the dialog and their entries in the `showDialog` function. Every component in the dialog configuration now receives the current state and a function to update it. The resolved promise then returns the final state of the dialog. ([f78523f](https://github.com/wuespace/telestion-client/commit/f78523f905c9e4f6e79e5a256b011019b2d998fd))
* **common:** Use spectrum dialog instead of native dialog window to confirm user configuration reset ([eb4e0b1](https://github.com/wuespace/telestion-client/commit/eb4e0b11d6645bb802d953e4abea43e55ec3793c)), closes [#854](https://github.com/wuespace/telestion-client/issues/854)
* **template:** Enable desktop notifications by default using the common's `useDesktopNotifications` hook ([f00325a](https://github.com/wuespace/telestion-client/commit/f00325a1192c663ec399675f545cf23c929f608e)), closes [#1171](https://github.com/wuespace/telestion-client/issues/1171)
* **template:** Remove duplicate dependency `@react-spectrum/table` ([0327129](https://github.com/wuespace/telestion-client/commit/032712993d4fa3e4725d7d8511be934ef304e03b))


### Bug Fixes

* **cli:** Fix native builds not running when there are linter warnings while compiling the React app ([b482795](https://github.com/wuespace/telestion-client/commit/b4827959fbb4f70860ec71c16848c1c6f13a0862)), closes [#970](https://github.com/wuespace/telestion-client/issues/970)
* Fix incompatibilities with `directory-tree` v3.0.0 ([7f0aac1](https://github.com/wuespace/telestion-client/commit/7f0aac19b24438a990bfc34577673f7107594d7a))
* **telestion-client-template:** Disable `<StrictMode />` in default template to improve compatibility with React Spectrum ([984a805](https://github.com/wuespace/telestion-client/commit/984a80588c3aad081e41400b366c71d638973bcd))



## [0.17.0](https://github.com/wuespace/telestion-client/compare/v0.16.1...v0.17.0) (2021-06-25)


### Features

* **template:** Remove `@react-spectrum/tabs` dependency because it is no longer required ([3aaf702](https://github.com/wuespace/telestion-client/commit/3aaf7020cf2b2cde1eb26aecdcdcfdc5ab4750a8))


### Bug Fixes

* **common:** Update eventbus debug widget due to breaking changes in `@react-spectrum/table` ([81b3517](https://github.com/wuespace/telestion-client/commit/81b351729bb0cbfb766d1c15ce2a48e462cc8f11))



### [0.16.1](https://github.com/wuespace/telestion-client/compare/v0.16.0...v0.16.1) (2021-06-23)


### Bug Fixes

* **common:** Fix rendering error in `ConfigRenderer` component ([337c47b](https://github.com/wuespace/telestion-client/commit/337c47b4cd96e62ba0ce56ceac2a628c60ebf42c))
* **common:** Fix reset configuration entry reloads application on cancel ([841d1df](https://github.com/wuespace/telestion-client/commit/841d1dfe111e399116fef2385463e2a1a2b466e9))



## [0.16.0](https://github.com/wuespace/telestion-client/compare/v0.15.1...v0.16.0) (2021-06-23)


### ⚠ BREAKING CHANGES

* **types:** The `GlobalRendererProps` type is removed. An exported widget now requires a `version` property. The `title` property is removed from the `WidgetDefinition` type.
* **types:** A widget definition for a dashboard configuration now requires a unique identifier.

### Features

* **cli:** Update widget generate command due to breaking changes ([5b9bd2f](https://github.com/wuespace/telestion-client/commit/5b9bd2feda73982fcbf87fc368cccd81b009e90c))
* **common:** Add a reset configuration menu entry to the avatar menu ([6d8d42e](https://github.com/wuespace/telestion-client/commit/6d8d42e699ea594b132c1053159ba90d2ac9ad22))
* **common:** Add the eventbus debug widget. To use it, simply add the `commonWidgets` to the widgets list of the `CommonWrapper` component. ([5b82612](https://github.com/wuespace/telestion-client/commit/5b82612c4b8e96ed7700ea1acce821f7c4e1044e))
* **common:** Add tooltips to copy and paste actions in widget configuration ([c552ac1](https://github.com/wuespace/telestion-client/commit/c552ac143b0f9f599493b134c90636c6ca0f6f5d))
* **common:** Compress media files ([3b19494](https://github.com/wuespace/telestion-client/commit/3b19494f3c25a5792bd068ebd9b4d88ca5b6ad76))
* **common:** Implement `ContextMenu` component which renders the registered menu items on a context event ([72dacf0](https://github.com/wuespace/telestion-client/commit/72dacf098ae50de1f56926c9b30c566e99046246))
* **common:** Implement `ContextMenuProvider` and `ContextMenuWrapper` that allows the usage of custom context menu in the application (see documentation for more information) ([b980299](https://github.com/wuespace/telestion-client/commit/b98029970f36276a7061d560ac86d42cb6094811))
* **common:** Implement the copy and paste feature which allows the transfer of configurations between widgets. ([28bc167](https://github.com/wuespace/telestion-client/commit/28bc16758a781bbd66eb95e7e8e2c3c7897c4fce))
* **common:** Implement the widget configuration mode which renders the exported `ConfigControls` for every widget. ([5a71a35](https://github.com/wuespace/telestion-client/commit/5a71a35bfcaeec14342cc3fd26563d6c60d66d9b)), closes [#562](https://github.com/wuespace/telestion-client/issues/562)
* **common:** Insert the `ContextMenuProvider` into the `CommonWrapper` component to provide context menu support by default for projects using the `CommonWrapper` component ([a33acbe](https://github.com/wuespace/telestion-client/commit/a33acbe4d58c98d72fbcdb748e498264dfe5b1c4))
* **common:** Register a context menu item to configure the widget on a context event ([fcee39c](https://github.com/wuespace/telestion-client/commit/fcee39c61775be129b6c690a19140b9e2fb076a8))
* **common:** Remove padding left override for input svg elements (react-spectrum text field fix) ([601ff4f](https://github.com/wuespace/telestion-client/commit/601ff4f4e97c24b31dd8d4701767853db6e4bb8b))
* **common:** The dashboard page now displays a loading indicator if the event bus is not initialized yet. ([80ce8a1](https://github.com/wuespace/telestion-client/commit/80ce8a140cafc3a3a3ff6310bcf269f519d08816))
* **common:** The widget renderer now uses the `widget.id` to identify the currently rendered widgets ([c7ff348](https://github.com/wuespace/telestion-client/commit/c7ff3482efcae14bd9be4d5d11b6fe2d5d273f9c))
* **common:** Update eventbus debug widget to be compatible with the `Widget` definition. ([41ee77d](https://github.com/wuespace/telestion-client/commit/41ee77d6f7f9245d24fb4c92fd8fcd0729d3546a))
* **template:** Add @react-spectrum/table as normal dependency ([05c3cce](https://github.com/wuespace/telestion-client/commit/05c3cceb2c65e013186916a569fe669111f6c1d1))
* **template:** Import common widgets into application by default ([c336b9a](https://github.com/wuespace/telestion-client/commit/c336b9a3d6aa3bfc553075094de8381073ee9e24))
* **template:** Update sample widget and user configuration due to breaking changes ([4f619e4](https://github.com/wuespace/telestion-client/commit/4f619e436fb093195c3c57e2b021b2fbcad61d9f))
* **types:** Add a unique identifier to a widget definition ([1c3d8c4](https://github.com/wuespace/telestion-client/commit/1c3d8c44f59dc6835c04de7469e33c88a9d0fdac))
* **types:** Add context menu types (`MenuItem` and `Section`) ([ca7e489](https://github.com/wuespace/telestion-client/commit/ca7e48922c18d260ff748447b2983abc9d111a9a))
* **types:** Remove title as required widget configuration and therefore the `GlobalRendererProps` because it is no longer needed. A widget must now export a version. ([1288054](https://github.com/wuespace/telestion-client/commit/1288054ea90c37f168e0dce701fec1de00201b43))


### Bug Fixes

* **common:** Fix some styling issues related to widget configuration and context menu ([dc0f290](https://github.com/wuespace/telestion-client/commit/dc0f290ac05e3d4d1beaeab0ffd36c20a44b95b7))
* **common:** Fix spelling in illustrated message in eventbus details ([33c260e](https://github.com/wuespace/telestion-client/commit/33c260eb0ce3824b1f4186f5c947991c87ba2bbd))


### Documentation Changes

* **common:** Add no event bus story to dashboard page ([ef58bfa](https://github.com/wuespace/telestion-client/commit/ef58bfad7f1e2abf4d78b38f2851e0c9e3d58eb8))



### [0.15.1](https://github.com/wuespace/telestion-client/compare/v0.15.0...v0.15.1) (2021-06-03)


### Bug Fixes

* **common:** Fix `StaticColorMap` colors in the common spectrum colors implementation ([406f9e7](https://github.com/wuespace/telestion-client/commit/406f9e7469f8941f02a5cde6b506bd6111fa0cee))
* Correct wrong static color names (`static-black` and `static-white`) in `StaticSpectrumColor` type ([0acdf91](https://github.com/wuespace/telestion-client/commit/0acdf91877dcb4736b34e08f2445677511b16a82))



## [0.15.0](https://github.com/wuespace/telestion-client/compare/v0.14.1...v0.15.0) (2021-06-03)


### ⚠ BREAKING CHANGES

* **core:** The `AuthRoute` and `UnAuthRoute` components do no longer exist. Please use the attached routing object on the Page Component instead. _Mostly likely this won't affect you, if you don't immediately understand, what this means. Otherwise feel free to ignore it._ :wink:

### Features

* **common:** Add a spectrum color hook which maps the spectrum color definition to a color value based on the current color scheme state ([ae458d5](https://github.com/wuespace/telestion-client/commit/ae458d587ace9613c36e6929d049cf4ddaeacc72))
* **common:** Make overflow fix accessible for projects ([ae361ad](https://github.com/wuespace/telestion-client/commit/ae361adbcc0a2361b5ebabeece30385f5c9e494f))
* **types:** Add spectrum color type definitions ([fa548da](https://github.com/wuespace/telestion-client/commit/fa548da21cbd1687e6c3c3a81e93f7dccc30d00f))


### Bug Fixes

* **common:** Fix dashboard picker does not display the current dashboard title on initial load ([4d5578b](https://github.com/wuespace/telestion-client/commit/4d5578b3b652079d3f62458807499ee8c63e358f)), closes [#363](https://github.com/wuespace/telestion-client/issues/363)
* **core:** Clean up the page renderer so that routes are direct child components of the switch. ([05875a2](https://github.com/wuespace/telestion-client/commit/05875a2169690ccd8fcc36e99891297341b66ab9))


### Documentation Changes

* **common:** Improve documentation for the overflow fix component ([8bbc593](https://github.com/wuespace/telestion-client/commit/8bbc593376585d23ddc88f41d7348970159410fa))



### [0.14.1](https://github.com/wuespace/telestion-client/compare/v0.14.0...v0.14.1) (2021-05-10)


### Bug Fixes

* **common:** Tabs in navigation bar now use react-spectrum tabs v3 rc0 ([c437928](https://github.com/wuespace/telestion-client/commit/c437928ed6d3707985cef445ce4436eef5fc1f20))
* **core:** Sign in function in auth state not testing for same username ([df92f61](https://github.com/wuespace/telestion-client/commit/df92f6122b0a6f128a70c0b69341f4657086dd7e))
* **core:** Specify return type of set preference value function more precisely ([18a565c](https://github.com/wuespace/telestion-client/commit/18a565c536abd0b257f0127298c48ce0c3ea07fc))



## [0.14.0](https://github.com/wuespace/telestion-client/compare/v0.13.0...v0.14.0) (2021-05-01)


### Features

* **cli:** Add `skipGit` option to the `tc-cli init` command for telestion-project-template based projects ([fce07a8](https://github.com/wuespace/telestion-client/commit/fce07a8204ade2321af0dbd82fc1b66c95a97f35))
* **cli:** Add support for projects based on the new telestion-project-template structure (the CLI will auto-detect the structure and follow the directory structure accordingly) ([759748b](https://github.com/wuespace/telestion-client/commit/759748ba0136cfa2e4ebb986594d4fb3982039c8))
* **cli:** Reword `init-epilogue` ([5e98003](https://github.com/wuespace/telestion-client/commit/5e980033fc1ef0a0f24444fc2534ffff35a902aa))
* **template:** Replace `husky` with more adaptive solution ([4b27835](https://github.com/wuespace/telestion-client/commit/4b27835ab2578db3ce67e31e803dc7dd554f5701))


### Bug Fixes

* **cli:** Fix install command to work with new telestion-project-template structure ([a2956c5](https://github.com/wuespace/telestion-client/commit/a2956c5587da5fde709ef605eb0ae533264dca56))
* **cli:** Fix problem where `pretty-quick` hook was not generated when initializing a new repository ([b1c8ce0](https://github.com/wuespace/telestion-client/commit/b1c8ce00a87f7d6c8ec6e9b88af011412e330183))
* **template:** Fix pre-commit hook path ([df87baa](https://github.com/wuespace/telestion-client/commit/df87baa0b244903792e4c0044cea3d6f696862a6))
* **template:** Use npx for the pre-commit hook ([ffb62cd](https://github.com/wuespace/telestion-client/commit/ffb62cd53ff3868447947eab1d2da5281ed3826b))



## [0.13.0](https://github.com/wuespace/telestion-client/compare/v0.12.1...v0.13.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* If you referenced the npm packages via GitHub, please update your paths accordingly.

### Features

* Move GitHub Repository from TelestionTeam Organization to wuespace Organization ([da19ea3](https://github.com/wuespace/telestion-client/commit/da19ea34cfcff0ea5b2f950844550ae7f8dfb6c5))
* **template:** Add more npm scripts ([4421905](https://github.com/wuespace/telestion-client/commit/4421905cd2d13f0c857baa9c1e2024f76721ac66))



### [0.12.1](https://github.com/wuespace/telestion-client/compare/v0.12.0...v0.12.1) (2021-04-09)


### Bug Fixes

* **event-bus:** Fix message and callback handling and add additional logging options ([84bb838](https://github.com/wuespace/telestion-client/commit/84bb838f82bc6310f6a20f77d308fdc1acc2cb65))



## [0.12.0](https://github.com/wuespace/telestion-client/compare/v0.11.2...v0.12.0) (2021-04-08)


### ⚠ BREAKING CHANGES

* **event-bus:** Numerous changes, please see https://github.com/wuespace/telestion-client/wiki/v0.12-Migration-Guide
* **types:** The error message is no longer addressable.
* The minimum required node version for all packages is now Node v14!
* **mock-server:** The listen function now requires an object as argument which contains the port and hostname as properties.
* **mock-server:** The event bus and http server instance properties are now marked private. Please use the provided abstractions and hooks instead. (see onInit, send, handle, register, etc.)
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

* **common:** Enhance loading indicator component ([#350](https://github.com/wuespace/telestion-client/issues/350)) ([82d07f1](https://github.com/wuespace/telestion-client/commit/82d07f14a28e802d301f78e516f619a6bb339a6a))
* **event-bus:** Implement basic event bus as first part of the refactoring process ([d8ccc73](https://github.com/wuespace/telestion-client/commit/d8ccc73801459a2994ed4195a99f39547598d708))
* **event-bus:** Rewrite Vert.x Event Bus ([8d83dec](https://github.com/wuespace/telestion-client/commit/8d83decff975cbeb0f1bc4c85c88211642ea015e))
* **mock-server:** Add close function ([3e0b5a8](https://github.com/wuespace/telestion-client/commit/3e0b5a8c704e45911e7c17cd762cc082dbb7900f))
* **mock-server:** Add logger option to constructor and clean up some internals ([cefceae](https://github.com/wuespace/telestion-client/commit/cefceaeb1c76cc0fc8a5c72b4d92c1911b47da63))
* **mock-server:** First full implementation ([7461df5](https://github.com/wuespace/telestion-client/commit/7461df52eccaad3740b80a5c0fcc871704b72d42))
* **types:** The error message now extends from base message ([a8f17dd](https://github.com/wuespace/telestion-client/commit/a8f17dd4d468f9ae250b4e105d7175a56aa63f1b))
* Specify minimum node version in all packages and update workflows to use npm v7 as default ([b727223](https://github.com/wuespace/telestion-client/commit/b72722326ce8b88f42ad2c16ddbd60991e2c8b72))
* **mock-server:** Add protected method to get all connections ([cf9e267](https://github.com/wuespace/telestion-client/commit/cf9e2677baa92fe7822a5f5cbc37ec29b7130da5))


### Bug Fixes

* **cli:** Init: npm install command to be compatible with npm v7 ([c81b35e](https://github.com/wuespace/telestion-client/commit/c81b35e27fe9bbdcdc82498701a3fd3cb59bba18))
* **core:** Fix breaking changes ([b6551c3](https://github.com/wuespace/telestion-client/commit/b6551c3c388db5bf78da385a1a52d8f526f04970))
* **deps:** Fix issues with react-spectrum v3.9 ([14bcfe4](https://github.com/wuespace/telestion-client/commit/14bcfe444504fc744f6c8f38b4bf6a5c474da847))
* **mock-server:** Fix breaking changes ([eab07d3](https://github.com/wuespace/telestion-client/commit/eab07d33567cb8c2bd759083dd2e5c2db6a4d9b6))


### Documentation Changes

* **event-bus:** Document basic event bus ([395e677](https://github.com/wuespace/telestion-client/commit/395e6778af0ed6ab9f4b5ba121135fd0099d3f39))
* **mock-server:** Document all methods ([e0127e5](https://github.com/wuespace/telestion-client/commit/e0127e5b2e393d8d321e474b1eb47362cd24e98d))



### [0.11.2](https://github.com/wuespace/telestion-client/compare/v0.11.1...v0.11.2) (2021-03-09)


### Bug Fixes

* **types:** Allow undefined in generic props for widgets ([450bd38](https://github.com/wuespace/telestion-client/commit/450bd38abb3255ebfe339f08f70a8f358b91f076))



### [0.11.1](https://github.com/wuespace/telestion-client/compare/v0.11.0...v0.11.1) (2021-03-01)


### Bug Fixes

* **types:** Add possible types to JSON serializable in object and array ([455a708](https://github.com/wuespace/telestion-client/commit/455a708ae8118be9af9b8a79f4d5ec5500260bc9))



## [0.11.0](https://github.com/wuespace/telestion-client/compare/v0.10.1...v0.11.0) (2021-02-28)


### Features

* **common:** Add keyboard controls to the `LoginForm` component ([7fe4f3b](https://github.com/wuespace/telestion-client/commit/7fe4f3b21449a2e86c06054380da094ec9865cac)), closes [#364](https://github.com/wuespace/telestion-client/issues/364)


### Bug Fixes

* **common:** Fix types of `LoadingIndicator` ([1885d07](https://github.com/wuespace/telestion-client/commit/1885d0741489e364545c619524ef35ede8708c50))


### Documentation Changes

* Add legal notice link to documentation ([e72ff14](https://github.com/wuespace/telestion-client/commit/e72ff14e235a34f27a017aecd0f5c40d7db808e7))



### [0.10.1](https://github.com/wuespace/telestion-client/compare/v0.10.0...v0.10.1) (2021-02-27)


### Bug Fixes

* **common:** Fix tabs in `NavBar` to adjust to new header height introduced in 555b9a1fd212a580ca23d151247ad94216a81384 ([7309a86](https://github.com/wuespace/telestion-client/commit/7309a8658513647dd432ffc27995cbe444024ee2))
* **common:** Reduce header height (from `size-700` to `size-600`) to abide by Spectrum guidelines and fix layout issues with tabs in the `NavBar` component ([6c99744](https://github.com/wuespace/telestion-client/commit/6c99744a9b0e8bfa3365b58c7f4ffb7d3fd0eb56))
* **common:** Reduce size of `AppLogo` from `size-500` to `size-400` to adjust to the different header height introduced in 555b9a1fd212a580ca23d151247ad94216a81384 ([844fa9f](https://github.com/wuespace/telestion-client/commit/844fa9f8daa2c9fc0313cd08cdd42decdd686d0f))
* **deps:** Regenerate package-lock.json to fix compatibility issues with React Spectrum 3.8 ([1fcc9d3](https://github.com/wuespace/telestion-client/commit/1fcc9d318941912be61da5b612bb19412e551a1e))



## [0.10.0](https://github.com/wuespace/telestion-client/compare/v0.9.0...v0.10.0) (2021-02-23)


### Features

* **common:** Add `overrideState` to `ConnectionIndicator` for debugging purposes ([92492fa](https://github.com/wuespace/telestion-client/commit/92492faaa32a90595e3f511b6affdf62d4df23a3))


### Bug Fixes

* **common:** Fix Dashboard rendering issues ([73afae2](https://github.com/wuespace/telestion-client/commit/73afae2104247843cd81fce6742cc41d4a59148c))


### Documentation Changes

* Add template CSS rules to Storybook stories ([ab41e1c](https://github.com/wuespace/telestion-client/commit/ab41e1cd596e8f64963eb4410b3333e2297a54c0))
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
* **core:** Improve storybook stories for `TelestionClient` ([dfdc8e1](https://github.com/wuespace/telestion-client/commit/dfdc8e1c04a914dd753793623f9cc51fa49cfaa3))



## [0.9.0](https://github.com/wuespace/telestion-client/compare/v0.8.0...v0.9.0) (2021-02-09)


### Features

* **mock-server:** Make event bus and http server instances protected so extending classes can use them ([9c6f6ff](https://github.com/wuespace/telestion-client/commit/9c6f6ff84d794559d54ae5f362ce4befe0ecec30))
* **mock-server:** The prefix and the hostname are now customizable ([467187d](https://github.com/wuespace/telestion-client/commit/467187d380adf62f5e43afa1c7006f56591970f2))


### Bug Fixes

* **mock-server:** The SockJS instance now uses the right prefix ([3192dd3](https://github.com/wuespace/telestion-client/commit/3192dd3b3825fc88f9e21e66740fc2b866f45c5f))
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

* **cli:** `tc-cli build` command implementation ([6de3183](https://github.com/wuespace/telestion-client/commit/6de318393c2713a16510ecd07b56cdea22953288)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)
* **cli:** Add configuration file parsing to the CLI ([f2760e3](https://github.com/wuespace/telestion-client/commit/f2760e3f0c377c2cc9c9b409d71460db68927581))
* **cli:** Add Electron Main Process Plugin system ([05ba70c](https://github.com/wuespace/telestion-client/commit/05ba70c6aa67153b31422d49e2f4603d57ac168d))
* **cli:** Compile and run the actual Electron app and use Craco in `tc-cli start --electron` ([05ee18b](https://github.com/wuespace/telestion-client/commit/05ee18b752515838d6d53f6a64d682a775e3de50))
* **cli:** Expose programmatic APIs for common CLI lib functions ([d266ad0](https://github.com/wuespace/telestion-client/commit/d266ad0da902774a0c62b33725bbf731d90a9ecd))
* **cli:** Show files generated by electron-builder in `tc-cli build` ([b1fbd3d](https://github.com/wuespace/telestion-client/commit/b1fbd3dd949c328853fba9add1d5b5b734c40328))
* **template:** Add `@wuespace/telestion-client-prop-types` as default dependency of newly initialized PSC projects ([3d7d4ec](https://github.com/wuespace/telestion-client/commit/3d7d4ec6e504e3568d66feee5789c76c259f0367))
* **template:** Add prettier in template for new PSCs ([3165a18](https://github.com/wuespace/telestion-client/commit/3165a1833e7d8aa77638522d66db23dd229ef6f0))


### Bug Fixes

* **cli:** Stop output `'DEBUG: '` for debug log entries ([1b57547](https://github.com/wuespace/telestion-client/commit/1b57547d1a0d05e00c409fd90f136dc302492d45))
* **deps:** Remove no-longer needed webpack-dev-server dependency from CLI ([d91dd48](https://github.com/wuespace/telestion-client/commit/d91dd4888c838fbd750ba32895e5d7d9885e0e13))
* **template:** Add `eslintConfig` to PSC package.json ([050664e](https://github.com/wuespace/telestion-client/commit/050664ea4555c2ea01669e44e972de20e1783bc8)), closes [#305](https://github.com/wuespace/telestion-client/issues/305)
* **template:** Add `homepage` specifier to PSC package.json ([b7ee792](https://github.com/wuespace/telestion-client/commit/b7ee792083a6237b107808227c7bb8f70df317ab))
* **template:** Fix `devDependencies` in template ([b01b2d5](https://github.com/wuespace/telestion-client/commit/b01b2d5fecb2a30d7434af63a690cba8b8fa4dc0))


### Documentation Changes

* WueSpace becomes WüSpace (a typo in previous commits) ([9c44d69](https://github.com/wuespace/telestion-client/commit/9c44d696f0d5502ce5222a90011e892b8a7054c2))
* **cli:** Add better code documentation for the `tc-cli build` library functions ([de37093](https://github.com/wuespace/telestion-client/commit/de37093f64be5225cb0a864ff4ee4c3fe20e7f16))
* **cli:** Improve wording in console output, doc comments, and function names ([e22e365](https://github.com/wuespace/telestion-client/commit/e22e36545f55d0b37dabfd3221b26873764493d9))
* **cli:** Update the package's README.md ([6b54f6f](https://github.com/wuespace/telestion-client/commit/6b54f6fb40dc15e632dadaaaa77d910f567d5278))
* **common:** Update the package's README.md ([52b36f1](https://github.com/wuespace/telestion-client/commit/52b36f1e14379df6e179ea40966d0bc50ba59a2d))
* **core:** Update the package's README.md ([f36fd06](https://github.com/wuespace/telestion-client/commit/f36fd06cf06f631829656fb71e25b33d6502a994))
* **mock-server:** Update the package's README.md ([035bfe6](https://github.com/wuespace/telestion-client/commit/035bfe62219a387e0abb02ac77aaaaaf148326dc))
* **prop-types:** Update the package's README.md ([59a1a0c](https://github.com/wuespace/telestion-client/commit/59a1a0cb1b7689f3e15ed457897f1c43171b1dee))
* **template:** Include project structure description in PSC README.md ([e3893cb](https://github.com/wuespace/telestion-client/commit/e3893cbe5f54d7a75f07efc4418c320234aa4d96))
* **template:** Update the package's README.md ([747efe1](https://github.com/wuespace/telestion-client/commit/747efe117054e3b655e7ad9f5fa3cbcae5842a79))
* **template:** Update the template's PSC README.md ([2d95652](https://github.com/wuespace/telestion-client/commit/2d956527d80f08fef4ed07820dde25c0e8aef8b1))
* **types:** Update the package's README.md ([81753df](https://github.com/wuespace/telestion-client/commit/81753dfd4a8a86837aac62c9bb3701ed76159bea))
* **vertx-event-bus:** Update the package's README.md ([cbb605a](https://github.com/wuespace/telestion-client/commit/cbb605ad78a2015caa276ff9fdeac436b8dc6847))
* Add contributing guidelines as its own file ([42d1783](https://github.com/wuespace/telestion-client/commit/42d178364141da2fe38edd61a148268ac067ae95))
* Revamp repository `README.md` ([8188653](https://github.com/wuespace/telestion-client/commit/818865332fd2e07c5bc73db1ba7118324447eb95))
* Use pure Markdown for the Contributors image in the README ([cb40ee8](https://github.com/wuespace/telestion-client/commit/cb40ee85ee0289320f1279a577894d0fc1dd23e0))



### [0.7.1](https://github.com/wuespace/telestion-client/compare/v0.7.0...v0.7.1) (2021-02-06)


### Bug Fixes

* **common:** Type Error in login description component ([ae8b07c](https://github.com/wuespace/telestion-client/commit/ae8b07c719ac78e9c935d4712827ce644e4eb3a7)), closes [#303](https://github.com/wuespace/telestion-client/issues/303)



## [0.7.0](https://github.com/wuespace/telestion-client/compare/v0.6.1...v0.7.0) (2021-02-06)


### ⚠ BREAKING CHANGES

* **cli:** Before, running `tc-cli start` opened the PSC as an Electron app, by default. To replicate this behavior, you'll now have to pass the `--electron` or `-e` argument to the command.

In summary, replace `tc-cli start` with `tc-cli start -e` to keep the same behavior.

### Features

* **cli:** Add option to open the PSC in either an Electron window or a browser in `tc-cli start` ([5fd359c](https://github.com/wuespace/telestion-client/commit/5fd359c6d5e04208be15c41e37a9c1612eb463b0))
* **template:** Adjust PSC template's npm scripts to accommodate for new `tc-cli start` behavior ([95bc391](https://github.com/wuespace/telestion-client/commit/95bc3915bc61253f94f250b563faa68a456a33c9))


### Bug Fixes

* **cli:** Add files before commiting the initial commit in `tc-cli init` ([8e0ac3c](https://github.com/wuespace/telestion-client/commit/8e0ac3c6963e79c3606283151a9bfcacc465a7b7))
* **cli:** Fix `TypeError: Cannot read property 'message' of undefined` in `tc-cli init` command ([6f4d1a3](https://github.com/wuespace/telestion-client/commit/6f4d1a376210f8ec368f1ad80f8b2f09bcf9d6f8))
* **cli:** In `tc-cli stats`, fix reverted json to non-json output behavior. ([c2451c6](https://github.com/wuespace/telestion-client/commit/c2451c6b4df1b998304aed80cdded8f5331ec17f))


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
* **template:** Add refactor recommendation for login page as default to the template ([c59697e](https://github.com/wuespace/telestion-client/commit/c59697eb04741bee15de9e1158b6f7932cbe0448))


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


### ⚠ BREAKING CHANGES

* **cli:** For previously generated PSCs to work with the new CLI, the // IMPORT_INSERT_MARK and // ARRAY_FIRST_ELEMENT_INSERT_MARK comments have to retrospectively be placed below all imports and at the beginning of the projectWidgets array, respectively
* **event-bus:** The types for the event bus are now accessible in the @wuespace/telestion-client-types package.

### Features

* **cli:** Add `tc-cli docs` to open the telestion-client documentation page ([85a2e03](https://github.com/wuespace/telestion-client/commit/85a2e03f05bf0bdd3887240339a8a15912ea8dd2))
* **cli:** Add `tc-cli generate widget` command ([4305e09](https://github.com/wuespace/telestion-client/commit/4305e09d45204607bba7fa7fd41360824ce2b112)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)
* **cli:** Add `tc-cli stats` command implementation ([#279](https://github.com/wuespace/telestion-client/issues/279)) ([35dbf26](https://github.com/wuespace/telestion-client/commit/35dbf263f820a01deff7a9cf228ba44abf6aaeb3)), closes [#263](https://github.com/wuespace/telestion-client/issues/263)
* **core:** Returned data of event bus abstraction hooks now typable and update documentation ([3b12717](https://github.com/wuespace/telestion-client/commit/3b127176f6d87f64463362eac57c8bb993a4ab04))
* **event-bus:** Remove types and import them from types package instead ([40788b2](https://github.com/wuespace/telestion-client/commit/40788b251dc4dc3060a414092b75eb069cde7438))
* **template:** Add npm scripts and local CLI instance to template ([4c7c503](https://github.com/wuespace/telestion-client/commit/4c7c5035d833d886a6b73fdff268227279ffb669))
* **types:** Add channel address as type and integrate it into message types ([b9569d7](https://github.com/wuespace/telestion-client/commit/b9569d736ca52672516031ace56d1dd8c1aa3b98))
* **types:** Import types from vertx-event-bus ([90fd513](https://github.com/wuespace/telestion-client/commit/90fd513937a2cb628bc15b120ea88ffff11b8e01))


### Bug Fixes

* **cli:** Fix `tc-cli generate` command (and subsequent, broken, CLI) ([a2a25fc](https://github.com/wuespace/telestion-client/commit/a2a25fc9770835b43ea289a8c3006384c42ec3d0))
* **core:** Small type change in implementation for callback in event bus abstraction hooks ([1277d8f](https://github.com/wuespace/telestion-client/commit/1277d8f8895be913bcb72f68dc73df2137036daa))
* **template:** Add .eslintcache to template gitignore ([ccd9c35](https://github.com/wuespace/telestion-client/commit/ccd9c358bf76da0f02368728ac3ccd688033b571))
* **template:** Add React Spectrum Tabs dependency ([ff8a30e](https://github.com/wuespace/telestion-client/commit/ff8a30e41b8c64cac7469643dec17fc2323f80a9))
* **types:** Change type definition for Json serializable data from Map to mapped object ([3fff598](https://github.com/wuespace/telestion-client/commit/3fff59873ca7f6f17af86cda3004eca7cf38d08e))



## 0.3.4 (2021-02-04)

**Note:** Version bump only for package telestion-client





## [0.3.3](https://github.com/wuespace/telestion-client/compare/v0.3.2...v0.3.3) (2021-01-26)

**Note:** Version bump only for package telestion-client

## 0.3.2 (2021-01-26)

**Note:** Version bump only for package telestion-client

## 0.3.1 (2021-01-26)

**Note:** Version bump only for package telestion-client
