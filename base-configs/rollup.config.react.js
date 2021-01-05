import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

import { monorepoPackages } from './rollup.config.base';

export default function buildConfig(inputPath, packageJson) {
	return {
		input: inputPath,
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true
			}
		],
		plugins: [
			peerDepsExternal(),
			resolve({ preferBuiltins: true }),
			commonjs(),
			typescript({ useTsconfigDeclarationDir: true }),
			postcss(),
			terser()
		],
		external: [
			...Object.keys(packageJson.dependencies || {}),
			...monorepoPackages
		]
	};
}
