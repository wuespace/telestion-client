const createWidgetTSX = require('./createWidgetTSX');
const createWidgetIndexTS = require('./createWidgetIndexTS');

const fs = require('fs');
const path = require('path');
const { INSERT_BELOW, INSERT_ABOVE, modifyFile } = require('../../modify-file');
const logger = require('../lib/logger')('widget-generator');

function generateWidget(argv) {
	const widgetsFolder = path.join(process.cwd(), 'src', 'widgets');
	if (
		!fs.existsSync(widgetsFolder) ||
		!fs.lstatSync(widgetsFolder).isDirectory()
	) {
		logger.error('It looks like your not inside a Telestion PSC Folder.');
		logger.info("Expected to find folder ./src/widgets, but couldn't.");
		logger.info('Please re-run this command inside a PSC directory.');
		process.exit(1);
	}

	const safeName = argv['name'].toLowerCase().split(' ').join('_');
	const widgetFolder = path.join(widgetsFolder, safeName);
	fs.mkdirSync(widgetFolder);
	createWidgetIndexTS(widgetFolder, safeName);
	createWidgetTSX(widgetFolder, safeName);

	let allWidgetsIndexFile = path.join(widgetsFolder, 'index.ts');
	modifyFile(allWidgetsIndexFile, [
		{
			needle: '// IMPORT_INSERT_MARK',
			position: INSERT_ABOVE,
			text: `import { widget as ${safeName} } from './${safeName}';`
		},
		{
			needle: '// ARRAY_FIRST_ELEMENT_INSERT_MARK',
			position: INSERT_BELOW,
			text: safeName + ','
		}
	]);
}

module.exports = generateWidget;
