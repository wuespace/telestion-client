import { join } from 'path';
import { requireGood } from '../../base-configs/helpers.mjs';
import {
	buildTSDeclarations,
	buildTSLibrary
} from '../../base-configs/rollup.builders.mjs';

const buildTsConfig = requireGood(join(process.cwd(), 'tsconfig.build.json'));

/**
 * @type {BuildPaths}
 */
const paths = {
	packageJsonPath: join(process.cwd(), 'package.json'),
	inputPath: join(process.cwd(), 'src', 'index.ts'),
	typesRootPath: join(
		process.cwd(),
		buildTsConfig.compilerOptions.declarationDir,
		'index.d.ts'
	)
};

export default [buildTSLibrary(paths), buildTSDeclarations(paths)];
