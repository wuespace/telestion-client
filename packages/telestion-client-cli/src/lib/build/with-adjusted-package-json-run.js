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
 * @return {Promise<*>} resolves or rejects with the fn's return value
 *
 * @example
 * ```js
 * const results = await withAdjustedPackageJsonRun(projectRoot, packageElectronApp);
 * console.log({ results });
 * ```
 */
async function withAdjustedPackageJsonRun(projectRoot, fn) {
	// temporarily replace package.json
	const packageJSONPath = path.join(projectRoot, 'package.json');
	const tempPackageJSONPath = path.join(projectRoot, 'package.orig.json');
	const origPackageJSONContent = fs.readFileSync(packageJSONPath).toString();
	fs.writeFileSync(tempPackageJSONPath, origPackageJSONContent);

	// move all dependencies to the devDependencies
	// TODO: Keep "native" dependencies registered in the config as dependencies in the modified package.json
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

	// call the function
	const result = await fn();

	// reset package.json to original state
	fs.writeFileSync(packageJSONPath, origPackageJSONContent);
	fs.rmSync(tempPackageJSONPath);

	// return fn's return value
	return result;
}

module.exports = withAdjustedPackageJsonRun;
