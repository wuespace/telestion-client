---
'@wuespace/parcel-optimizer-electron-require': minor
'@wuespace/parcel-reporter-tc-cli': minor
'@wuespace/parcel-resolver-react': minor
'@wuespace/telestion-client-cli': minor
'@wuespace/telestion-client-common': minor
'@wuespace/telestion-client-core': minor
'@wuespace/telestion-client-prop-types': minor
'@wuespace/telestion-client-template': minor
'@wuespace/telestion-client-types': minor
'@wuespace/vertx-event-bus': minor
'@wuespace/vertx-mock-server': minor
---

Move the monorepo build tooling to Parcel/`pnpm`

This primarily affects the development within the `telestion-client` monorepo and shouldn't affect available APIs (unless otherwise specified in the changelog).

It might, however, cause changes in the resulting format of the distributed files.
