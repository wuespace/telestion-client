import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

import { monorepoPackages } from './rollup.base';

export default function buildConfig(
	inputPath,
	packageJson,
	typesRoot,
	additionalExternals = []
) {
	return [
		{
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
				typescript({
					tsconfig: 'tsconfig.build.json',
					useTsconfigDeclarationDir: true
				}),
				terser({
					format: {
						comments: 'some'
					}
				})
			],
			external: [
				...Object.keys(packageJson.dependencies || {}),
				...monorepoPackages,
				...additionalExternals
			]
		},
		{
			input: typesRoot,
			output: [
				{
					file: packageJson.types,
					format: 'es'
				}
			],
			plugins: [dts()]
		}
	];
}
