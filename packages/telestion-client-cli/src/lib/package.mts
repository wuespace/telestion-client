import validate from 'validate-npm-package-name';

/**
 * Scrapes an object that represents a valid `package.json` for their version.
 * @param packageJson - the object that represents a valid `package.json`
 */
export async function getVersion(
	packageJson: Record<string, unknown>
): Promise<string> {
	if (!packageJson.hasOwnProperty('version')) {
		throw new Error('The provided package.json has no version');
	}

	if (typeof packageJson['version'] !== 'string') {
		throw new Error(
			`The provided package.json has an invalid version type: Expected: string, Got: ${typeof packageJson[
				'version'
			]}`
		);
	}

	return packageJson['version'];
}

/**
 * Scrapes an object that represents a valid 'package.json' for the binary field.
 * @param packageJson - the object that represents a valid `package.json`
 */
export async function getBinaries(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
	if (!packageJson.hasOwnProperty('bin')) {
		return {}; // empty object and everyone is happy :)
	}

	if (
		typeof packageJson['bin'] !== 'object' ||
		Array.isArray(packageJson['bin'])
	) {
		throw new Error(
			`The provided package.json has an invalid binary definition: Expected: object, Got: ${typeof packageJson[
				'bin'
			]}`
		);
	}

	const binaries = packageJson['bin'] as Record<string, unknown>;

	Object.keys(binaries).forEach(key => {
		if (typeof binaries[key] !== 'string') {
			throw new Error(
				`The binary ${key} has an invalid path specifier: Expected: string, Got: ${typeof binaries[
					key
				]}`
			);
		}
	});

	return binaries as Record<string, string>;
}

/**
 * Scrapes an object that represents a valid `package.json` for production dependencies.
 * @param packageJson - the object that represents a valid `package.json`
 */
export async function getDependencies(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
	// package.json has no production dependencies
	if (!packageJson.hasOwnProperty('dependencies')) return {};

	if (
		typeof packageJson['dependencies'] !== 'object' ||
		Array.isArray(packageJson['dependencies'])
	) {
		throw new Error(
			`The provided package.json has invalid production dependencies: Expected: object, Got: ${typeof packageJson[
				'dependencies'
			]}`
		);
	}

	const dependencies =
		(packageJson['dependencies'] as Record<string, unknown>) || {};

	Object.keys(dependencies).forEach(key => {
		if (typeof dependencies[key] !== 'string') {
			throw new Error(
				`The dependency ${key} has an invalid version specifier: Expected: string, Got: ${typeof dependencies[
					key
				]}`
			);
		}
	});

	return dependencies as Record<string, string>;
}

/**
 * Scrapes an object that represents a valid `package.json` for development dependencies.
 * @param packageJson - the object that represents a valid `package.json`
 */
export async function getDevDependencies(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
	// package.json has no production dependencies
	if (!packageJson.hasOwnProperty('devDependencies')) return {};

	if (
		typeof packageJson['devDependencies'] !== 'object' ||
		Array.isArray(packageJson['devDependencies'])
	) {
		throw new Error(
			`The provided package.json has invalid development dependencies: Expected: object, Got: ${typeof packageJson[
				'devDependencies'
			]}`
		);
	}

	const devDependencies =
		(packageJson['devDependencies'] as Record<string, unknown>) || {};

	Object.keys(devDependencies).forEach(key => {
		if (typeof devDependencies[key] !== 'string') {
			throw new Error(
				`The dependency ${key} has an invalid version specifier: Expected: string, Got: ${typeof devDependencies[
					key
				]}`
			);
		}
	});

	return devDependencies as Record<string, string>;
}

/**
 * Takes a pretty project name (e.g. from user input) and returns a valid npm project name.
 * @param prettyName - the pretty project name to transform
 */
export async function normalizeProjectName(
	prettyName: string
): Promise<string> {
	// replace whitespaces with minus symbols
	const normalized = prettyName.toLowerCase().replaceAll(/\s/gm, '-');
	const results = validate(normalized);
	if (!results.validForNewPackages) {
		const errors = [...(results.errors || []), ...(results.warnings || [])];
		throw new Error('Normalized package name is invalid: ' + errors.join(', '));
	}

	return normalized;
}
