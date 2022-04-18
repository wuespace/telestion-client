import { CommandBuilder } from '../../model/index.mjs';
import { getLogger } from '../../lib/index.mjs';

import { docs } from './command.mjs';

const logger = getLogger('Docs Command');

export const build: CommandBuilder = command => {
	command
		.command('docs')
		.description('Opens the Telestion Docs')
		.action(async () => {
			let errors: unknown[] = [];
			try {
				errors = await docs();
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
