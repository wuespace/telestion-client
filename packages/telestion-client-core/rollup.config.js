import { join } from 'path';
import buildConfig from '../../rollup.config.base';

const packageJson = require('./package.json');

export default buildConfig(join(process.cwd(), 'src', 'index.ts'), packageJson);
