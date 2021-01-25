import { join } from 'path';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import license from 'rollup-plugin-license';
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

export const defaultResolvePlugin = resolve({ preferBuiltins: true });

export const defaultTypeScriptPlugin = typescript({
	tsconfig: 'tsconfig.build.json',
	useTsconfigDeclarationDir: true
});

export const defaultLicensePlugin = license({
	sourcemap: true,
	cwd: process.cwd(),
	banner: {
		commentStyle: 'ignored',
		content: {
			file: join(__dirname, 'LICENSE'),
			encoding: 'utf-8'
		}
	}
});

export const defaultTerserPlugin = terser({
	format: {
		comments: 'some'
	},
	keep_classnames: true,
	keep_fnames: true
});
