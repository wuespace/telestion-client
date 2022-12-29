---
'@wuespace/telestion-client-cli': minor
'@wuespace/telestion-client-template': minor
---

Let Electron `main` process and `preload` source code live in Telestion Client projects themselves

The Electron process source code, which was previously hidden / uneditable, now lives directly inside Telestion Client projects. While this offers more flexibility (and less black-boxing), we recommend that you still make use of the plugin system (see below) to perform actions in the `main` process to make upgrades much easier (if your `electron.ts`, etc., stay in their "original" form, you can just update them from time to time).

Since this comes with major changes to the structure of client projects, we recommend that you regenerate a blank client project (using `tc-cli init`) and copy custom code over.

**For any plugins declared in your `telestion.config.js`,** import them in the `plugins` array exported in `src/electron/plugins/index.ts`.
