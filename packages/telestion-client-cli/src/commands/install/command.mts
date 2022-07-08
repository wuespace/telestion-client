import ora from 'ora';

import { getLogger } from '../../lib/index.mjs';
import { pnpmAdd } from '../../actions/pnpm.mjs';
import { getPSCRoot } from '../../actions/psc.mjs';
import { DependencyType, InstallOptions } from './model.mjs';

const logger = getLogger('Install');

/**
 * Installs a dependency to a Telestion Project.
 * @param type - The usage scope of the dependency you want to install
 * @param dependencies - The package names of the dependencies you want to install
 * @param options - the complete options set
 */
export async function runInstallCommand(
	type: DependencyType,
	dependencies: string[],
	options: InstallOptions
): Promise<void> {
	logger.debug('Received arguments:', type, dependencies);
	logger.debug('Received options:', options);

	const dependenciesPrint = dependencies
		.map(dependency => `'${dependency}'`)
		.join(' ');
	const spinner = ora(`Install dependencies ${dependenciesPrint}`);

	try {
		spinner.start();
		const projectDir = await getPSCRoot(options.workingDir);
		await pnpmAdd(projectDir, dependencies, type);
		logger.info(
			'Added dependencies',
			dependenciesPrint,
			'as',
			type,
			'to project'
		);
		spinner.succeed(`Dependencies ${dependenciesPrint} successfully installed`);
	} catch (err) {
		spinner.fail(`Cannot install dependencies ${dependenciesPrint}`);
		throw err;
	}
}
