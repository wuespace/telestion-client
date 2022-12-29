---
'@wuespace/telestion-client-template': patch
---

Fix React Spectrum styling/scaling issues

The Spectrum Design system is incompatible with `box-sizing: border-box`. Any projects generated with the template in the future will no longer have styling issues.

**Manual migration**

To manually migrate your Telestion Client project, make the following modifications in your `index.css` file:

Replace

```css
* {
	box-sizing: border-box;
}
```

with

```css
:not([class*='spectrum-']) {
	box-sizing: border-box;
}
```

and remove the following CSS block:

```css
input + svg,
button svg {
	padding-right: 0 !important;
	padding-left: 0 !important;
}
```

This ensures that `box-sizing: border-box` only gets applied to non-Spectrum-design-elements.
