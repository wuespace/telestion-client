import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { GenerateOptions } from './model.mjs';
import { findGenerator, generatorNames } from './generators/index.mjs';
import { getPSCRoot } from '../../actions/psc.mjs';
import * as process from 'process';

const logger = getLogger('Command');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runGenerateCommand(
	options: GenerateOptions
): Promise<unknown[]> {
	logger.debug('Received options:', options);

	try {
		const pscRoot = await getPSCRoot(process.cwd());
		const generator = findGenerator(options.generator);
		await generator.generate(pscRoot, options.name);
		return [];
	} catch (e) {
		return [e];
	}
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrateGenerateOptions(
	options: BaseWithPartial<GenerateOptions>
): Promise<GenerateOptions> {
	return inquirer.prompt<GenerateOptions>(
		[
			{
				type: 'list',
				name: 'generator',
				message: 'What do you want to generate?',
				choices: generatorNames()
			},
			{
				type: 'input',
				name: 'name',
				message: 'What name do you want to use for it?'
			}
		],
		options
	);
}
