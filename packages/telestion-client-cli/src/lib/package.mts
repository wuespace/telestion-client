import validate from 'validate-npm-package-name';

/**
 * Searches for the package name in a parsed `package.json` JSON object.
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function getName(
	packageJson: Record<string, unknown>
): Promise<string> {
	if (!packageJson.hasOwnProperty('name')) {
		throw new Error('The provided package.json has no name');
	}

	if (typeof packageJson['name'] !== 'string') {
		throw new Error(
			`The provided package.json has an invalid name type: Expected: string, Got: ${typeof packageJson[
				'name'
			]}`
		);
	}

	return packageJson['name'];
}

/**
 * Searches for the package description in a parsed `package.json` JSON object.
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function getDescription(
	packageJson: Record<string, unknown>
): Promise<string> {
	if (!packageJson.hasOwnProperty('description')) {
		throw new Error('The provided package.json has no name');
	}

	if (typeof packageJson['description'] !== 'string') {
		throw new Error(
			`The provided package.json has an invalid description type: Expected: string, Got: ${typeof packageJson[
				'description'
			]}`
		);
	}

	return packageJson['description'];
}

/**
 * Searches for the package version in a parsed `package.json` JSON object.
 * @param packageJson - the parsed `package.json` JSON object
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
 * Searches for exported binaries in a parsed `package.json` JSON object
 * and returns an empty object if the `package.json` doesn't contain
 * any exported binaries.
 *
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function getBinaries(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
	if (!packageJson.hasOwnProperty('bin')) return {};

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
 * Searches for production dependencies in a parsed `package.json` JSON object
 * and returns an empty object if the `package.json` doesn't contain
 * any production dependencies.
 *
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function getDependencies(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
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

	const dependencies = packageJson['dependencies'] as Record<string, unknown>;

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
 * Searches for development dependencies in a parsed `package.json` JSON object
 * and returns an empty object if the `package.json` doesn't contain
 * any development dependencies.
 *
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function getDevDependencies(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
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

	const devDependencies = packageJson['devDependencies'] as Record<
		string,
		unknown
	>;

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
 * Searches for Electron dependencies in a parsed `package.json` JSON object
 * and returns an empty array if the `package.json` doesn't contain
 * any Electron dependencies.
 *
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function getElectronDependencies(
	packageJson: Record<string, unknown>
): Promise<string[]> {
	if (!packageJson.hasOwnProperty('electronDependencies')) return [];

	if (!Array.isArray(packageJson['electronDependencies'])) {
		throw new Error(
			`The provided package.json has invalid Electron dependencies: Expected: object, Got: ${typeof packageJson[
				'electronDependencies'
			]}`
		);
	}

	const electronDependencies = packageJson['electronDependencies'] as unknown[];

	for (const dependency of electronDependencies) {
		if (typeof dependency !== 'string') {
			throw new Error(
				`The dependency has an invalid type: Expected: string, Got: ${typeof dependency}`
			);
		}
	}

	return electronDependencies as string[];
}

/**
 * Searches for production and Electron dependencies.
 * The production dependencies are filtered through the Electron dependency list
 * resulting in the final production dependencies
 * that Electron needs in the main process.
 *
 * @param packageJson - the parsed `package.json` JSON object
 */
export async function resolveElectronDependencies(
	packageJson: Record<string, unknown>
): Promise<Record<string, string>> {
	const electronDependencies = await getElectronDependencies(packageJson);
	const dependencies = await getDependencies(packageJson);

	return Object.keys(dependencies).reduce((acc, specifier) => {
		if (electronDependencies.includes(specifier)) {
			acc[specifier] = dependencies[specifier];
		}
		return acc;
	}, {} as Record<string, string>);
}

/**
 * Takes a pretty project name (e.g. from user input)
 * and returns a valid npm project name.
 *
 * @param prettyName - the pretty project name to transform
 */
export async function normalizeProjectName(
	prettyName: string
): Promise<string> {
	// replace whitespaces with minus symbols
	const normalized = prettyName.toLowerCase().split(/\s/gm).join('-');
	const results = validate(normalized);
	if (!results.validForNewPackages) {
		const errors = [...(results.errors || []), ...(results.warnings || [])];
		throw new Error('Normalized package name is invalid: ' + errors.join(', '));
	}

	return normalized;
}
