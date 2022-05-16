import inquirer from 'inquirer';

import { BaseWithPartial } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { TemplateOptions } from './model.mjs';
import { informationStage, processStage } from './stages.mjs';

const logger = getLogger('Command');

/**
 * The actual command.
 * @param options - the complete options set
 */
export async function runTemplateCommand(
	options: TemplateOptions
): Promise<unknown[]> {
	const errors: unknown[] = [];
	logger.debug('Received options:', options);

	const infos = await informationStage(options);
	const isProcessed = await processStage(options, infos);

	logger.info('Final results:', { infos, isProcessed });

	// some final words
	console.log(`Command xyz has run. Don't miss something here and here`);

	return errors;
}

/**
 * Asks the user some questions on some missing parts in the current options set.
 * @param options - the current options set (does not have to be complete)
 */
export async function hydrateTemplateOptions(
	options: BaseWithPartial<TemplateOptions>
): Promise<TemplateOptions> {
	return inquirer.prompt<TemplateOptions>(
		[
			{
				type: 'input',
				name: 'someProp',
				message: 'Tell me about your new prop:'
			}
		],
		options
	);
}
