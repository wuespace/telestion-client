import { join } from 'path';
import buildConfig from '../../base-configs/rollup.config.typescript';

const packageJson = require('./package.json');
const buildTsConfig = require('./tsconfig.build.json');

export default buildConfig(
	join(process.cwd(), 'src', 'index.ts'),
	packageJson,
	join(
		process.cwd(),
		buildTsConfig.compilerOptions.declarationDir,
		'index.d.ts'
	),
	['http']
);
