const debug = require('debug')('generate');
const logger = require('../lib/logger')('generate');
const fs = require('fs');
const path = require('path');

// yargs def
const command = ['generate <component> <name>', 'g'];
const desc = 'Adds a new component to an existing Telestion Frontend Project';

function builder(yargs) {
	return yargs
		.positional('component', {
			describe: 'The component type to add',
			type: 'string'
		})
		.positional('name', {
			describe: 'The new component name',
			type: 'string'
		});
}

async function handler(argv) {
	// gathering information
	debug('Arguments:', argv);

	// for implementation examples, look at the @server-state/cli refactoring branch
	if (argv['component'] === 'widget' || argv['component'] === 'w') {
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

		fs.writeFileSync(
			path.join(widgetFolder, 'index.ts'),
			`import { Widget } from "@wuespace/telestion-client-types";
import { Widget as WidgetRenderer } from "./widget";

export const widget: Widget = {
\tname: '${safeName}',
\tWidget: WidgetRenderer
};
`
		);
		fs.writeFileSync(
			path.join(widgetFolder, 'widget.tsx'),
			`import { Heading } from '@adobe/react-spectrum';

export function Widget() {
\treturn <Heading level={2}>${safeName} widget</Heading>;
}
`
		);

		let overallIndexFile = path.join(widgetsFolder, 'index.ts');
		const initialIndexTS = fs
			.readFileSync(overallIndexFile, 'utf8')
			.toString()
			.split('\r\n')
			.join('\n')
			.split('\n');

		const importIndex = initialIndexTS.findIndex(line =>
			/^\s*\/\/ IMPORT_INSERT_MARK$/.exec(line)
		);
		initialIndexTS.splice(
			importIndex,
			1,
			initialIndexTS[importIndex].replace(
				'// IMPORT_INSERT_MARK',
				`import { widget as ${safeName} } from './${safeName}';`
			),
			initialIndexTS[importIndex]
		);

		const arrayIndex = initialIndexTS.findIndex(line =>
			/^\s*\/\/ ARRAY_FIRST_ELEMENT_INSERT_MARK$/.exec(line)
		);

		initialIndexTS.splice(
			arrayIndex,
			1,
			initialIndexTS[arrayIndex],
			initialIndexTS[arrayIndex].replace(
				'// ARRAY_FIRST_ELEMENT_INSERT_MARK',
				`${safeName},`
			)
		);

		fs.writeFileSync(overallIndexFile, initialIndexTS.join('\n'));
	} else {
		logger.error('Invalid component type. Can only generate "widget".');
		process.exit(1);
	}
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
