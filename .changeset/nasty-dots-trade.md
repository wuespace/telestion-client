---
'@wuespace/telestion-client-common': patch
'@wuespace/telestion-client-core': patch
'@wuespace/telestion-client-template': patch
---

Update `zustand` to v4

This leads to typing changes in the stores. The `zustand` API is still the same.

What was previously typed as `Store<T>` is now typed as `BoundStore<StoreApi<T>>`.
