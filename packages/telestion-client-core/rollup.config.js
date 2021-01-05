imAuthRouteport { join } from 'path';
import buildConfig from '../../rollup.config.react';

const packageJson = require('./package.json');

export default buildConfig(join(process.cwd(), 'src', 'index.ts'), packageJson);
