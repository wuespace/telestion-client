#!/usr/bin/env node

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
	console.error(err);
	throw err;
});

const path = require('path');
const fs = require('fs');
const glob = require('glob');

/**
 * Replaces the versions of all occurrences of package names
 * with the given version in the dependency object.
 *
 * @param dependencies - the dependency object to update
 * @param packageNames - he valid package names
 * to replace their versions with the given one
 * @param version - the new version to replace with the old
 *
 * @returns the edited dependency object.
 */
function updateDependenciesObject(dependencies, packageNames, version) {
	if (typeof dependencies !== 'object' || Array.isArray(dependencies)) {
		throw new Error('The dependencies property has an invalid type.');
	}

	return Object.keys(dependencies).reduce((accumulator, key) => {
		if (packageNames.includes(key)) {
			accumulator[key] = version;
		} else {
			accumulator[key] = dependencies[key];
		}
		return accumulator;
	}, {});
}

/**
 * Replaces the versions of all occurrences of package names
 * with the given version in the package.json.
 *
 * @param packageJson - the package json object
 * @param packageNames - the valid package names
 * to replace their versions with the given one
 * @param version - the new version to replace with the old
 *
 * @returns the edited package json object
 */
function replacePackageVersions(packageJson, packageNames, version) {
	if (typeof packageJson !== 'object' || Array.isArray(packageJson)) {
		throw new Error('package.json has invalid type.');
	}

	// update dependencies
	const newDependencies =
		'dependencies' in packageJson
			? updateDependenciesObject(
					packageJson.dependencies,
					packageNames,
					version
			  )
			: {};
	// update devDependencies
	const newDevDependencies =
		'devDependencies' in packageJson
			? updateDependenciesObject(
					packageJson.devDependencies,
					packageNames,
					version
			  )
			: {};

	return {
		...packageJson,
		dependencies: newDependencies,
		devDependencies: newDevDependencies,
		version
	};
}

/**
 * Replaces all versions of all project packages with the given version
 * used in this package.
 *
 * @param packagePath - the path to the package to edit
 * @param packageNames - the valid package names
 * to replace their versions with the given one
 * @param version - the new version to replace with the old
 */
function editPackageJson(packagePath, packageNames, version) {
	const packageJsonPath = path.join(packagePath, 'package.json');

	if (!fs.existsSync(packageJsonPath)) {
		console.warn('package.json does not exist in package:', packagePath);
		return;
	}

	// load package.json
	const packageJson = require(packageJsonPath);

	console.log('Replace versions for package:', packageJson.name);
	// edit it
	const newPackageJson = replacePackageVersions(
		packageJson,
		packageNames,
		version
	);

	// and store them
	fs.writeFileSync(
		packageJsonPath,
		JSON.stringify(newPackageJson, null, '\t'),
		{
			encoding: 'utf-8'
		}
	);
}

/**
 * Returns the name of the package.
 * @param packagePath - the path to the package to resolve
 * @returns {string | undefined} the name of the package
 */
function getPackageName(packagePath) {
	const packageJsonPath = path.join(packagePath, 'package.json');

	if (!fs.existsSync(packageJsonPath)) {
		console.warn('package.json does not exist in package:', packagePath);
		return;
	}

	// load package.json
	const packageJson = require(packageJsonPath);

	return typeof packageJson.name === 'string' ? packageJson.name : undefined;
}

require('yargs').command(
	'$0 [newVersion]',
	'replace the versions',
	yargs =>
		yargs.positional('newVersion', {
			type: 'string',
			describe: 'The new version',
			required: false
		}),
	argv => {
		const lernaJsonPath = path.join(process.cwd(), 'lerna.json');

		if (!fs.existsSync(lernaJsonPath)) {
			console.error('lerna.json does not exist.');
			console.error('Please go into the project root and try again.');
			process.exit(1);
		}

		// pull current project version and paths to all packages
		const { version, packages } = require(lernaJsonPath);

		// contains all paths to all project packages
		const packagePaths = packages
			.map(packagesPath => path.join(process.cwd(), packagesPath))
			.reduce((accumulator, packagesPath) => {
				accumulator.push(...glob.sync(packagesPath));
				return accumulator;
			}, []);

		// contains all package names in the project
		const packageNames = packagePaths.map(packagePath =>
			getPackageName(packagePath)
		);

		// update package.json in all packages
		for (const packagePath of packagePaths) {
			editPackageJson(packagePath, packageNames, argv['newVersion'] || version);
		}

		console.log('Finished');
	}
).argv;
