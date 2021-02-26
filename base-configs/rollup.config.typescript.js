import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

import {
	defaultLicensePlugin,
	defaultResolvePlugin,
	defaultTerserPlugin,
	defaultTypeScriptPlugin,
	monorepoPackages
} from './rollup.base';

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
				defaultResolvePlugin,
				commonjs(),
				defaultTypeScriptPlugin,
				defaultTerserPlugin,
				defaultLicensePlugin
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
			plugins: [dts(), defaultLicensePlugin],
			external: [
				...Object.keys(packageJson.dependencies || {}),
				...monorepoPackages,
				...additionalExternals
			]
		}
	];
}
