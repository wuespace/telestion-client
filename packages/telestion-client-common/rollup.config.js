import path from 'path';
import buildConfig from '../../rollup.config.base';

const packageJson = require('./package.json');

export default buildConfig(
	path.join(process.cwd(), 'src', 'index.ts'),
	packageJson
);
