const chalk = require('chalk');
const debug = require('debug')('generalDebug');
const { Logger, ChalkLogger } = require('@fliegwerk/logsemts');

const chalkLogger = ChalkLogger(chalk);

const logger = new Logger({
	loggers: [
		(type, style, componentName, componentType, ...rest) => {
			if (type === 'DEBUG') {
				debug(`${type}:`, ...rest);
			} else {
				chalkLogger(type.padEnd(7, ' '), style, componentName, componentType, ...rest);
			}
		}
	]
});

module.exports = name => logger.getComponentLogger(name);
