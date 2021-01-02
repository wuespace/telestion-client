// .storybook/main.js

module.exports = {
	stories: ['../packages/*/src/components/**/*.stories.@(js|jsx|mdx|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
	],
};
