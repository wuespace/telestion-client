import { Resolver } from '@parcel/plugin';
import { join } from 'path';

export default new Resolver({
	async resolve({ specifier, options, logger }) {
		// skip any other dependency
		if (specifier !== 'react') {
			return null;
		}

		const workspaceTagPath = join(options.projectRoot, 'workspace.txt');
		logger.log({
			message: `Workspace tag path: ${workspaceTagPath}`
		});

		// workspace tag doesn't exist -> no need to specify path to react directly
		if (!(await options.inputFS.exists(workspaceTagPath))) {
			return {
				invalidateOnFileChange: [workspaceTagPath]
			};
		}

		const reactIndexPath = join(
			options.projectRoot,
			'node_modules',
			'react',
			'index.js'
		);
		logger.log({
			message: `React index.js path: ${reactIndexPath}`
		});

		if (!(await options.inputFS.exists(reactIndexPath))) {
			logger.warn({
				message:
					"The Telestion custom resolver couldn't find react in the default location."
			});
			return {
				invalidateOnFileChange: [workspaceTagPath, reactIndexPath]
			};
		}
		return {
			filePath: reactIndexPath,
			invalidateOnFileChange: [workspaceTagPath, reactIndexPath]
		};
	}
});
