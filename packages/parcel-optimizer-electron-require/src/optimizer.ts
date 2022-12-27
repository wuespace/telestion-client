import { Optimizer } from '@parcel/plugin';

const fix = `// Fix Electron renderer "require()" without a module issue
// see: https://github.com/parcel-bundler/parcel/issues/2492
if (typeof require !== "undefined" && typeof module === "undefined") {
    var module = { require: require };
}

`;

export default new Optimizer({
	optimize({ contents, map }) {
		map?.offsetLines(1, fix.split('\n').length - 1);
		return {
			contents: fix + (contents as string),
			map
		};
	}
});
