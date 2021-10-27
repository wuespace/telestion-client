/**
 * A custom webpack loader that fills a global constant `PLUGINS: Plugin[]` with the plugins provided by the
 * {@link webpack.ProvidePlugin} as `PLUGIN_0`, `PLUGIN_1`, ...
 *
 * @param {string} source the original source code of the file
 * @return {string} the modified source code
 */
function GlobalPluginsWebpackLoader(source) {
	const options = this.getOptions();

	return `const PLUGINS = [${options.plugins
		.map((path, index) => `PLUGIN_${index}`)
		.join(', ')}]

    ${source}`;
}

module.exports = GlobalPluginsWebpackLoader;
