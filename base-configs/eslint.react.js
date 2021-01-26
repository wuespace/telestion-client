const path = require('path');

module.exports = {
	root: true,
	plugins: ['react'],
	settings: {
		react: {
			version: 'detect'
		}
	},
	extends: [
		path.join(__dirname, 'eslint.typescript.js'),
		'airbnb/hooks',
		'plugin:react/recommended',
		'prettier/react'
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	},
	rules: {
		// React v17 allows usage of jsx without importing React
		// https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
		'react/react-in-jsx-scope': 'off',
		// Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
		'react/destructuring-assignment': 'off',
		// No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
		'react/jsx-filename-extension': 'off',
		// please use object default values instead
		// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props
		'react/require-default-props': 'off',
		// warn on missing key props
		// https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
		'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
		// too restrictive, libraries also don't have better prop types
		'react/forbid-prop-types': [
			'error',
			{
				forbid: ['any']
			}
		]
	},
	overrides: [
		{
			files: ['**/*.tsx'],
			rules: {
				// disable explicit return types for React components
				// because React.FC is discouraged
				// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components
				// https://github.com/facebook/create-react-app/pull/8177
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				// hooks (especially useEffect) can have inconsistent return types
				// but TypeScript will check that so its safe to disable
				'consistent-return': 'off'
			}
		}
	]
};
