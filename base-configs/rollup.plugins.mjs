import { join } from 'path';

import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';

import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

/**
 * Excludes all dependencies from the build.
 * Uses the package.json from the specified path.
 *
 * @param {string} packagePath - the path to the package.json to use
 * @param {string[]} [include=[]] - optional additional externals
 * @returns {Plugin}
 */
export const externalsPlugin = (packagePath, include) =>
	externals({
		packagePath,
		builtins: true,
		deps: true,
		peerDeps: true,
		optDeps: true,
		devDeps: true,
		include
	});

/**
 * Uses the node resolution algorithm to resolve imports.
 * @returns {Plugin}
 */
export const resolvePlugin = () => resolve({ preferBuiltins: true });

/**
 * Enables importing of commonjs packages via ES5 imports.
 * @returns {Plugin}
 */
export const commonJsPlugin = () => commonjs();

/**
 * A Rollup plugin which Converts .json files to ES6 modules.
 * @returns {Plugin}
 */
export const jsonPlugin = () => json();

/**
 * Transpiles TypeScript to valid JavaScript code
 * @returns {Plugin}
 */
export const typeScriptPlugin = () =>
	typescript({
		tsconfig: 'tsconfig.build.json',
		useTsconfigDeclarationDir: true
	});

/**
 * Generates type definitions from TypeScript source files.
 * @returns {Plugin}
 */
export const dtsPlugin = () => dts();

/**
 * Allows to import images and converts them to base64.
 * @returns {Plugin}
 */
export const imagePlugin = () => image();

/**
 * Allows the usage of PostCSS in CSS imports.
 * @returns {Plugin}
 */
export const postCssPlugin = () =>
	postcss({
		plugins: [
			url({
				url: 'inline'
			})
		]
	});

/**
 * Attaches the project license to every built file.
 * @returns {Plugin}
 */
export const licensePlugin = () =>
	license({
		sourcemap: true,
		cwd: process.cwd(),
		banner: {
			commentStyle: 'ignored',
			content: {
				file: join(process.cwd(), 'LICENSE'),
				encoding: 'utf-8'
			}
		}
	});

/**
 * Minifies and reduce bundled size of the package.
 * @returns {Plugin}
 */
export const terserPlugin = () =>
	terser({
		format: {
			comments: 'some'
		},
		keep_classnames: true,
		keep_fnames: true
	});

/**
 * Displays the file size of every built file.
 * @returns {Plugin}
 */
export const filesizePlugin = () => filesize();
