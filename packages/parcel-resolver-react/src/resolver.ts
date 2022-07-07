import { Resolver } from '@parcel/plugin';
import { join } from 'path';

/**
 * This Parcel Resolver overrides any imports of [React.js](https://reactjs.org/)
 * to include React only once and in one version only.
 * This prevents React from failing with
 * the [Invalid Hook Call Warning](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react).
 *
 * Note: This plugin is only active if you're using a workspace linked project.
 */
export default new Resolver({
	async resolve({ specifier, options, logger }) {
		// skip any other dependency
		if (specifier !== 'react') {
			return null;
		}

		const workspaceTagPath = join(options.projectRoot, 'workspace.txt');
		logger.verbose({
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
		logger.verbose({
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
