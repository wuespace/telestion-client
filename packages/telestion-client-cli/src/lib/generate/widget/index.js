const createWidgetTSX = require('./createWidgetTSX');
const createWidgetIndexTS = require('./createWidgetIndexTS');

const fs = require('fs');
const path = require('path');
const { camelCase, paramCase } = require('change-case');
const { INSERT_BELOW, INSERT_ABOVE, modifyFile } = require('../../modify-file');
const logger = require('../../logger')('widget-generator');

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

	const nameAsCamelCase = camelCase(argv['name']);
	const folderName = paramCase(argv['name']);
	const widgetFolder = path.join(widgetsFolder, folderName);
	fs.mkdirSync(widgetFolder);
	createWidgetIndexTS(widgetFolder, nameAsCamelCase);
	createWidgetTSX(widgetFolder, nameAsCamelCase);

	let allWidgetsIndexFile = path.join(widgetsFolder, 'index.ts');
	modifyFile(allWidgetsIndexFile, [
		{
			needle: '// IMPORT_INSERT_MARK',
			position: INSERT_ABOVE,
			text: `import { widget as ${nameAsCamelCase} } from './${folderName}';`
		},
		{
			needle: '// ARRAY_FIRST_ELEMENT_INSERT_MARK',
			position: INSERT_BELOW,
			text: nameAsCamelCase + ','
		}
	]);

	logger.success(`Widget ${nameAsCamelCase} created successfully.`);
	logger.info(`You can find it at ${widgetFolder}.`);
}

module.exports = generateWidget;
