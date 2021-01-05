import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export const monorepoPackages = [
	'@wuespace/mock-server',
	'@wuespace/telestion-client-cli',
	'@wuespace/telestion-client-common',
	'@wuespace/telestion-client-core',
	'@wuespace/telestion-client-prop-types',
	'@wuespace/telestion-client-template',
	'@wuespace/telestion-client-types',
	'@wuespace/vertx-event-bus'
];

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
			terser()
		],
		external: [
			...Object.keys(packageJson.dependencies || {}),
			...monorepoPackages
		]
	};
}
