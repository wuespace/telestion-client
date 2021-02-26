import { join } from 'path';
import {
	buildReactLibrary,
	buildTSDeclarations
} from '../../base-configs/rollup.builders';

const buildTsConfig = require('./tsconfig.build.json');

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

export default [buildReactLibrary(paths), buildTSDeclarations(paths)];
