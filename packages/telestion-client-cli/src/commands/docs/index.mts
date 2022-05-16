import { CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { runDocsCommand } from './command.mjs';

const logger = getLogger('Docs Command');

export const docsCommandBuilder: CommandBuilder = command => {
	command
		.command('docs')
		.description('Opens the Telestion Docs')
		.action(async () => {
			let errors: unknown[] = [];
			try {
				errors = await runDocsCommand();
			} catch (err) {
				errors.push(err);
			}

			if (errors.length > 0) {
				errors.forEach(error => logger.error(error));
				process.exit(1);
			}
			process.exit(0);
		});
};

export * from './command.mjs';
