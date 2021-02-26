import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from '@rollup/plugin-image';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
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
				image(),
				defaultResolvePlugin,
				commonjs(),
				defaultTypeScriptPlugin,
				postcss(),
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
