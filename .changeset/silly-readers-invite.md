---
'@wuespace/telestion-client-cli': minor
'@wuespace/telestion-client-template': minor
---

Move to Parcel as a build tool and `pnpm` as a package manager

From now on, Telestion Client projects relying on the `telestion-client-cli` (`tc-cli`) are required to use the `pnpm` package manager and Parcel as their build tool.

Since this comes with major changes to the structure of client projects, we recommend that you regenerate a blank client project (using `tc-cli init`) and copy custom code over.

Make sure that you have [pnpm](https://pnpm.io/) installed on your system.
