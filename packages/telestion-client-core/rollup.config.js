import buildConfig from '../../rollup.config.base';

const packageJson = require('./package.json');

export default buildConfig('src/index.ts', packageJson);
