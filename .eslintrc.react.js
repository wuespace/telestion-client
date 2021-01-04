module.exports = {
	env: {
		browser: true,
		es2020: true
	},
	plugins: ['react'],
	settings: {
		react: {
			version: 'detect'
		}
	},
	extends: [
		'./.eslintrc.js',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'prettier/react'
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 11,
		sourceType: 'module'
	},
	rules: {
		// https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
		'import/prefer-default-export': 'off',
		'import/no-default-export': 'error',
		// React v17 allows usage of jsx without importing React
		// https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
		'react/react-in-jsx-scope': 'off',
		// Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
		'react/destructuring-assignment': 'off',
		// No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
		'react/jsx-filename-extension': 'off'
	}
};
