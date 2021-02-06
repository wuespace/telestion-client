const fs = require('fs');
const path = require('path');

const logger = require('../lib/logger')('stats');

// yargs def
const command = ['stats', 't'];
const desc =
	'Displays some interesting stats around a Telestion Frontend project';

function builder(yargs) {
	return yargs.option('json', {
		describe: 'Output the statistics as JSON',
		alias: 'j',
		default: false,
		boolean: true
	});
}

async function handler(argv) {
	logger.debug('Arguments:', argv);

	const projectPath = process.cwd();

	const packageJSONPath = path.join(projectPath, 'package.json');
	verifyCWDIsPSCProjectFolder(projectPath, argv);

	const { name, version, dependencies } = JSON.parse(
		fs.readFileSync(packageJSONPath).toString()
	);
	const widgets = getWidgets(projectPath);
	reportStats({
		json: argv['json'],
		name,
		version,
		dependencies,
		widgets,
		projectPath
	});
}

function verifyCWDIsPSCProjectFolder(projectPath, argv) {
	const noPSCDirErrorMessage =
		'Not called in a PSC directory. Expected to find package.json and ./src/widgets, but at least one was not found.';
	if (
		!fs.existsSync(path.join(projectPath, 'package.json')) ||
		!fs.existsSync(path.join(projectPath, 'src', 'widgets'))
	) {
		if (argv.json) {
			console.log(
				JSON.stringify({
					error: noPSCDirErrorMessage
				})
			);
		} else {
			logger.error(noPSCDirErrorMessage);
			logger.info(
				'Please try calling the command again inside a PSC directory'
			);
		}
	}
}

function getWidgets(projectPath) {
	return fs
		.readdirSync(path.join(projectPath, 'src', 'widgets'))
		.filter(
			file =>
				fs
					.lstatSync(path.join(projectPath, 'src', 'widgets', file))
					.isDirectory() && !file.startsWith('.')
		);
}

function reportStats({
	json,
	name,
	version,
	dependencies,
	widgets,
	projectPath
}) {
	if (json) {
		logger.info(
			`Statistics for the Telestion PSC project ${name ?? 'Anonymous'} @ ${
				version ?? 'Unknown version'
			}`
		);
		logger.info('Dependencies:', Object.keys(dependencies).length);
		logger.info(
			'Widgets (',
			widgets.length,
			'):\n',
			widgets
				.map(s => `- ${s} (${path.join(projectPath, 'src', 'widgets', s)})`)
				.join('\n')
		);
	} else {
		console.log({
			name,
			version,
			widgets,
			dependencies: Object.keys(dependencies)
		});
	}
}

module.exports = {
	command,
	desc,
	builder,
	handler
};
