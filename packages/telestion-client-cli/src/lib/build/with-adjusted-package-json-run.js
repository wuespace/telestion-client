const fs = require('fs');
const path = require('path');

/**
 * Adjusts the `package.json` for compilation (moving dependencies to devDependencies), runs the callback function,
 * and then restores the `package.json` to its original state.
 *
 * The original `package.json`, during the operation, gets stored next to the adjusted one in the file `package.orig.json`.
 *
 * @param {string} projectRoot - the path to the PSC's root directory
 * @param {function(): Promise<*>} fn - the callback function that gets called while the package.json is adjusted.
 * @return {Promise<void>}
 */
async function withAdjustedPackageJsonRun(projectRoot, fn) {
	// temporarily replace package.json
	const packageJSONPath = path.join(projectRoot, 'package.json');
	const tempPackageJSONPath = path.join(projectRoot, 'package.orig.json');
	const origPackageJSONContent = fs.readFileSync(packageJSONPath).toString();
	fs.writeFileSync(tempPackageJSONPath, origPackageJSONContent);

	const oldPackageJSON = JSON.parse(origPackageJSONContent);
	const newPackageJSON = {
		...oldPackageJSON,
		dependencies: {},
		devDependencies: {
			...oldPackageJSON.dependencies,
			...oldPackageJSON.devDependencies
		}
	};
	fs.writeFileSync(packageJSONPath, JSON.stringify(newPackageJSON));

	await fn();

	fs.writeFileSync(packageJSONPath, origPackageJSONContent);
	fs.rmSync(tempPackageJSONPath);
}

module.exports = withAdjustedPackageJsonRun;
